"use client";
import { usePathname } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes("/bot-admin");

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "transparent" }}>
        {children}
        {!isAdminPage && <ChatWidget autoOpen={true} />}
      </body>
    </html>
  );
}
