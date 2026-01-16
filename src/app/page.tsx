import { auth, signOut } from "@/auth"
import { getDashboardStats } from "./actions/dashboard"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function Home() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Navigation */}
      <nav className="bg-brand-black text-white shadow-lg sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center gap-10">
               <div className="flex flex-col">
                  <span className="text-2xl font-serif font-bold tracking-wide text-white">JOHN CONCEPT</span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-gold">Hair & Beauty</span>
               </div>
               <div className="hidden md:flex gap-8">
                  <Link href="/" className="text-sm font-medium text-white border-b-2 border-brand-gold pb-1">Dashboard</Link>
                  <Link href="/clients" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Clientes</Link>
                  <Link href="/schedule" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Agenda</Link>
               </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-300 hidden sm:block">Olá, {session.user?.name}</span>
              <form action={async () => {
                "use server"
                await signOut()
              }}>
                <button type="submit" className="text-sm font-medium text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-full px-4 py-1 hover:border-white">
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="">
        {/* Hero Section */}
        <div className="relative h-64 w-full bg-brand-green overflow-hidden">
           <div className="absolute inset-0 bg-black/40 z-10"></div>
           <Image 
             src="/hero-bg.png" 
             alt="John Concept Salon" 
             fill
             className="object-cover opacity-60"
             priority
           />
           <div className="relative z-20 h-full flex items-center justify-center text-center">
             <div>
               <h1 className="text-4xl font-serif font-bold text-white shadow-sm">Bem-vindo ao John Concept</h1>
               <p className="mt-2 text-lg text-gray-200">Gestão profissional para um serviço de excelência.</p>
             </div>
           </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-30 pb-12">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <div className="overflow-hidden rounded-xl bg-white shadow-lg border-t-4 border-brand-green transition hover:transform hover:scale-[1.02] duration-200">
              <div className="px-6 py-6">
                <dt className="truncate text-sm font-medium text-gray-500 uppercase tracking-wide">Agendamentos Hoje</dt>
                <dd className="mt-2 text-4xl font-bold tracking-tight text-brand-black">{stats.appointmentsToday}</dd>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-lg border-t-4 border-gray-400 transition hover:transform hover:scale-[1.02] duration-200 group cursor-pointer">
              <Link href="/clients">
                <div className="px-6 py-6">
                   <dt className="truncate text-sm font-medium text-gray-500 uppercase tracking-wide group-hover:text-brand-green transition-colors">Clientes Ativos &rarr;</dt>
                   <dd className="mt-2 text-4xl font-bold tracking-tight text-brand-black">{stats.activeClients}</dd>
                </div>
              </Link>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-lg border-t-4 border-brand-gold transition hover:transform hover:scale-[1.02] duration-200">
              <div className="px-6 py-6">
                <dt className="truncate text-sm font-medium text-gray-500 uppercase tracking-wide">Faturamento Hoje</dt>
                <dd className="mt-2 text-4xl font-bold tracking-tight text-brand-green">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.revenueToday)}
                </dd>
              </div>
            </div>
          </div>
          
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Today's Schedule List */}
             <div className="lg:col-span-2">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold leading-6 text-brand-black">Próximos Horários (Hoje)</h3>
                   <Link href="/schedule" className="text-sm font-semibold text-brand-green hover:text-green-700 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow">
                     Ver agenda completa &rarr;
                   </Link>
                 </div>
                 
                 <div className="overflow-hidden bg-white shadow-md rounded-xl border border-gray-100">
                   <ul role="list" className="divide-y divide-gray-50">
                     {stats.todayAppointments.length === 0 ? (
                       <li className="px-6 py-12 text-center">
                         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                         </div>
                         <h3 className="mt-2 text-sm font-semibold text-gray-900">Dia livre</h3>
                         <p className="mt-1 text-sm text-gray-500">Nenhum agendamento para hoje até o momento.</p>
                         <div className="mt-6">
                           <Link href="/schedule/new" className="inline-flex items-center rounded-md bg-brand-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                             <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                               <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                             </svg>
                             Novo Agendamento
                           </Link>
                         </div>
                       </li>
                     ) : (
                       stats.todayAppointments.map((apt) => (
                        <li key={apt.id} className="hover:bg-gray-50 transition-colors">
                          <div className="px-6 py-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-brand-gray text-brand-black border border-gray-200">
                                   <span className="text-lg font-bold">{format(new Date(apt.date), "HH", { locale: ptBR })}</span>
                                   <span className="text-xs uppercase font-medium">{format(new Date(apt.date), "mm", { locale: ptBR })}</span>
                                </div>
                                <div>
                                   <p className="text-base font-semibold text-brand-black">{apt.client.name}</p>
                                   <p className="text-sm text-gray-500">
                                      {apt.services.map(s => s.description).join(", ") || "Serviço Geral"}
                                   </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                 <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${apt.status === 'SCHEDULED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                    {apt.status === 'SCHEDULED' ? 'Confirmado' : apt.status}
                                 </span>
                                 {apt.notes && <span className="text-xs text-gray-400 italic max-w-[150px] truncate" title={apt.notes}>{apt.notes}</span>}
                              </div>
                            </div>
                          </div>
                        </li>
                       ))
                     )}
                   </ul>
                 </div>
             </div>

             {/* Quick Actions / Info */}
             <div className="space-y-6">
                <div className="bg-brand-black rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-brand-green opacity-20 blur-2xl"></div>
                    <h3 className="text-lg font-bold relative z-10">Dica do Dia</h3>
                    <p className="mt-2 text-sm text-gray-300 relative z-10">Mantenha o cadastro dos clientes atualizado para oferecer um atendimento personalizado.</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Acesso Rápido</h3>
                    <div className="space-y-3">
                        <Link href="/clients/new" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                           <span className="text-sm font-medium text-gray-700 group-hover:text-brand-black">Cadastrar Cliente</span>
                           <span className="text-gray-400 group-hover:text-brand-green">&rarr;</span>
                        </Link>
                        <Link href="/schedule/new" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                           <span className="text-sm font-medium text-gray-700 group-hover:text-brand-black">Marcar Horário</span>
                           <span className="text-gray-400 group-hover:text-brand-green">&rarr;</span>
                        </Link>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
