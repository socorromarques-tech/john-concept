"use server"

import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { startOfDay, endOfDay, addDays, getMonth, getDate, isSameDay } from "date-fns"

const prisma = new PrismaClient()

export async function getDashboardStats() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return {
      appointmentsToday: 0,
      activeClients: 0,
      revenueToday: 0,
      todayAppointments: [],
      alerts: {
          birthdays: [],
          tomorrowAppointments: 0
      }
    }
  }

  const userId = session.user.id
  const today = new Date()
  const tomorrow = addDays(today, 1)

  // 1. Appointments Today
  const appointmentsTodayCount = await prisma.appointment.count({
    where: {
      userId,
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
      status: { not: "CANCELLED" }
    },
  })

  // 2. Active Clients (Total)
  const activeClientsCount = await prisma.client.count({
    where: {
      userId,
    },
  })

  // 3. Revenue Today
  const appointmentsToday = await prisma.appointment.findMany({
    where: {
      userId,
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
      status: "COMPLETED",
    },
    include: {
        services: true
    }
  })

  const revenueToday = appointmentsToday.reduce((total, appt) => {
      const servicesTotal = appt.services.reduce((acc, s) => acc + Number(s.price), 0)
      return total + servicesTotal
  }, 0)
  
  // 4. List of Today's Appointments (Inc. Scheduled and Completed)
  const rawTodayAppointments = await prisma.appointment.findMany({
    where: {
        userId,
        date: {
            gte: startOfDay(today),
            lte: endOfDay(today),
        },
        status: { not: "CANCELLED" }
    },
    include: {
        client: true,
        services: true
    },
    orderBy: {
        date: 'asc'
    }
  })

  const todayAppointmentsList = rawTodayAppointments.map(appt => ({
    ...appt,
    services: appt.services.map(s => ({
      ...s,
      price: s.price.toString()
    }))
  }))

  // 5. Tomorrow Appointments Count
  const tomorrowAppointmentsCount = await prisma.appointment.count({
      where: {
          userId,
          date: {
              gte: startOfDay(tomorrow),
              lte: endOfDay(tomorrow)
          },
          status: { not: "CANCELLED" }
      }
  })

  // 6. Birthdays (This week)
  const allClients = await prisma.client.findMany({
      where: { userId, birthDate: { not: null } },
      select: { id: true, name: true, birthDate: true }
  })

  const currentMonth = getMonth(today)
  const currentDay = getDate(today)
  const nextWeekDay = getDate(addDays(today, 7))
  
  // Filter birthdays in the next 7 days
  const upcomingBirthdays = allClients.filter(client => {
      if (!client.birthDate) return false
      const bMonth = getMonth(client.birthDate)
      const bDay = getDate(client.birthDate)
      
      // Handle simple case: same month, day is between today and today+7
      if (bMonth === currentMonth && bDay >= currentDay && bDay <= nextWeekDay) {
          return true
      }
      return false
  })


  return {
    appointmentsToday: appointmentsTodayCount,
    activeClients: activeClientsCount,
    revenueToday,
    todayAppointments: todayAppointmentsList,
    alerts: {
        birthdays: upcomingBirthdays,
        tomorrowAppointments: tomorrowAppointmentsCount
    }
  }
}
