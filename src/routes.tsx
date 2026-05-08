import type { RouteRecord } from 'vite-react-ssg';
import App from './App';
import HomePage from './pages/HomePage';
import ChapterRoute from './pages/ChapterRoute';
import issue from './data/issue.json';

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: HomePage },
      {
        path: ':chapterKey',
        Component: ChapterRoute,
        // Tell vite-react-ssg which chapter URLs to pre-render at build time.
        getStaticPaths: () => issue.chapters.map((c) => `/${c.key}/`),
      },
    ],
  },
];
