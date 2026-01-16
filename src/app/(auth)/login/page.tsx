import { signIn } from "@/auth"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">John Concept</h2>
          <p className="mt-2 text-sm text-gray-600">Gestão de Salão de Beleza</p>
        </div>

        <div className="mt-8 space-y-4">
          <form
            action={async () => {
              "use server"
              await signIn("credentials", { email: "john@teste.com", redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Entrar com Usuário de Teste (Dev)
            </button>
          </form>

           <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Ou (quando configurado)</span>
            </div>
          </div>

          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
             <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.0003 20.45c4.648 0 8.086-3.235 8.086-8.22 0-.671-.067-1.32-.183-1.944H12.0003v3.717h4.596c-.218 1.432-1.077 2.652-2.185 3.391v2.766h3.453c2.083-1.917 3.284-4.743 3.284-7.98 0-.848-.076-1.67-.218-2.464H12.0003v4.61h4.296c-.393 1.954-2.094 3.348-4.296 3.348-2.468 0-4.475-1.637-5.228-3.834h-3.41v2.72c1.725 3.42 5.275 5.766 9.338 5.766z" fill="#4285F4" /><path d="M6.7725 12.025c.19-.575.297-1.19.297-1.825s-.106-1.25-.297-1.825v-2.72h-3.41c-.694 1.385-1.087 2.955-1.087 4.545s.393 3.16 1.087 4.545l3.41-2.72z" fill="#34A853" /><path d="M12.0003 5.4c2.277 0 4.14 1.05 5.228 2.668l3.193-3.194C18.47 2.765 15.485 1.2 12.0003 1.2c-4.063 0-7.614 2.346-9.338 5.765l3.41 2.721c.753-2.198 2.76-3.835 5.228-3.835z" fill="#EA4335" /></svg>
              Entrar com Google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
