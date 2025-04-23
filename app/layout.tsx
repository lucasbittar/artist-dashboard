import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import NavBar from "./NavBar";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artist Scheduler",
  description: "Organize sua vida",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="min-h-screen bg-gradient-to-t from-violet-300 to-violet-400"
    >
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            <div className="min-hjfull">
              <NavBar />
              <main>
                <div className="mx-auto">{children}</div>
              </main>
            </div>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
