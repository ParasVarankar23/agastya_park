import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agastya Park Devad Panvel | Created by Paras Varankar",
  description:
    "Maintenance Management System for Agastya Park, Devad Panvel. Developed by Paras Varankar.",
  keywords: [
    "Agastya Park",
    "Devad Panvel",
    "Maintenance Management System",
    "Society Management",
    "Paras Varankar",
  ],
  authors: [
    {
      name: "Paras Varankar",
    },
  ],
  creator: "Paras Varankar",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Footer */}
        <footer className="mt-auto border-t bg-gray-100 py-3 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Agastya Park Devad Panvel | Created by{" "}
          <span className="font-semibold">Paras Varankar</span>
        </footer>
      </body>
    </html>
  );
}