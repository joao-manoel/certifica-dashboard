import SignInForm from './sign-in-form'

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-black/20">
        <SignInForm />
      </div>
    </div>
  )
}
