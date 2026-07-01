export type HotspotDirection = "forward" | "back" | "left" | "right";

export type TourHotspot = {
  id: string;
  x: number;
  y: number;
  targetRoomId: string;
  label: string;
  direction: HotspotDirection;
};

export type TourRoom = {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: TourHotspot[];
};

export type TourProperty = {
  address: string;
  price: string;
  beds: string;
  baths: string;
  squareFeet: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
};

export type PublishedTour = {
  slug: string;
  rooms: TourRoom[];
  property: TourProperty;
  publishedAt: string;
};
