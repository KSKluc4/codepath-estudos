import type { Metadata } from "next";
import ConquistasClient from "@/components/ConquistasClient";

export const metadata: Metadata = { title: "Conquistas · CodePath" };

export default function ConquistasPage() {
  return <ConquistasClient />;
}
