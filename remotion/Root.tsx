import { Composition } from "remotion";
import { ListingVideo, type ListingVideoProps } from "./ListingVideo";
import { PORTFOLIO_SCENE_FRAMES, PORTFOLIO_SCENE_STRIDE, PortfolioVideo, type PortfolioVideoProps } from "./PortfolioVideo";

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

const portfolioDefaultProps: PortfolioVideoProps = {
  scenes: [
    { image: "/images/portfolio/atlantic-shingle-estate.png", room: "Arrival" },
    { image: "/images/portfolio/interiors/atlantic-shingle-estate-entrance.png", room: "Entrance" },
    { image: "/images/portfolio/interiors/atlantic-shingle-estate-living-room.png", room: "Living room" },
    { image: "/images/portfolio/interiors/atlantic-shingle-estate-kitchen.png", room: "Kitchen" },
    { image: "/images/portfolio/interiors/atlantic-shingle-estate-bedroom.png", room: "Primary bedroom" },
    { image: "/images/portfolio/interiors/atlantic-shingle-estate-bathroom.png", room: "Primary bath" }
  ],
  title: "Atlantic Shingle Estate",
  label: "Featured residence"
};

export const RemotionRoot = () => (
  <>
    <Composition
      id="ListingVideo"
      component={ListingVideo}
      fps={20}
      width={540}
      height={960}
      durationInFrames={48}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: 48 + Math.max(0, props.images.length - 1) * 40
      })}
    />
    <Composition
      id="PortfolioVideo"
      component={PortfolioVideo}
      fps={24}
      width={1280}
      height={720}
      durationInFrames={432}
      defaultProps={portfolioDefaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: PORTFOLIO_SCENE_FRAMES + Math.max(0, props.scenes.length - 1) * PORTFOLIO_SCENE_STRIDE
      })}
    />
    <Composition
      id="PortfolioVideoVertical"
      component={PortfolioVideo}
      fps={24}
      width={720}
      height={1280}
      durationInFrames={432}
      defaultProps={portfolioDefaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: PORTFOLIO_SCENE_FRAMES + Math.max(0, props.scenes.length - 1) * PORTFOLIO_SCENE_STRIDE
      })}
    />
  </>
);
