"use client"

import { useState } from "react"

interface Service {
  description: string
  price: string
}

interface ServicesManagerProps {
  onServicesChange: (services: Service[]) => void
}

export function ServicesManager({ onServicesChange }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>([{ description: "", price: "" }])

  const addService = () => {
    const newServices = [...services, { description: "", price: "" }]
    setServices(newServices)
    onServicesChange(newServices)
  }

  const removeService = (index: number) => {
    if (services.length === 1) return
    const newServices = services.filter((_, i) => i !== index)
    setServices(newServices)
    onServicesChange(newServices)
  }

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    )
    setServices(newServices)
    onServicesChange(newServices)
  }

  return (
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
  )
}