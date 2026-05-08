import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';

import './styles/base.css';
import './styles/layout.css';
import './styles/content.css';

const basename =
  import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

export const createRoot = ViteReactSSG({ routes, basename });
