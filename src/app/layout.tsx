import type { Metadata } from "next";
import { Montserrat } from "next/font/google"
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Car Control App",
  description: "An app for getting in control of your car repair",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={montserrat.className}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
