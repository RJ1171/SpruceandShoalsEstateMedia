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
