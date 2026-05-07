import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export const metadata = {
  title: "OCP - Office of the Public Counsel",
  description: "Customer support chatbot for Office of the Public Counsel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
