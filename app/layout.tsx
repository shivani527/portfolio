import type { Metadata } from "next";
import "../public/css/styles.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import InitScroll from "@/components/scroll/InitScroll";
import Script from "next/script"; // ✅ use next/script
import LenisSmoothScroll from "@/components/scroll/LenisSmoothScroll";
export const metadata: Metadata = {
  title: "Kokkula Shivani | AI/ML, Python, Full-Stack & Data Analytics Fresher",
  description:
    "Portfolio of Kokkula Shivani, a 2026 B.Tech (AI & ML) graduate from Secunderabad, India, looking for fresher roles in AI/ML, Python, full-stack development and data analytics.",
  openGraph: {
    title: "Kokkula Shivani | AI/ML, Python, Full-Stack & Data Analytics Fresher",
    description:
      "B.Tech (AI & ML) graduate, 2026. Projects, internship and training, skills and certificates.",
    type: "website",
    locale: "en_IN",
  },
};

const setColorSchemeScript = `
  (function() {
    try {
      var scheme = localStorage.getItem('color-scheme') || 'light';
      document.documentElement.setAttribute('color-scheme', scheme);
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      color-scheme="light"
      suppressHydrationWarning
      className="no-touch"
    >
      <body>
        <Script id="set-color-scheme" strategy="beforeInteractive">
          {setColorSchemeScript}
        </Script>
        {children}
        <LenisSmoothScroll />
        <InitScroll />
      </body>
    </html>
  );
}
