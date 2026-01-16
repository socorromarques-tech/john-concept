"use client"

import { createAppointment } from "../../actions/appointments"
import { getClients } from "../../actions/clients"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Service {
  description: string
  price: string
}

export default function NewAppointmentPage() {
  const [clients, setClients] = useState<any[]>([])
  const [services, setServices] = useState<Service[]>([{ description: "", price: "" }])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await getClients()
        setClients(clientsData)
      } catch (error) {
        console.error("Erro ao carregar clientes:", error)
      } finally {
        setLoading(false)
      }
    }
    loadClients()
  }, [])

  const addService = () => {
    setServices([...services, { description: "", price: "" }])
  }

  const removeService = (index: number) => {
    if (services.length === 1) return
    setServices(services.filter((_, i) => i !== index))
  }

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    )
    setServices(newServices)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    
    // Adicionar os serviços ao FormData
    services.forEach((service, index) => {
      formData.append(`service_${index}_description`, service.description)
      formData.append(`service_${index}_price`, service.price)
    })
    formData.append('servicesCount', services.length.toString())

    try {
      const result = await createAppointment(formData)
      
      if (result.success) {
        window.location.href = '/schedule'
      } else {
        alert("Erro ao criar agendamento: " + result.error)
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      alert("Erro ao criar agendamento: " + errorMessage)
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
            <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-brand-black">Novo Agendamento</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg bg-white p-8 shadow-lg border-t-4 border-brand-green">
              
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium leading-6 text-gray-900">Cliente</label>
                <div className="mt-2">
                  <select
                    id="clientId"
                    name="clientId"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                 <div className="mt-1 text-right">
                    <Link href="/clients/new" className="text-xs text-brand-green hover:underline">+ Cadastrar novo cliente</Link>
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
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
              </div>

              <div className="relative border-t border-gray-200 py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Serviços a Realizar <span className="text-red-500">*</span></h3>
                    <button
                      type="button"
                      onClick={addService}
                      className="text-xs bg-brand-green text-white px-2 py-1 rounded hover:bg-green-900"
                    >
                      + Adicionar Serviço
                    </button>
                  </div>

                  {services.map((service, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-7">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tipo de Serviço
                        </label>
                        <input
                          type="text"
                          list="service-suggestions"
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          placeholder="Ex: Corte, Coloração, Progressiva..."
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Preço (R$)
                        </label>
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) => updateService(index, 'price', e.target.value)}
                          placeholder="0,00"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                          required
                        />
                      </div>
                      <div className="col-span-2 flex items-end">
                        {services.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="w-full rounded-md bg-red-600 px-2 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <datalist id="service-suggestions">
                    <option value="Corte Masculino" />
                    <option value="Corte Feminino" />
                    <option value="Barba" />
                    <option value="Coloração" />
                    <option value="Luzes / Mechas" />
                    <option value="Progressiva" />
                    <option value="Hidratação" />
                    <option value="Selagem" />
                  </datalist>
                </div>
              </div>

               <div>
                <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">Observações Gerais</label>
                <div className="mt-2">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={2}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-4">
                 <Link href="/schedule" className="text-sm font-semibold leading-6 text-gray-900">Cancelar</Link>
                <button
                  type="submit"
                  disabled={services.some(s => !s.description || !s.price)}
                  className="rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}