/**
 * scripts/upload_photos.mjs
 *
 * Push public/photos/<roll>/{large,thumbs}/*.jpg to the R2 bucket.
 * Originals stay local — only the web-served sizes go to R2.
 *
 * Required env (sourced from ~/.zshrc):
 *   R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 *
 * Usage:
 *   node scripts/upload_photos.mjs                  # all rolls, all sizes
 *   node scripts/upload_photos.mjs --roll 2025-12-28-yulong
 *   node scripts/upload_photos.mjs --force          # re-upload even if size matches
 */

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const PHOTOS_ROOT = "public/photos";
const SIZES = ["large", "thumbs"];

const args = process.argv.slice(2);
const rollArgIdx = args.indexOf("--roll");
const onlyRoll = rollArgIdx >= 0 ? args[rollArgIdx + 1] : null;
const force = args.includes("--force");

const missing = ["R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]
  .filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing env: ${missing.join(", ")}. source ~/.zshrc and retry.`);
  process.exit(1);
}

const BUCKET = process.env.R2_BUCKET;
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function alreadyUploaded(key, localSize) {
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return head.ContentLength === localSize;
  } catch (e) {
    if (e.$metadata?.httpStatusCode === 404 || e.name === "NotFound") return false;
    throw e;
  }
}

async function uploadFile(localPath, key) {
  const size = statSync(localPath).size;
  if (!force && (await alreadyUploaded(key, size))) {
    return "skipped";
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: readFileSync(localPath),
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return "uploaded";
}

async function uploadRoll(rollName) {
  const dir = join(PHOTOS_ROOT, rollName);
  console.log(`[${rollName}]`);
  let up = 0;
  let skipped = 0;
  for (const size of SIZES) {
    const sizeDir = join(dir, size);
    if (!existsSync(sizeDir)) continue;
    const files = readdirSync(sizeDir).filter((f) => f.toLowerCase().endsWith(".jpg")).sort();
    for (const file of files) {
      const localPath = join(sizeDir, file);
      const key = `${rollName}/${size}/${file}`;
      const result = await uploadFile(localPath, key);
      if (result === "uploaded") {
        console.log(`  → ${key}`);
        up++;
      } else {
        skipped++;
      }
    }
  }
  console.log(`  (${up} uploaded, ${skipped} already in sync)`);
}

const rolls = onlyRoll
  ? [onlyRoll]
  : readdirSync(PHOTOS_ROOT)
      .filter((d) => statSync(join(PHOTOS_ROOT, d)).isDirectory())
      .sort();

for (const roll of rolls) {
  await uploadRoll(roll);
}
console.log("done.");
