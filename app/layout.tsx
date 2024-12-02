import "@/ui/global.css";
import News from "@/components/news";
import Sidebar from "@/components/sidebar";
import { inter } from "@/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Twitter Clone",
    default: "Twitter Clone",
  },
  description: "Twitter clone from tutroria",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        
      <div className="flex justify-between max-w-6xl mx-auto">
        <div className="">
          <Sidebar />
        </div>
        <div className="">{children}</div>
        <div className="">
          <News />
        </div>
      </div>
      </body>
    </html>
  );
}
