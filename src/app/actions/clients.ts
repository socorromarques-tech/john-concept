"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function getClients() {
  const session = await auth()
  if (!session?.user?.id) return []

  return await prisma.client.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      name: "asc", 
    },
  })
}

export async function getClient(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return await prisma.client.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  })
}

export async function createClient(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Sem permissão")
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const notes = formData.get("notes") as string
  const birthDateStr = formData.get("birthDate") as string // YYYY-MM-DD

  if (!name) {
    throw new Error("Nome é obrigatório")
  }

  let birthDate = null
  if (birthDateStr) {
      // Create date at noon UTC to avoid timezone shifts making it previous day
      // Or just standard new Date(str) usually results in UTC midnight.
      // With simple YYYY-MM-DD input, new Date("2023-05-20") is UTC 00:00.
      birthDate = new Date(birthDateStr)
  }

  try {
    await prisma.client.create({
      data: {
        name,
        phone,
        email,
        notes,
        birthDate,
        userId: session.user.id,
      },
    })
  } catch (error) {
    throw new Error("Erro ao criar cliente")
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function updateClient(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Sem permissão")
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const notes = formData.get("notes") as string
  const birthDateStr = formData.get("birthDate") as string

  if (!name) {
    throw new Error("Nome é obrigatório")
  }

  let birthDate = null
  if (birthDateStr) {
      birthDate = new Date(birthDateStr)
  }

  try {
    await prisma.client.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        name,
        phone,
        email,
        notes,
        birthDate,
      },
    })
  } catch (error) {
    throw new Error("Erro ao atualizar cliente")
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function deleteClient(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Sem permissão")
  }

  try {
    await prisma.client.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })
  } catch (error) {
    throw new Error("Erro ao excluir cliente")
  }

  revalidatePath("/clients")
  revalidatePath("/")
}

export async function getClientHistory(clientId: string) {
  const session = await auth()
  if (!session?.user?.id) return []

  return await prisma.appointment.findMany({
    where: {
      userId: session.user.id,
      clientId: clientId,
    },
    include: {
      services: true,
    },
    orderBy: {
      date: "desc",
    },
  })
}
