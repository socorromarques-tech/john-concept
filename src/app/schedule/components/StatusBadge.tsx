"use client"

import { updateAppointmentStatus } from "../../actions/appointments"
import { useState } from "react"

interface StatusBadgeProps {
  appointmentId: string
  currentStatus: string
}

export function StatusBadge({ appointmentId, currentStatus }: StatusBadgeProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Agendado', color: 'bg-green-100 text-green-800' },
    { value: 'COMPLETED', label: 'Concluído', color: 'bg-blue-100 text-blue-800' },
    { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    { value: 'NO_SHOW', label: 'Não compareceu', color: 'bg-yellow-100 text-yellow-800' },
  ]

  const currentStatusOption = statusOptions.find(option => option.value === status) || statusOptions[0]

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setIsUpdating(true)
    try {
      await updateAppointmentStatus(appointmentId, newStatus)
      setStatus(newStatus)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={isUpdating}
        className={`text-xs font-medium px-2 py-1 rounded-full cursor-pointer appearance-none pr-6 ${currentStatusOption.color} ${
          isUpdating ? 'opacity-50' : 'hover:opacity-80'
        }`}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-600">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-4-4" />
        </svg>
      </div>
    </div>
  )
}