import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "../styles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Расписание Бизнес и право",
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
