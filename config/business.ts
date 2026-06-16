export const videoCostModel = {
  renderCompute: 0.18,
  storageAndBandwidth: 0.07,
  aiCopyAndMetadata: 0.04,
  platformOverhead: 0.06,
  competitorThreePack: 80,
  defaultMonthlyVideos: 3
};

export const estimatedCostPerVideo = Object.values({
  renderCompute: videoCostModel.renderCompute,
  storageAndBandwidth: videoCostModel.storageAndBandwidth,
  aiCopyAndMetadata: videoCostModel.aiCopyAndMetadata,
  platformOverhead: videoCostModel.platformOverhead
}).reduce((total, value) => total + value, 0);

export const packagePlans = [
  {
    name: "Launch",
    price: 29,
    videos: 3,
    audience: "Individual agents testing listing reels",
    features: ["3 generated videos", "Listing URL autofill", "Brand end cards", "Social captions"]
  },
  {
    name: "Agent",
    price: 59,
    videos: 10,
    audience: "Active agents with recurring listings",
    features: ["10 generated videos", "Saved brand profile", "Multi-format exports", "Priority render queue"]
  },
  {
    name: "Team",
    price: 149,
    videos: 30,
    audience: "Small teams and boutique brokerages",
    features: ["30 generated videos", "Shared media library", "Usage controls", "Support dashboard"]
  }
];

export const operatingSnapshot = {
  videosGeneratedMonth: 0,
  activeClients: 0,
  failedRendersMonth: 0,
  averageRenderMinutes: 2.8,
  concurrentRenderSlots: 2,
  targetGrossMargin: 0.82
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0
  }).format(value);
}

export function grossMargin(price: number, videos: number) {
  const cost = videos * estimatedCostPerVideo;
  return price > 0 ? (price - cost) / price : 0;
}

export function estimatedMonthlyCapacity() {
  const minutesPerMonth = 30 * 24 * 60;
  return Math.floor((minutesPerMonth / operatingSnapshot.averageRenderMinutes) * operatingSnapshot.concurrentRenderSlots);
}
