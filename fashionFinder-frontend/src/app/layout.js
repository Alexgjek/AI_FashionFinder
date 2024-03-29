"use client"
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from './authContext';

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "FashionFinder",
//   description: "Generated by create next app",
// };

// const AuthProvider = ({ children }) => {
//   return <SessionProvider>{children}</SessionProvider>;
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main>
            {/* <Header /> */}
            <div >
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}