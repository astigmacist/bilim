import "./globals.css";

export const metadata = {
  title: "BilimQuest AI",
  description: "Цифрлық және AI технологияларымен оқу",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kz">
      <body>
        {children}
      </body>
    </html>
  );
}
