"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { startOfDay, endOfDay } from "date-fns"

const prisma = new PrismaClient()

export async function getDashboardStats() {
  const session = await auth()
  if (!session?.user?.id) return { 
    appointmentsToday: 0, 
    activeClients: 0, 
    revenueToday: 0, 
    todayAppointments: [] 
  }

  const userId = session.user.id
  const now = new Date()
  const start = startOfDay(now)
  const end = endOfDay(now)

  // 1. Get appointments for today
  const todayAppointments = await prisma.appointment.findMany({
    where: {
      userId,
      date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      client: true,
      services: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  // 2. Count active clients
  const activeClients = await prisma.client.count({
    where: {
      userId,
    },
  })

  // 3. Calculate revenue for today
  const revenueToday = todayAppointments.reduce((total, apt) => {
    const aptTotal = apt.services.reduce((sum, service) => {
      return sum + Number(service.price)
    }, 0)
    return total + aptTotal
  }, 0)

  return {
    appointmentsToday: todayAppointments.length,
    activeClients,
    revenueToday,
    todayAppointments,
  }
}
