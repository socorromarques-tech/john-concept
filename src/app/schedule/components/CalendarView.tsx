"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Service {
  id: string
  description: string
  price: number
}

interface Appointment {
  id: string
  date: Date
  notes?: string
  status: string
  client: {
    id: string
    name: string
  }
  services: Service[]
}

interface CalendarViewProps {
  appointments: Appointment[]
  onDateClick?: (date: Date) => void
}

type ViewType = 'month' | 'week' | 'day'

export function CalendarView({ appointments, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('month')

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    )
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day)
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isToday = isSameDay(day, new Date())

            return (
              <div
                key={index}
                onClick={() => onDateClick?.(day)}
                className={`bg-white p-2 min-h-[80px] cursor-pointer hover:bg-gray-50 ${
                  !isCurrentMonth ? 'text-gray-400' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <div
                      key={apt.id}
                      className="text-xs p-1 rounded truncate bg-indigo-100 text-indigo-800"
                    >
                      {format(new Date(apt.date), 'HH:mm')} - {apt.client.name}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-8 gap-px bg-gray-200">
          <div className="bg-gray-50 p-2 text-sm font-medium text-gray-700">Hora</div>
          {days.map(day => (
            <div key={day.toString()} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              <div>{format(day, 'EEE', { locale: ptBR })}</div>
              <div className={`text-lg ${isSameDay(day, new Date()) ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
            <div key={hour} className="contents">
              <div className="bg-gray-50 p-2 text-sm text-gray-600 text-right">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {days.map(day => {
                const hourAppointments = getAppointmentsForDate(day).filter(apt => 
                  new Date(apt.date).getHours() === hour
                )

                return (
                  <div
                    key={`${day}-${hour}`}
                    onClick={() => onDateClick?.(day)}
                    className="bg-white p-1 min-h-[60px] border-b cursor-pointer hover:bg-gray-50"
                  >
                    {hourAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className="text-xs p-1 mb-1 rounded truncate bg-indigo-100 text-indigo-800"
                      >
                        {apt.client.name}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <p className="text-sm text-gray-500">
            {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="p-4">
          {dayAppointments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum agendamento para este dia.
            </p>
          ) : (
            <div className="space-y-3">
              {dayAppointments.map(apt => (
                <div key={apt.id} className="border-l-4 border-indigo-500 bg-gray-50 p-4 rounded-r-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(new Date(apt.date), 'HH:mm', { locale: ptBR })} - {apt.client.name}
                      </div>
                      {apt.notes && (
                        <div className="text-sm text-gray-600 mt-1">{apt.notes}</div>
                      )}
                      {apt.services.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {apt.services.map((service: Service) => (
                            <div key={service.id} className="text-xs text-gray-500">
                              • {service.description} - R$ {Number(service.price).toFixed(2).replace('.', ',')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        apt.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                        apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        apt.status === 'NO_SHOW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {apt.status === 'SCHEDULED' ? 'Agendado' :
                         apt.status === 'COMPLETED' ? 'Concluído' :
                         apt.status === 'CANCELLED' ? 'Cancelado' :
                         apt.status === 'NO_SHOW' ? 'Não compareceu' :
                         apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const navigatePrevious = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(subDays(currentDate, 1))
        break
    }
  }

  const navigateNext = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1))
        break
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1))
        break
      case 'day':
        setCurrentDate(addDays(currentDate, 1))
        break
    }
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrevious}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={navigateNext}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={navigateToday}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Hoje
          </button>
          <h2 className="text-xl font-semibold text-gray-900 ml-4">
            {format(currentDate, viewType === 'month' ? 'MMMM yyyy' : 
                    viewType === 'week' ? "'Semana de' dd MMM yyyy" : 
                    "dd MMM yyyy", { locale: ptBR })}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day'] as ViewType[]).map(view => (
              <button
                key={view}
                onClick={() => setViewType(view)}
                className={`px-3 py-1 text-sm rounded ${
                  viewType === view ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view === 'month' ? 'Mês' : view === 'week' ? 'Semana' : 'Dia'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}
    </div>
  )
}