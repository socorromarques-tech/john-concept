import { getClients, deleteClient } from "../actions/clients"
import Link from "next/link"

export default async function ClientsPage() {
  const clients = await getClients()

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-brand-black">Clientes</h1>
            <Link
              href="/clients/new"
              className="rounded-md bg-brand-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Novo Cliente
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow-lg border border-gray-100">
            <ul role="list" className="divide-y divide-gray-100">
              {clients.length === 0 ? (
                 <li className="p-8 text-center text-gray-500">
                    Nenhum cliente cadastrado.
                 </li>
              ) : (
                clients.map((client) => (
                  <li key={client.id} className="flex flex-col sm:flex-row justify-between gap-4 py-5 px-6 hover:bg-gray-50">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-base font-semibold leading-6 text-brand-black">{client.name}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{client.email || "Sem email"}</p>
                        <p className="sm:hidden text-sm leading-6 text-gray-700 mt-1">{client.phone || "Sem telefone"}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-1">
                      <p className="hidden sm:block text-sm leading-6 text-gray-900">{client.phone || "Sem telefone"}</p>
                      
                      <div className="flex items-center gap-3">
                          <Link href={`/clients/${client.id}/edit`} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                            Editar
                          </Link>
                          <form action={async () => {
                             "use server"
                             await deleteClient(client.id)
                          }}>
                              <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-900">
                                Excluir
                              </button>
                          </form>
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
