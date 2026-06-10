export type UploadAssetInput = {
  fileName: string;
  mimeType: string;
  data: ArrayBuffer;
  folder?: string;
};

export type UploadedAsset = {
  url: string;
  provider: "placeholder";
  publicId: string;
};

export async function uploadAsset(input: UploadAssetInput): Promise<UploadedAsset> {
  const publicId = `${input.folder || "uploads"}/${input.fileName}`;

  return {
    url: `/uploads/${input.fileName}`,
    provider: "placeholder",
    publicId
  };
}
