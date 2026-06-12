export type GeneratedDepthMap = {
  bytes: Uint8Array;
  contentType: "image/svg+xml";
  extension: "svg";
  provider: "simulated-gradient";
};

export async function generateDepthMap(_image: Uint8Array): Promise<GeneratedDepthMap> {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <defs>
        <linearGradient id="depth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black"/>
          <stop offset="42%" stop-color="#555"/>
          <stop offset="72%" stop-color="#bbb"/>
          <stop offset="100%" stop-color="white"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#depth)"/>
    </svg>
  `;

  return {
    bytes: new TextEncoder().encode(svg),
    contentType: "image/svg+xml",
    extension: "svg",
    provider: "simulated-gradient"
  };
}
