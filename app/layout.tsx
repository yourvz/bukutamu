import type { Metadata } from 'next';
import './globals.css';
import '../styles/modern.css';

export const metadata: Metadata = {
  title: 'Buku Tamu',
  description: 'Aplikasi Buku Tamu untuk mencatat pengunjung',
  icons: {
    icon: '/bukutamu/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="https://dishub.kaltimprov.go.id/storage/images/logo2.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
