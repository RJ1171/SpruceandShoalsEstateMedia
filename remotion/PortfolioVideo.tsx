import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type PortfolioVideoProps = {
  image: string;
  title: string;
  label: string;
};

export const PortfolioVideo = ({ image, title, label }: PortfolioVideoProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const imageSource = image.startsWith("/") ? staticFile(image.slice(1)) : image;
  const fade = interpolate(frame, [0, 18, durationInFrames - 24, durationInFrames - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const titleOpacity = interpolate(frame, [18, 42, 210, 244], [0, 1, 1, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f2c25", opacity: fade, overflow: "hidden" }}>
      <Img
        src={imageSource}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate3d(${interpolate(progress, [0, 1], [-22, 18])}px, ${interpolate(progress, [0, 1], [10, -12])}px, 0) scale(${interpolate(progress, [0, 1], [1.08, 1.2])})`,
          filter: `saturate(1.03) contrast(1.02) brightness(${interpolate(progress, [0, 1], [0.94, 1.02])})`
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,25,21,0.16) 0%, rgba(8,25,21,0.03) 45%, rgba(8,25,21,0.82) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "space-between", padding: "54px 62px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: titleOpacity }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 24, letterSpacing: 1.5 }}>SPRUCE & SHOALS</div>
          <div style={{ border: "1px solid rgba(200,164,93,0.75)", padding: "10px 14px", fontSize: 12, letterSpacing: 3, color: "#e4c986" }}>ESTATE MEDIA</div>
        </div>
        <div style={{ opacity: titleOpacity, transform: `translateY(${interpolate(titleOpacity, [0, 1], [18, 0])}px)` }}>
          <div style={{ width: 70, height: 3, backgroundColor: "#c8a45d", marginBottom: 20 }} />
          <div style={{ color: "#e1c276", fontSize: 15, fontWeight: 700, letterSpacing: 3.2, textTransform: "uppercase" }}>{label}</div>
          <div style={{ marginTop: 12, maxWidth: 900, fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 600, lineHeight: 1.04 }}>{title}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
