import './globals.css';
import './portfolio.css';
import './admin.css';

export const metadata = {
  title: 'My Portfolio',
  description: 'Showcasing my latest projects and work',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

