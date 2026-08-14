import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from '@/routes';

import '@/styles/base.css';
import '@/styles/layout/header.css';
import '@/styles/layout/lang.css';
import '@/styles/pages/home.css';
import '@/styles/pages/about.css';
import '@/styles/pages/chapter.css';
import '@/styles/components/viewer.css';
import '@/styles/components/cursor.css';
import '@/styles/components/content.css';

const basename =
  import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

export const createRoot = ViteReactSSG({ routes, basename });
