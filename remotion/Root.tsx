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
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={75}
    defaultProps={defaultProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: 75 + Math.max(0, props.images.length - 1) * 60
    })}
  />
);
