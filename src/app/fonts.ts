import { Bodoni_Moda, Cinzel, Cormorant, DM_Sans, Inter, Josefin_Sans, Lora, Montserrat, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

/**
 * Todas las letras que se pueden elegir en el panel (ver DISPLAY_FONTS / BODY_FONTS en content/site.ts).
 * Solo se descargan las que la página usa de verdad; las opcionales no se precargan.
 */

// Clash Display (Indian Type Foundry, licencia gratuita de Fontshare)
const clash = localFont({ src: "../fonts/ClashDisplay-Variable.woff2", variable: "--font-clash", weight: "200 700", display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], style: ["normal", "italic"] });

// Las opciones deben ser literales (next/font las lee al compilar).
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-playfair", style: ["normal", "italic"] });
const cormorant = Cormorant({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-cormorant", style: ["normal", "italic"] });
const bodoni = Bodoni_Moda({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-bodoni", style: ["normal", "italic"] });
const cinzel = Cinzel({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-cinzel" });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-montserrat", style: ["normal", "italic"] });
const josefin = Josefin_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-josefin", style: ["normal", "italic"] });
const dmsans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-dmsans", style: ["normal", "italic"] });
const lora = Lora({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-lora", style: ["normal", "italic"] });

export const fontVariables = [clash, inter, playfair, cormorant, bodoni, cinzel, montserrat, josefin, dmsans, lora]
  .map((f) => f.variable)
  .join(" ");
