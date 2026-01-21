"use client"

import { updateAppointment, getAppointment, deleteAppointment, updateAppointmentStatus } from "../../../actions/appointments"
import { getClients } from "../../../actions/clients"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface Service {
  description: string
  price: string
}

export default function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const appointmentId = resolvedParams.id
  const router = useRouter()

  const [clients, setClients] = useState<any[]>([])
  const [services, setServices] = useState<Service[]>([]) 
  const [loading, setLoading] = useState(true)
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, appointmentData] = await Promise.all([
          getClients(),
          getAppointment(appointmentId)
        ])
        
        setClients(clientsData)
        
        if (appointmentData) {
            setInitialData(appointmentData)
            const formattedServices = appointmentData.services.map((s: any) => ({
                description: s.description,
                price: s.price.toString()
            }))
            setServices(formattedServices)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        alert("Erro ao carregar dados do agendamento.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [appointmentId])

  const addService = () => {
    setServices([...services, { description: "", price: "" }])
  }

  const removeService = (index: number) => {
    const newServices = [...services]
    newServices.splice(index, 1)
    setServices(newServices)
  }

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = [...services]
    newServices[index][field] = value
    setServices(newServices)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    formData.append("appointmentId", appointmentId)
    formData.append("status", initialData?.status || "SCHEDULED")

    try {
      await updateAppointment(formData) 
    } catch (error) {
       // Ignore Next.js redirect errors
      if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
        return
      }
      console.error("Erro ao atualizar agendamento:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      alert("Erro ao atualizar agendamento: " + errorMessage)
    }
  }

  const handleDelete = async () => {
      if (!confirm("Tem certeza que deseja EXCLUIR este agendamento? Essa ação não pode ser desfeita.")) {
          return
      }

      try {
          await deleteAppointment(appointmentId)
          // Redirect handled inside action or needs manual handling if action is void
          // The action currently does revalidatePath and nothing else visible, 
          // but deleteAppointment usually implies a redirect or refresh. 
          // Checking actions/appointments.ts... it revalidates but doesn't explicitly redirect. 
          // Let's force client redirect here for safety if action doesn't.
          // Wait, the action `deleteAppointment` in `appointments.ts` does NOT have `redirect`.
          // We should add `router.push('/schedule')` here.
          router.push('/schedule')
      } catch (error) {
          console.error("Erro ao deletar:", error)
          alert("Erro ao deletar agendamento.")
      }
  }

  const handleCancel = async () => {
      if (!confirm("Deseja marcar este atendimento como CANCELADO?")) {
          return
      }

      try {
          await updateAppointmentStatus(appointmentId, "CANCELLED")
          // No redirect needed, just refresh or redirect to list
          router.push('/schedule')
          router.refresh()
      } catch (error) {
          console.error("Erro ao cancelar:", error)
          alert("Erro ao cancelar agendamento.")
      }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gray">
        <div className="flex items-center justify-center min-h-screen">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!initialData) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p>Agendamento não encontrado.</p>
              <Link href="/schedule" className="ml-4 text-blue-500 underline">Voltar</Link>
          </div>
      )
  }

  const dateValue = initialData.date ? format(new Date(initialData.date), "yyyy-MM-dd") : ""
  const timeValue = initialData.date ? format(new Date(initialData.date), "HH:mm") : ""

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
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
             <Link href="/schedule" className="text-sm text-brand-green hover:text-green-800">
              &larr; Voltar para Agenda
            </Link>
            <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-brand-black">Editar Agendamento</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg bg-white p-8 shadow-lg border-t-4 border-brand-green">
              
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium leading-6 text-gray-900">Cliente</label>
                <div className="mt-2">
                  <select
                    id="clientId"
                    name="clientId"
                    defaultValue={initialData.clientId}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">Data</label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        defaultValue={dateValue}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                   <div>
                    <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">Hora</label>
                    <div className="mt-2">
                      <input
                        type="time"
                        name="time"
                        id="time"
                        defaultValue={timeValue}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
              </div>

              <div className="relative border-t border-gray-200 py-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Serviços Agendados</h3>
                    <button type="button" onClick={addService} className="text-sm text-brand-green font-semibold hover:text-green-800">+ Adicionar Serviço</button>
                 </div>
                 
                 <div className="space-y-4">
                     {services.map((service, index) => (
                         <div key={index} className="flex gap-4 items-start bg-gray-50 p-3 rounded-md">
                             <div className="flex-1">
                                 <input
                                     type="text"
                                     name={`service_${index}_description`}
                                     placeholder="Descrição do serviço"
                                     required
                                     value={service.description}
                                     onChange={(e) => updateService(index, 'description', e.target.value)}
                                     className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                                 />
                             </div>
                             <div className="w-32">
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                      <span className="text-gray-500 sm:text-sm">R$</span>
                                    </div>
                                     <input
                                         type="number"
                                         name={`service_${index}_price`}
                                         placeholder="0,00"
                                         required
                                         step="0.01"
                                         value={service.price}
                                         onChange={(e) => updateService(index, 'price', e.target.value)}
                                         className="block w-full rounded-md border-0 py-1.5 pl-9 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                                     />
                                </div>
                             </div>
                             <button type="button" onClick={() => removeService(index)} className="text-red-500 hover:text-red-700 font-bold px-2">
                                 &times;
                             </button>
                         </div>
                     ))}
                 </div>
                 <input type="hidden" name="servicesCount" value={services.length} />
                 
                  <div className="mt-4 flex justify-end">
                    <p className="text-sm font-semibold text-gray-900">
                      Total Estimado: R$ {services.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
              </div>

               <div>
                <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">Observações Gerais</label>
                <div className="mt-2">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    defaultValue={initialData.notes || ""}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

               {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-gray-900/10 pt-4">
                <div className="flex gap-4">
                     <button
                        type="button"
                        onClick={handleDelete}
                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        Excluir Agendamento
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-800"
                      >
                        Cancelar Atendimento
                      </button>
                </div>

                <div className="flex items-center gap-x-6">
                    <Link href="/schedule" className="text-sm font-semibold leading-6 text-gray-900">Cancelar e Voltar</Link>
                    <button
                    type="submit"
                    className="rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                    Salvar Alterações
                    </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
