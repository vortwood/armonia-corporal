import { Inter, UnifrakturMaguntia } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const unifrakturMaguntia = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: ["400"],
});

export { inter, unifrakturMaguntia };