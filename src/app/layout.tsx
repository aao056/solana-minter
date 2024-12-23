import AppWalletProvider from "./components/AppWalletProvider";
import Navbar from "./components/Navbar";
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          <Navbar />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}