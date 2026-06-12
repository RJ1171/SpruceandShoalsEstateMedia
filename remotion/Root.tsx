import { Composition } from "remotion";
import { ListingVideo, type ListingVideoProps } from "./ListingVideo";

const defaultProps: ListingVideoProps = {
  images: [
    {
      originalUrl: "/images/portfolio/atlantic-shingle-estate.png",
      depthMapUrl: null
    }
  ],
  address: "18 Harbor View Road, Newburyport",
  price: "$1,895,000",
  beds: "4",
  baths: "3.5",
  squareFeet: "3,280",
  agentName: "Rocco Fiacchino"
};

export const RemotionRoot = () => (
  <Composition
    id="ListingVideo"
    component={ListingVideo}
    fps={24}
    width={720}
    height={1280}
    durationInFrames={60}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: 60 + Math.max(0, props.images.length - 1) * 48
    })}
  />
);
