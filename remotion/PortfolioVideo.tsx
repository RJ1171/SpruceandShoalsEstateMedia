import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const PORTFOLIO_SCENE_FRAMES = 110;
export const PORTFOLIO_SCENE_STRIDE = 94;

export type PortfolioScene = {
  image: string;
  room: string;
};

export type PortfolioVideoProps = {
  scenes: PortfolioScene[];
  title: string;
  label: string;
};

const Scene = ({ scene, index }: { scene: PortfolioScene; index: number }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const isPortrait = height > width;
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const opacity = interpolate(frame, [0, 12, durationInFrames - 14, durationInFrames - 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const source = scene.image.startsWith("/") ? staticFile(scene.image.slice(1)) : scene.image;
  const direction = index % 2 === 0 ? 1 : -1;
  const roomOpacity = interpolate(frame, [14, 28, durationInFrames - 30, durationInFrames - 16], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const transitionBlur = interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames - 1], [2.4, 0, 0, 2.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <Img
        src={source}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: "50% 52%",
          transform: `perspective(1800px) translate3d(${direction * interpolate(progress, [0, 1], [-7, 7])}px, ${interpolate(progress, [0, 1], [5, -7])}px, 0) scale(${interpolate(progress, [0, 1], [1.025, 1.155])})`,
          filter: `blur(${transitionBlur}px) saturate(1.025) contrast(1.018) brightness(${interpolate(progress, [0, 1], [0.96, 1.025])})`
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,25,21,0.14) 0%, rgba(8,25,21,0.02) 48%, rgba(8,25,21,0.78) 100%)" }} />
      <div style={{ position: "absolute", right: isPortrait ? 32 : 54, bottom: isPortrait ? undefined : 48, top: isPortrait ? "48%" : undefined, opacity: roomOpacity, border: "1px solid rgba(225,194,118,0.72)", background: "rgba(15,44,37,0.68)", color: "#f7f3ea", padding: "10px 14px", fontSize: 13, fontWeight: 700, letterSpacing: 2.6, textTransform: "uppercase" }}>
        {scene.room}
      </div>
    </AbsoluteFill>
  );
};

export const PortfolioVideo = ({ scenes, title, label }: PortfolioVideoProps) => {
  const frame = useCurrentFrame();
  const introOpacity = interpolate(frame, [8, 28, 64, 86], [0, 1, 1, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f2c25", overflow: "hidden" }}>
      {scenes.map((scene, index) => (
        <Sequence key={scene.image} from={index * PORTFOLIO_SCENE_STRIDE} durationInFrames={PORTFOLIO_SCENE_FRAMES} premountFor={16}>
          <Scene scene={scene} index={index} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ justifyContent: "space-between", padding: "48px 58px", color: "#fff", pointerEvents: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.92 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, letterSpacing: 1.5 }}>SPRUCE & SHOALS</div>
          <div style={{ border: "1px solid rgba(200,164,93,0.75)", padding: "9px 13px", fontSize: 11, letterSpacing: 3, color: "#e4c986" }}>ESTATE MEDIA</div>
        </div>
        <div style={{ opacity: introOpacity, marginBottom: 6 }}>
          <div style={{ width: 64, height: 3, backgroundColor: "#c8a45d", marginBottom: 17 }} />
          <div style={{ color: "#e1c276", fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{label}</div>
          <div style={{ marginTop: 10, maxWidth: 860, fontFamily: "Georgia, serif", fontSize: 46, fontWeight: 600, lineHeight: 1.04 }}>{title}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
