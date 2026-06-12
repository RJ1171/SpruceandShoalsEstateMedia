import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { ParallaxPhoto } from "./ParallaxPhoto";

export type ListingVideoImage = {
  originalUrl: string;
  depthMapUrl?: string | null;
};

export type ListingVideoProps = {
  images: ListingVideoImage[];
  address: string;
  price: string;
  beds: string;
  baths: string;
  squareFeet: string;
  agentName: string;
};

const PhotoScene = ({ image, index }: { image: ListingVideoImage; index: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 60, 75], [0, 1, 1, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <ParallaxPhoto {...image} direction={index % 2 === 0 ? "right" : "left"} />
    </AbsoluteFill>
  );
};

export const ListingVideo = ({ images, address, price, beds, baths, squareFeet, agentName }: ListingVideoProps) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f2c25", color: "white", fontFamily: "Arial, sans-serif" }}>
      {images.map((image, index) => (
        <Sequence key={`${image.originalUrl}-${index}`} from={index * 60} durationInFrames={75} premountFor={15}>
          <PhotoScene image={image} index={index} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ justifyContent: "space-between", padding: "92px 70px 82px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 34, letterSpacing: 1.5 }}>SPRUCE & SHOALS</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.45)", padding: "13px 18px", fontSize: 20, letterSpacing: 4 }}>NEW LISTING</div>
        </div>

        <div>
          <div style={{ width: 92, height: 4, backgroundColor: "#c6a15b", marginBottom: 28 }} />
          <div style={{ color: "#d7b76f", fontSize: 34, fontWeight: 700, letterSpacing: 2 }}>{price}</div>
          <div style={{ marginTop: 16, maxWidth: 900, fontFamily: "Georgia, serif", fontSize: 62, fontWeight: 600, lineHeight: 1.08 }}>{address}</div>
          <div style={{ marginTop: 24, fontSize: 27, letterSpacing: 2.4, color: "rgba(255,255,255,0.84)" }}>
            {beds} BEDS&nbsp;&nbsp; · &nbsp;&nbsp;{baths} BATHS&nbsp;&nbsp; · &nbsp;&nbsp;{squareFeet} SQ FT
          </div>
          <div style={{ marginTop: 34, paddingTop: 25, borderTop: "1px solid rgba(255,255,255,0.28)", fontSize: 23, letterSpacing: 1.5 }}>
            Presented by {agentName}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
