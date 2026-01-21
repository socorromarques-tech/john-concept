"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export async function getAppointments(start?: Date, end?: Date) {
  const session = await auth()
  if (!session?.user?.id) return []

  const whereClause: any = {
      userId: session.user.id,
  }

  if (start && end) {
      whereClause.date = {
          gte: start,
          lte: end
      }
  }

  const data = await prisma.appointment.findMany({
    where: whereClause,
    include: {
        client: true,
        services: true
    },
    orderBy: {
      date: "asc",
    },
    take: start && end ? undefined : 50 // Limit to 50 if no specific range is requested
  })

  return data.map(appt => ({
    ...appt,
    services: appt.services.map(s => ({
      ...s,
      price: s.price.toString()
    }))
  }))
}

export async function getAppointment(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  const data = await prisma.appointment.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      client: true,
      services: true
    }
  })

  if (!data) return null

  return {
    ...data,
    services: data.services.map(s => ({
      ...s,
      price: s.price.toString()
    }))
  }
}

export async function updateAppointment(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Sem permissão")
  }

  const appointmentId = formData.get("appointmentId") as string
  const clientId = formData.get("clientId") as string
  const dateStr = formData.get("date") as string // YYYY-MM-DD
  const timeStr = formData.get("time") as string // HH:mm
  const notes = formData.get("notes") as string
  const status = formData.get("status") as string
  const servicesCount = parseInt(formData.get("servicesCount") as string) || 0

  // Coletar múltiplos serviços
  const services = []
  for (let i = 0; i < servicesCount; i++) {
    const description = formData.get(`service_${i}_description`) as string
    const price = formData.get(`service_${i}_price`) as string
    
    if (description && price) {
      services.push({
        description,
        price: parseFloat(price?.replace(",", ".") || "0")
      })
    }
  }

  if (!appointmentId || !clientId || !dateStr || !timeStr) {
      throw new Error("Preencha todos os campos obrigatórios.")
  }

  const dateTime = new Date(`${dateStr}T${timeStr}:00`)

  try {
    await prisma.appointment.update({
      where: {
        id: appointmentId,
        userId: session.user.id,
      },
      data: {
        clientId,
        date: dateTime,
        notes,
        status,
        services: {
            deleteMany: {}, // Delete all existing services
            create: services // Create the new list
        }
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao atualizar agendamento")
  }

  revalidatePath("/schedule")
  revalidatePath("/") // Update dashboard too
  redirect("/schedule")
}

export async function updateAppointmentStatus(id: string, status: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Sem permissão")
  }

  try {
    await prisma.appointment.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        status,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao atualizar status")
  }

  revalidatePath("/schedule")
  revalidatePath("/") // Update dashboard too
}

export async function deleteAppointment(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Sem permissão")
  }

  try {
    await prisma.appointment.delete({
      where: {
        id,
        userId: session.user.id,
      },
    })
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao deletar agendamento")
  }

  revalidatePath("/schedule")
  revalidatePath("/") // Update dashboard too
}

export async function createAppointment(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Sem permissão" }
  }

  const clientId = formData.get("clientId") as string
  const dateStr = formData.get("date") as string // YYYY-MM-DD
  const timeStr = formData.get("time") as string // HH:mm
  const notes = formData.get("notes") as string
  const servicesCount = parseInt(formData.get("servicesCount") as string) || 1

  // Coletar múltiplos serviços
  const services = []
  for (let i = 0; i < servicesCount; i++) {
    const description = formData.get(`service_${i}_description`) as string
    const price = formData.get(`service_${i}_price`) as string
    
    if (description && price) {
      services.push({
        description,
        price: parseFloat(price?.replace(",", ".") || "0")
      })
    }
  }

  if (!clientId || !dateStr || !timeStr || services.length === 0) {
      return { success: false, error: "Preencha todos os campos obrigatórios, incluindo pelo menos um serviço." }
  }

  const dateTime = new Date(`${dateStr}T${timeStr}:00`)

  try {
    await prisma.appointment.create({
      data: {
        userId: session.user.id,
        clientId,
        date: dateTime,
        notes,
        status: "SCHEDULED",
        services: {
          create: services
        }
      },
    })
  } catch (error) {
    console.error(error)
    return { success: false, error: "Erro ao criar agendamento" }
  }

  revalidatePath("/schedule")
  revalidatePath("/") // Update dashboard too
  return { success: true, message: "Agendamento criado com sucesso!" }
}
