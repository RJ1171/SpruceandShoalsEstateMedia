"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "../lib/db";
import { trackServerEvent } from "../lib/analytics";

const projectSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(2),
  address: z.string().min(3)
});

export async function createProjectAction(payload: z.infer<typeof projectSchema>) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required.");
  }

  const data = projectSchema.parse(payload);
  const project = await prisma.project.create({
    data: {
      name: data.name,
      status: "DRAFT",
      organizationId: data.organizationId,
      property: {
        create: {
          address: data.address
        }
      }
    }
  });

  trackServerEvent("project_created", { projectId: project.id, userId });
  return project;
}
