import { getAppointment, updateAppointment } from "../../../actions/appointments"
import { getClients } from "../../../actions/clients"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function EditAppointmentPage({ params }: { params: { id: string } }) {
  const appointment = await getAppointment(params.id)
  const clients = await getClients()

  if (!appointment) {
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
              <h1 className="text-2xl font-bold text-gray-900">Agendamento não encontrado</h1>
              <p className="mt-2 text-gray-600">O agendamento que você está tentando editar não existe.</p>
              <Link href="/schedule" className="mt-4 inline-block rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Voltar para Agenda
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Editar Agendamento</h1>
            <p className="mt-2 text-gray-600">Altere as informações do agendamento.</p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <form action={updateAppointment} className="px-6 py-8">
              <input type="hidden" name="appointmentId" value={appointment.id} />
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                    Cliente *
                  </label>
                  <select
                    id="clientId"
                    name="clientId"
                    required
                    defaultValue={appointment.clientId}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={appointment.status}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="SCHEDULED">Agendado</option>
                    <option value="COMPLETED">Concluído</option>
                    <option value="CANCELLED">Cancelado</option>
                    <option value="NO_SHOW">Não compareceu</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Data *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    defaultValue={format(new Date(appointment.date), "yyyy-MM-dd")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Horário *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    defaultValue={format(new Date(appointment.date), "HH:mm")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={appointment.notes || ""}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Adicione observações sobre o agendamento..."
                />
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Serviços</h3>
                <div className="space-y-2">
                  {appointment.services.length > 0 ? (
                    appointment.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="text-sm font-medium text-gray-900">{service.description}</span>
                        <span className="text-sm text-gray-500">R$ {Number(service.price).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum serviço cadastrado para este agendamento.</p>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Para editar os serviços, será necessário deletar e criar um novo agendamento.
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Salvar Alterações
                </button>
                <Link
                  href="/schedule"
                  className="rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}