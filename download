generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum ProjectStatus {
  DRAFT
  UPLOADING
  GENERATING
  READY
  EXPORTED
  ARCHIVED
}

enum AssetType {
  PHOTO
  VIDEO
  AUDIO
  LOGO
  HEADSHOT
  BRAND_ASSET
}

enum VideoStatus {
  QUEUED
  GENERATING
  READY
  FAILED
}

enum ExportStatus {
  QUEUED
  PROCESSING
  COMPLETE
  FAILED
}

enum VideoFormat {
  VERTICAL
  HORIZONTAL
  SQUARE
}

model User {
  id              String           @id @default(cuid())
  clerkId         String           @unique
  email           String           @unique
  name            String?
  imageUrl        String?
  memberships     Membership[]
  usageEvents     UsageTracking[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model Organization {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  memberships   Membership[]
  projects      Project[]
  brandProfiles BrandProfile[]
  templates     Template[]
  usageEvents   UsageTracking[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Membership {
  id             String       @id @default(cuid())
  role           UserRole     @default(MEMBER)
  userId         String
  organizationId String
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
}

model Project {
  id             String        @id @default(cuid())
  name           String
  status         ProjectStatus @default(DRAFT)
  organizationId String
  brandProfileId String?
  property       Property?
  assets         Asset[]
  videos         Video[]
  exports        Export[]
  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  brandProfile   BrandProfile? @relation(fields: [brandProfileId], references: [id])
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([organizationId, status])
}

model Property {
  id          String   @id @default(cuid())
  projectId   String   @unique
  address     String
  price       Int?
  bedrooms    Float?
  bathrooms   Float?
  squareFeet  Int?
  description String?
  latitude    Float?
  longitude   Float?
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model Asset {
  id             String       @id @default(cuid())
  type           AssetType
  url            String
  provider       String       @default("cloudinary")
  publicId       String?
  fileName       String
  mimeType       String
  sizeBytes      Int
  width          Int?
  height         Int?
  durationMs     Int?
  projectId      String?
  brandProfileId String?
  project        Project?     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  brandProfile   BrandProfile? @relation(fields: [brandProfileId], references: [id], onDelete: SetNull)
  createdAt      DateTime     @default(now())

  @@index([projectId, type])
  @@index([brandProfileId, type])
}

model Video {
  id            String      @id @default(cuid())
  projectId     String
  templateId    String?
  status        VideoStatus @default(QUEUED)
  format        VideoFormat
  muxAssetId    String?
  playbackId    String?
  sourceUrl     String?
  timeline      Json
  project       Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  exports       Export[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([projectId, status])
}

model Template {
  id             String       @id @default(cuid())
  name           String
  description    String?
  category       String
  structure      Json
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
}

model Export {
  id          String       @id @default(cuid())
  projectId   String
  videoId     String?
  status      ExportStatus @default(QUEUED)
  format      VideoFormat
  destination String
  url         String?
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  video       Video?       @relation(fields: [videoId], references: [id], onDelete: SetNull)
  createdAt   DateTime     @default(now())
  completedAt DateTime?

  @@index([projectId, status])
}

model BrandProfile {
  id             String       @id @default(cuid())
  organizationId String
  name           String
  agentName      String?
  brokerageName  String?
  phone          String?
  email          String?
  primaryColor   String
  secondaryColor String
  accentColor    String
  displayFont    String?
  bodyFont       String?
  disclosure     String?
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  projects       Project[]
  assets         Asset[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([organizationId])
}

model UsageTracking {
  id             String        @id @default(cuid())
  organizationId String
  userId         String?
  event          String
  units          Int           @default(1)
  metadata       Json?
  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User?         @relation(fields: [userId], references: [id], onDelete: SetNull)
  createdAt      DateTime      @default(now())

  @@index([organizationId, event, createdAt])
  @@index([userId, createdAt])
}
