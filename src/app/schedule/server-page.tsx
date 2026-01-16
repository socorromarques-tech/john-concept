import { getAppointments } from "../actions/appointments"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AppointmentActions } from "./components/AppointmentActions"
import { StatusBadge } from "./components/StatusBadge"
import { CalendarView } from "./components/CalendarView"
import { useState } from "react"

export default async function SchedulePage() {
  const appointments = await getAppointments()

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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Agenda</h1>
            <Link
              href="/schedule/new"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Novo Agendamento
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <ul role="list" className="divide-y divide-gray-100">
              {appointments.length === 0 ? (
                 <li className="p-8 text-center text-gray-500">
                    Nenhum agendamento encontrado.
                 </li>
              ) : (
                appointments.map((apt) => (
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
                           apt.services.map(service => (
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
        </div>
      </main>
    </div>
  )
}
