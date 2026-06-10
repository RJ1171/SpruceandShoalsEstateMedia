export type UserRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type AssetType = "PHOTO" | "VIDEO" | "AUDIO" | "LOGO" | "HEADSHOT" | "BRAND_ASSET";

export type VideoFormat = "VERTICAL" | "HORIZONTAL" | "SQUARE";

export type ProjectStatus = "DRAFT" | "UPLOADING" | "GENERATING" | "READY" | "EXPORTED" | "ARCHIVED";

export type PropertyDetails = {
  address: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  description?: string;
};

export type AiGenerationRequest = {
  property: PropertyDetails;
  tone: "MLS" | "LUXURY" | "SOCIAL" | "OPEN_HOUSE";
  brandProfileId?: string;
};
