"use client"

import { useEffect, useState } from 'react'
import { getAppointments } from '../../actions/appointments'

export function NotificationManager() {
  const [hasPermission, setHasPermission] = useState(false)
  const [nextAppointment, setNextAppointment] = useState<any>(null)

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setHasPermission(permission === 'granted')
        })
      } else {
        setHasPermission(Notification.permission === 'granted')
      }
    }

    // Check for upcoming appointments
    checkUpcomingAppointments()

    // Check every 5 minutes
    const interval = setInterval(checkUpcomingAppointments, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const checkUpcomingAppointments = async () => {
    try {
      const appointments = await getAppointments()
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      // Find next scheduled appointment within 24 hours
      const upcoming = appointments
        .filter(apt => apt.status === 'SCHEDULED')
        .map(apt => ({
          ...apt,
          date: new Date(apt.date)
        }))
        .filter(apt => apt.date > now && apt.date <= tomorrow)
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0]

      setNextAppointment(upcoming)

      // Show notification for appointments in next 30 minutes
      appointments.forEach(apt => {
        const aptDate = new Date(apt.date)
        const timeDiff = aptDate.getTime() - now.getTime()
        const minutesUntil = Math.floor(timeDiff / (1000 * 60))

        if (apt.status === 'SCHEDULED' && minutesUntil > 0 && minutesUntil <= 30) {
          showNotification(apt, minutesUntil)
        }
      })
    } catch (error) {
      console.error('Error checking appointments:', error)
    }
  }

  const showNotification = (appointment: any, minutesUntil: number) => {
    if (!hasPermission) return

    const appointmentTime = new Date(appointment.date)
    const timeString = appointmentTime.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    const notification = new Notification('Lembrete de Agendamento - John Concept', {
      body: `${appointment.client.name} às ${timeString} (em ${minutesUntil} minutos)`,
      icon: '/favicon.ico',
      tag: `appointment-${appointment.id}`,
      requireInteraction: true
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
      window.location.href = `/schedule/${appointment.id}/edit`
    }

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)
  }

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setHasPermission(permission === 'granted')
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Notificações Ativadas', {
          body: 'Você receberá lembretes sobre seus agendamentos!',
          icon: '/favicon.ico'
        })
      }
    }
  }

  // Don't render anything in the DOM
  return null
}

