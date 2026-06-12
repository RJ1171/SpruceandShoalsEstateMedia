export const brand = {
  name: "Spruce & Shoals Estate Media",
  shortName: "Spruce & Shoals",
  tagline: "Refined real estate media for coastal New England listings",
  description:
    "A polished estate media studio for listing videos, social content, editorial descriptions, and branded real estate marketing assets.",
  domain: "https://spruceandshoals.example",
  contact: {
    name: "Rocco Fiacchino",
    email: "Roccofiacchino@gmail.com",
    phone: "(603) 260-8166",
    instagram: "Rocco_f6",
    region: "North Shore, Boston, Cape Ann, and coastal New England"
  },
  colors: {
    pine: "#173F35",
    forest: "#0F2C25",
    gold: "#C6A15B",
    mutedGold: "#A8843F",
    tan: "#D8C7A3",
    cream: "#FBF8F1",
    offWhite: "#F7F3EA",
    charcoal: "#1F2933",
    muted: "#6B7280",
    linen: "#D8C7A3",
    white: "#FFFFFF"
  },
  typography: {
    display: "Cormorant Garamond",
    body: "Inter"
  },
  navigation: [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Process", href: "#process" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" }
  ],
  ctas: {
    primary: "Start a Project",
    heroPrimary: "Create Listing Media",
    heroSecondary: "View Showcase",
    final: "Start Building"
  },
  defaultBrandProfile: {
    brokerageName: "Editable Brokerage",
    agentName: "Editable Lead Advisor",
    disclosure: "Equal Housing Opportunity. All property information is subject to verification."
  }
} as const;
