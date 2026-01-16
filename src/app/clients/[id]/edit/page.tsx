import { getClient, updateClient } from "../../../actions/clients"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await getClient(params.id)

  if (!client) {
    notFound()
  }

  const updateClientWithId = updateClient.bind(null, client.id)

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
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
             <Link href="/clients" className="text-sm text-brand-green hover:text-green-800">
              &larr; Voltar para Clientes
            </Link>
            <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-brand-black">Editar Cliente</h1>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg border-t-4 border-brand-green">
            <form action={updateClientWithId} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    defaultValue={client.name}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Telefone / WhatsApp</label>
                <div className="mt-2">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    defaultValue={client.phone || ""}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email (Opcional)</label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={client.email || ""}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

               <div>
                <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">Observações</label>
                <div className="mt-2">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    defaultValue={client.notes || ""}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-green sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-4">
                 <Link href="/clients" className="text-sm font-semibold leading-6 text-gray-900">Cancelar</Link>
                <button
                  type="submit"
                  className="rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
