import type { Metadata } from "next";
import { PublicTourViewer } from "../../../components/public-tour-viewer";

export const metadata: Metadata = {
  title: "Interactive Property Tour | Spruce & Shoals Estate Media",
  description: "Explore a room-to-room interactive real estate tour."
};

export default async function PublicTourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicTourViewer slug={slug} />;
}
