import type { AppProps } from 'next/app';
import 'rich-text-editor-ndevu/styles';
import '../src/styles/app.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
