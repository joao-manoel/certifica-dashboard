export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full">
      <div className=" mx-auto px-4 py-6 md:py-8">
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seu perfil e segurança da conta.
          </p>
        </header>

        <main className="mt-6">{children}</main>
      </div>
    </div>
  )
}
