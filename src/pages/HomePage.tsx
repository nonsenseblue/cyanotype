import { Index } from '../components/Index';
import issue from '../data/issue.json';

export default function HomePage() {
  return (
    <article className="page" key="home">
      <Index issue={issue} />
    </article>
  );
}
