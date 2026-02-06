import "./globals.css";
import { Space_Grotesk, IBM_Plex_Mono, Bakbak_One } from "next/font/google";
import Providers from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  weight: ["300", "400", "500", "600"],
});

const bakbakOne = Bakbak_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bakbak-one",
  weight: "400",
});

export const metadata = {
  title: "RWA Hub",
  description: "Multi-chain RWA control in one network",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${bakbakOne.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
