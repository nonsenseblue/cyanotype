import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import { ChapterPage } from '../components/ChapterPage';
import { DAYS_BY_ID } from '../lib/days';
import issue from '../data/issue.json';

type LayoutCtx = {
  lightbox: { open: (src: string) => void };
};

export default function ChapterRoute() {
  const { chapterKey } = useParams();
  const { lightbox } = useOutletContext<LayoutCtx>();

  const chapter = issue.chapters.find((c) => c.key === chapterKey);
  if (!chapter) return <Navigate to="/" replace />;

  const days = chapter.days
    .map((id) => DAYS_BY_ID[id])
    .filter(Boolean);

  const idx = issue.chapters.findIndex((c) => c.key === chapterKey);
  const nextChapter =
    idx >= 0 && idx < issue.chapters.length - 1
      ? issue.chapters[idx + 1]
      : null;

  return (
    <article className="page" key={chapter.key}>
      <ChapterPage
        chapter={chapter}
        days={days}
        issue={issue}
        nextChapter={nextChapter}
        onOpenLightbox={lightbox.open}
      />
    </article>
  );
}
