import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import packageInfo from '@/package.json';
import Favicon from '@/public/lcaicon.ico';
import { AlertProvider } from '@/components/AlertHandler';
import TransitionMonitoring from '@/components/TransitionMonitoring';
import VersionCheck from '@/components/VersionCheck';
import { ReactNode, Suspense } from 'react';
import { ErrorHandlerProvider } from '@/components/ErrorHandler';

export const metadata: Metadata = {
  title: '自動車LCA算定ツール',
  description: 'CFPアプリ参考実装例',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

const font = localFont({
  src: '../fonts/Noto_Sans_JP/NotoSansJP-VariableFont_wght.ttf',
  display: 'swap',
});

const footerText = `Version:${packageInfo.version}`

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang='ja' data-theme='default'>
      <head>
        <meta name='app:version' content={packageInfo.version} />
      </head>
      <body className={font.className}>
        <Suspense fallback={<div>...Loading</div>}>
          <VersionCheck/>
          <TransitionMonitoring />
          <ErrorHandlerProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </ErrorHandlerProvider>
        </Suspense>
        <footer className='w-[1424px] pl-8 text-xs bottom-0 right-0 left-0 fixed mx-auto'>
          {footerText}
        </footer>
      </body>
    </html>
  );
}
