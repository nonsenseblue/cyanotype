import { About } from '../components/About';
import issue from '../data/issue.json';

export default function AboutPage() {
  return (
    <article className="page" key="about">
      <About about={issue.about} />
    </article>
  );
}
