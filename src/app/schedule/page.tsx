"use client"

import { getAppointments, deleteAppointment, updateAppointmentStatus } from "../actions/appointments"
import Link from "next/link"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState, useEffect } from "react"

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Calendar Logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true)
      try {
        // Fetch huge range (could be optimized) or just the month
        // Fetching specifically for the view range
        const data = await getAppointments(startDate, endDate)
        setAppointments(data)
      } catch (error) {
        console.error("Erro ao buscar agendamentos", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [currentDate])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="min-h-screen bg-brand-gray">
      <nav className="bg-brand-black shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
             <div className="flex items-center gap-8">
               <Link href="/" className="text-xl font-serif font-bold text-white">John Concept</Link>
               <div className="flex gap-4">
                  <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">Dashboard</Link>
                  <Link href="/clients" className="text-sm font-medium text-gray-300 hover:text-white">Clientes</Link>
                  <Link href="/schedule" className="text-sm font-medium text-white border-b border-white pb-0.5">Agenda</Link>
               </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-serif font-bold tracking-tight text-brand-black capitalize">
                 {format(currentDate, "MMMM yyyy", { locale: ptBR })}
               </h1>
               <div className="flex items-center rounded-md bg-white shadow-sm ring-1 ring-inset ring-gray-300">
                  <button onClick={prevMonth} className="px-3 py-2 hover:bg-gray-50 rounded-l-md border-r border-gray-300">
                    &larr;
                  </button>
                  <button onClick={goToToday} className="px-4 py-2 text-sm font-semibold hover:bg-gray-50 border-r border-gray-300 hidden sm:block">
                    Hoje
                  </button>
                  <button onClick={nextMonth} className="px-3 py-2 hover:bg-gray-50 rounded-r-md">
                    &rarr;
                  </button>
               </div>
            </div>
            
            <Link
              href="/schedule/new"
              className="w-full sm:w-auto text-center rounded-md bg-brand-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              + Novo Agendamento
            </Link>
          </div>

          {/* Calendar Grid */}
          <div className="lg:flex lg:h-auto lg:flex-col">
            <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col rounded-lg overflow-hidden bg-white">
              {/* Desktops Header */}
              <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
                <div className="bg-white py-2">Dom</div>
                <div className="bg-white py-2">Seg</div>
                <div className="bg-white py-2">Ter</div>
                <div className="bg-white py-2">Qua</div>
                <div className="bg-white py-2">Qui</div>
                <div className="bg-white py-2">Sex</div>
                <div className="bg-white py-2">Sáb</div>
              </div>
              
              {/* Days Grid */}
              <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
                  {calendarDays.map((day) => {
                     const isCurrentMonth = isSameMonth(day, currentDate)
                     const dayProtocol = format(day, 'yyyy-MM-dd')
                     const dayAppointments = appointments.filter(apt => format(new Date(apt.date), 'yyyy-MM-dd') === dayProtocol)
                     
                     return (
                        <div key={day.toString()} className={`relative px-3 py-2 min-h-[120px] ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500'}`}>
                          <time dateTime={dayProtocol} className={
                              isToday(day) 
                              ? "flex h-6 w-6 items-center justify-center rounded-full bg-brand-green font-semibold text-white" 
                              : undefined
                          }>
                            {format(day, 'd')}
                          </time>
                          
                          {/* Desktop Appointments List */}
                          <ol className="mt-2">
                             {loading ? (
                                <p className="animate-pulse h-2 bg-gray-200 rounded w-full"></p>
                             ) : (
                                 dayAppointments.map(apt => (
                                     <li key={apt.id}>
                                        <Link href={`/schedule/${apt.id}/edit`} className="group flex flex-col mb-1 p-1 rounded hover:bg-gray-100 cursor-pointer border-l-2 border-brand-green bg-green-50/30">
                                           <div className="flex justify-between items-center">
                                              <p className="font-semibold text-gray-900 group-hover:text-brand-green">
                                                  {format(new Date(apt.date), 'HH:mm')} - {apt.client.name.split(' ')[0]}
                                              </p>
                                           </div>
                                            <p className="truncate text-gray-500 group-hover:text-gray-700 mt-0.5" title={apt.services.map((s: any) => s.description).join(', ')}>
                                                {apt.services.length > 0 ? apt.services[0].description : 'Serviço'}
                                            </p>
                                        </Link>
                                     </li>
                                 ))
                             )}
                          </ol>
                        </div>
                     )
                  })}
                </div>
                
                {/* Mobile View (List of days with appointments or empty) - Simplified to just list upcoming for MVP responsiveness or stack grid */}
                <div className="w-full lg:hidden block bg-white">
                   <div className="p-4 text-center text-gray-500 text-sm">
                      <p>Para uma melhor experiência de calendário, use um computador.</p>
                      <p className="mt-2">Abaixo, lista simplificada dos dias com agendamentos neste mês:</p>
                   </div>
                   <ul className="divide-y divide-gray-100">
                     {calendarDays.filter(day => {
                        const dayProtocol = format(day, 'yyyy-MM-dd')
                        return appointments.some(apt => format(new Date(apt.date), 'yyyy-MM-dd') === dayProtocol)
                     }).map(day => (
                        <li key={day.toString()} className="p-4">
                           <div className="font-bold mb-2">{format(day, "dd 'de' MMMM", { locale: ptBR })}</div>
                           <ul className="space-y-2">
                             {appointments
                               .filter(apt => format(new Date(apt.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                               .map(apt => (
                                 <li key={apt.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                     <span>{format(new Date(apt.date), 'HH:mm')} - {apt.client.name}</span>
                                     <Link href={`/schedule/${apt.id}/edit`} className="text-indigo-600">Editar</Link>
                                 </li>
                               ))
                             }
                           </ul>
                        </li>
                     ))}
                   </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
             <h2 className="text-lg font-bold mb-4">Agenda em Lista (Mês Atual)</h2>
             {/* Reusing the list view but filtered logic is already in calendar */}
             <div className="overflow-hidden rounded-lg bg-white shadow-lg border border-gray-100 p-4">
                <p className="text-gray-500 text-sm">Visualize os detalhes completos clicando nos cards acima.</p>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}
