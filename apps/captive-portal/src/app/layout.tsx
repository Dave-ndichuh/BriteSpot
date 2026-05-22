import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Britespot Hotspot Login",
  description: "Connect to premium high-speed internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 min-h-screen relative overflow-hidden text-white`}>
        {/* Dynamic Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 blur-[120px]" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-teal-500/20 to-blue-600/20 blur-[100px]" />
        </div>
        <main className="max-w-md mx-auto min-h-screen px-4 py-8 flex flex-col items-center justify-center relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
