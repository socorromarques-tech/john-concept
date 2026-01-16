"use client"

import { getAppointments } from "../actions/appointments"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AppointmentActions } from "./components/AppointmentActions"
import { StatusBadge } from "./components/StatusBadge"
import { CalendarView } from "./components/CalendarView"
import { NotificationManager } from "./components/NotificationManager"
import { useState, useEffect } from "react"

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, dateFilter, statusFilter])

  const loadAppointments = async () => {
    try {
      const data = await getAppointments()
      setAppointments(data)
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = [...appointments]

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(apt => 
        format(new Date(apt.date), 'yyyy-MM-dd') === dateFilter
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setFilteredAppointments(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold text-indigo-600">John Concept</Link>
                <div className="flex gap-4">
                  <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</Link>
                  <Link href="/clients" className="text-sm font-medium text-gray-500 hover:text-gray-900">Clientes</Link>
                  <Link href="/schedule" className="text-sm font-medium text-gray-900">Agenda</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>Carregando...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationManager />
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-indigo-600">John Concept</Link>
              <div className="flex gap-4">
                <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">Dashboard</Link>
                <Link href="/clients" className="text-sm font-medium text-gray-500 hover:text-gray-900">Clientes</Link>
                <Link href="/schedule" className="text-sm font-medium text-gray-900">Agenda</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agenda</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {filteredAppointments.length} agendamento{filteredAppointments.length !== 1 ? 's' : ''} 
                  {dateFilter || statusFilter !== 'all' ? ' (filtrados)' : ' total'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'calendar' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Calendário
                  </button>
                </div>
                <Link
                  href="/schedule/new"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Novo Agendamento
                </Link>
              </div>
            </div>

            {viewMode === 'list' && (
              <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow">
                <div className="flex-1">
                  <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Data
                  </label>
                  <input
                    type="date"
                    id="dateFilter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrar por Status
                  </label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="all">Todos os status</option>
                    <option value="SCHEDULED">Agendado</option>
                    <option value="COMPLETED">Concluído</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="NO_SHOW">Não compareceu</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setDateFilter('')
                      setStatusFilter('all')
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {viewMode === 'calendar' ? (
            <CalendarView 
              appointments={filteredAppointments} 
              onDateClick={(date) => {
                // Navigate to new appointment with pre-filled date
                window.location.href = `/schedule/new?date=${format(date, 'yyyy-MM-dd')}`
              }}
            />
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <ul role="list" className="divide-y divide-gray-100">
                {filteredAppointments.length === 0 ? (
                  <li className="p-8 text-center text-gray-500">
                    {dateFilter || statusFilter !== 'all' 
                      ? 'Nenhum agendamento encontrado com os filtros selecionados.'
                      : 'Nenhum agendamento encontrado.'
                    }
                  </li>
                ) : (
                  filteredAppointments.map((apt) => (
                    <li key={apt.id} className="flex flex-col gap-2 py-5 px-6 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-x-4">
                        
                        <div className="min-w-0 flex-auto">
                          <p className="text-lg font-semibold leading-6 text-gray-900">
                             {format(new Date(apt.date), "HH:mm", { locale: ptBR })}
                             <span className="ml-2 font-normal text-gray-500 text-sm">
                               - {format(new Date(apt.date), "dd 'de' MMMM", { locale: ptBR })}
                             </span>
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-indigo-600">{apt.client.name}</p>
                          {apt.notes && <p className="mt-1 truncate text-xs text-gray-500">{apt.notes}</p>}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col items-start gap-2 sm:mt-0 sm:items-end">
                         {apt.services.length > 0 ? (
                             apt.services.map((service: any) => (
                                 <div key={service.id} className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                     {service.description} - R$ {Number(service.price).toFixed(2).replace('.', ',')}
                                 </div>
                             ))
                         ) : (
                             <span className="text-xs text-gray-400">Sem serviços</span>
                         )}
                         <div className="flex items-center gap-2">
                           <StatusBadge appointmentId={apt.id} currentStatus={apt.status} />
                           <AppointmentActions appointmentId={apt.id} />
                         </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}