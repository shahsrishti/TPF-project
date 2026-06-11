"use server"

import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

export async function saveIntegrationSettings(provider: string, config: any, apiKey?: string, isActive?: boolean) {
  try {
    const existing = await prisma.integration.findUnique({
      where: { provider }
    })

    if (existing) {
      await prisma.integration.update({
        where: { provider },
        data: {
          config: JSON.stringify(config),
          ...(apiKey !== undefined && { apiKey }),
          ...(isActive !== undefined && { isActive }),
        }
      })
    } else {
      await prisma.integration.create({
        data: {
          provider,
          config: JSON.stringify(config),
          apiKey: apiKey || "",
          isActive: isActive || false,
        }
      })
    }

    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to save settings:", error)
    return { success: false, error: "Failed to save settings" }
  }
}

export async function getIntegration(provider: string) {
  const integration = await prisma.integration.findUnique({
    where: { provider }
  })
  if (integration && integration.config) {
    try {
      return { ...integration, config: JSON.parse(integration.config) }
    } catch {
      return integration
    }
  }
  return integration
}

export async function toggleIntegration(provider: string, isActive: boolean) {
  try {
    await prisma.integration.update({
      where: { provider },
      data: { isActive }
    })
    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle integration:", error)
    return { success: false, error: "Failed to toggle integration" }
  }
}
