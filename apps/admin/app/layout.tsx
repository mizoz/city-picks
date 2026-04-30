import './styles.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'City Picks Admin',
  description: 'City-aware admin shell for local discovery recommendations.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <aside>
          <h1>City Picks</h1>
          <p>Admin shell</p>
          <nav>
            <a href="/">Overview</a>
            <a href="/cities">Cities</a>
            <a href="/events">Events</a>
            <a href="/submissions">Submissions</a>
            <a href="/venues">Venues</a>
            <a href="/promotions">Promotions</a>
            <a href="/data-sources">Data Sources</a>
          </nav>
        </aside>
        <main>{children}</main>
      </body>
    </html>
  );
}
