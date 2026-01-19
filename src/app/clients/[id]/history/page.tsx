import { getClient, getClientHistory } from "../../../actions/clients"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function ClientHistoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const client = await getClient(params.id)

  if (!client) {
    notFound()
  }

  const history = await getClientHistory(params.id)

  // Calculate stats
  const totalVisits = history.filter(h => h.status === 'COMPLETED').length
  const totalSpent = history.reduce((acc, curr) => {
    if (curr.status !== 'COMPLETED') return acc
    const apptTotal = curr.services.reduce((sAcc, s) => sAcc + Number(s.price), 0)
    return acc + apptTotal
  }, 0)

  return (
    <div className="min-h-screen bg-brand-gray">
       <nav className="bg-brand-black shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
             <div className="flex items-center gap-8">
               <Link href="/" className="text-xl font-serif font-bold text-white">John Concept</Link>
               <div className="flex gap-4">
                  <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white">Dashboard</Link>
                  <Link href="/clients" className="text-sm font-medium text-white border-b border-white pb-0.5">Clientes</Link>
                  <Link href="/schedule" className="text-sm font-medium text-gray-300 hover:text-white">Agenda</Link>
               </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
             <Link href="/clients" className="text-sm text-brand-green hover:text-green-800">
              &larr; Voltar para Clientes
            </Link>
            <div className="mt-2 flex items-baseline justify-between">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-brand-black">Histórico do Cliente</h1>
                <Link href={`/clients/${client.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-800">Editar Perfil</Link>
            </div>
          </div>

          {/* Client Header Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-brand-green">
             <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <p>📞 {client.phone || "Sem telefone"}</p>
                        <p>📧 {client.email || "Sem email"}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="inline-block bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <span className="block text-xs uppercase tracking-wide text-gray-500">Total Gasto</span>
                        <span className="block text-xl font-bold text-brand-green">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
                        </span>
                    </div>
                    <div className="inline-block bg-gray-50 rounded-lg p-3 text-center border border-gray-100 ml-4">
                        <span className="block text-xs uppercase tracking-wide text-gray-500">Visitas</span>
                        <span className="block text-xl font-bold text-brand-black">{totalVisits}</span>
                    </div>
                 </div>
             </div>
             {client.notes && (
                 <div className="mt-4 pt-4 border-t border-gray-100">
                     <p className="text-sm text-gray-600 italic">" {client.notes} "</p>
                 </div>
             )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Linha do Tempo</h3>
          
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {history.length === 0 ? (
                  <li className="bg-white p-8 text-center rounded-lg border border-gray-200 text-gray-500">
                      Nenhum histórico encontrado para este cliente.
                  </li>
              ) : (
                history.map((event, eventIdx) => {
                  const isLast = eventIdx === history.length - 1
                  const total = event.services.reduce((acc, s) => acc + Number(s.price), 0)
                  
                  return (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {!isLast ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                event.status === 'COMPLETED' ? 'bg-green-500' : 
                                event.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-400'
                            }`}>
                              {event.status === 'COMPLETED' ? (
                                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                              )}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.status === 'COMPLETED' ? 'Realizou serviço em ' : 
                                 event.status === 'CANCELLED' ? 'Cancelou agendamento de ' : 'Agendado para '} 
                                <span className="font-medium text-gray-900">
                                    {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </span>
                              </p>
                              <div className="mt-2">
                                  {event.services.map(s => (
                                      <span key={s.id} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-2 mb-1">
                                          {s.description}
                                      </span>
                                  ))}
                              </div>
                              {event.notes && <p className="mt-1 text-xs text-gray-400 italic">{event.notes}</p>}
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              <time dateTime={event.date.toString()}>{format(new Date(event.date), "HH:mm")}</time>
                              {event.status === 'COMPLETED' && (
                                  <p className="mt-1 font-bold text-gray-900">
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                                  </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>

        </div>
      </main>
    </div>
  )
}
