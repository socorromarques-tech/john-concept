"use client"

import { deleteAppointment } from "../../actions/appointments"
import Link from "next/link"
import { useState } from "react"

interface AppointmentActionsProps {
  appointmentId: string
}

export function AppointmentActions({ appointmentId }: AppointmentActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar este agendamento?")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteAppointment(appointmentId)
      // A página será recarregada automaticamente pelo revalidatePath
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error)
      alert("Erro ao deletar agendamento")
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/schedule/${appointmentId}/edit`}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Editar
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? "Deletando..." : "Deletar"}
      </button>
    </div>
  )
}