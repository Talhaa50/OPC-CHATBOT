import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export const metadata = {
  title: "OPC Punjab Assistant",
  description: "Punjab Overseas Pakistanis Commission AI Assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: 'transparent' }}>
        {children}
        <ChatWidget autoOpen={true} />
      </body>
    </html>
  );
}
