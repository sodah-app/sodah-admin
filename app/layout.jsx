import "./globals.css";

export const metadata = {
  title: "Sodah Automation",
  description: "AI WhatsApp Automation Platform",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}