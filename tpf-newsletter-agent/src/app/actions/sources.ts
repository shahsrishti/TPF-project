"use server"

import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"

export async function addSource(name: string, url: string, rssUrl: string) {
  try {
    await prisma.source.create({
      data: {
        name,
        url,
        rssUrl,
        isActive: true
      }
    })
    revalidatePath("/dashboard/sources")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to add source:", error)
    if (error.code === 'P2002') {
      return { success: false, error: "A source with this RSS URL already exists" }
    }
    return { success: false, error: "Failed to add source" }
  }
}

export async function toggleSource(id: string, isActive: boolean) {
  try {
    await prisma.source.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath("/dashboard/sources")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle source:", error)
    return { success: false, error: "Failed to toggle source" }
  }
}

export async function triggerIngestion() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/ingest`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.CRON_SECRET}`
      }
    })
    if (!res.ok) {
      throw new Error(`Ingestion API responded with ${res.status}`)
    }
    
    // AWAIT the process so Vercel doesn't kill the lambda prematurely
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cron/process`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${process.env.CRON_SECRET}` }
    }).catch(e => console.error("Background processing failed:", e))

    revalidatePath("/dashboard/sources")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to trigger ingestion:", error)
    return { success: false, error: error.message || "Failed to trigger ingestion" }
  }
}
