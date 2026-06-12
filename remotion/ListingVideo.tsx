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
  const opacity = interpolate(frame, [0, 12, 48, 60], [0, 1, 1, 0], {
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
        <Sequence key={`${image.originalUrl}-${index}`} from={index * 48} durationInFrames={60} premountFor={12}>
          <PhotoScene image={image} index={index} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ justifyContent: "space-between", padding: "61px 47px 55px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 23, letterSpacing: 1 }}>SPRUCE & SHOALS</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.45)", padding: "9px 12px", fontSize: 13, letterSpacing: 2.5 }}>NEW LISTING</div>
        </div>

        <div>
          <div style={{ width: 61, height: 3, backgroundColor: "#c6a15b", marginBottom: 19 }} />
          <div style={{ color: "#d7b76f", fontSize: 23, fontWeight: 700, letterSpacing: 1.3 }}>{price}</div>
          <div style={{ marginTop: 11, maxWidth: 600, fontFamily: "Georgia, serif", fontSize: 41, fontWeight: 600, lineHeight: 1.08 }}>{address}</div>
          <div style={{ marginTop: 16, fontSize: 18, letterSpacing: 1.6, color: "rgba(255,255,255,0.84)" }}>
            {beds} BEDS&nbsp;&nbsp; · &nbsp;&nbsp;{baths} BATHS&nbsp;&nbsp; · &nbsp;&nbsp;{squareFeet} SQ FT
          </div>
          <div style={{ marginTop: 23, paddingTop: 17, borderTop: "1px solid rgba(255,255,255,0.28)", fontSize: 15, letterSpacing: 1 }}>
            Presented by {agentName}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
