import rollHouniao from '../data/rolls/2025-12-27-houniao-wan.json';
import rollYulong from '../data/rolls/2025-12-28-yulong.json';
import rollShangrila from '../data/rolls/2025-12-29-shangrila-napa.json';
import rollMeili1230 from '../data/rolls/2025-12-30-meili.json';
import rollMeili0101 from '../data/rolls/2026-01-01-meili.json';
import roll0430 from '../data/rolls/2026-04-30-sydney-city.json';
import roll0501 from '../data/rolls/2026-05-01-bondi-beach.json';
import roll0503am from '../data/rolls/2026-05-03-lone-pine.json';
import roll0503pm from '../data/rolls/2026-05-03-gold-coast.json';
import roll0504 from '../data/rolls/2026-05-04-boonah.json';

export const DAYS_BY_ID: Record<string, any> = {
  '2025-12-27-houniao-wan': rollHouniao,
  '2025-12-28-yulong': rollYulong,
  '2025-12-29-shangrila-napa': rollShangrila,
  '2025-12-30-meili': rollMeili1230,
  '2026-01-01-meili': rollMeili0101,
  '2026-04-30-sydney-city': roll0430,
  '2026-05-01-bondi-beach': roll0501,
  '2026-05-03-lone-pine': roll0503am,
  '2026-05-03-gold-coast': roll0503pm,
  '2026-05-04-boonah': roll0504,
};
