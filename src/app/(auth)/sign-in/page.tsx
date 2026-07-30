import SignInForm from './sign-in-form'

export default function SignInPage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center p-5 pt-20">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <SignInForm />
      </div>
    </main>
  )
}
