import Navbar from '@/components/Navbar';
import theme from '@/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useLoadScript, LoadScript } from '@react-google-maps/api';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
const inter = Inter({ subsets: ["latin"] });
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "NYC MTA Rat Stats",
  description: "Consolidation of overtime data for NYC subway rat statistics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="flex flex-col min-h-screen">
              <header>
                <Navbar />
              </header>
              <main className="flex grow [max-height:92lvh]">
                {children}
              </main>
              <footer>
                <Footer />
              </footer>
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
