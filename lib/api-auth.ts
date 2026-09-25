import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function validateApiKey(req: NextRequest): Promise<boolean> {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) return false;

  const client = await prisma.apiClient.findUnique({
    where: { apiKey, isActive: true },
  });

  return !!client;
}
