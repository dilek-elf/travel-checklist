import { useState } from 'react'

type AuthFormProps = {
  onLogin: (email: string, password: string) => Promise<boolean>
  onRegister: (email: string, password: string) => Promise<boolean>
  error: string
}

function AuthForm({ onLogin, onRegister, error }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!email.trim() || !password) return

    setIsSubmitting(true)
    const succeeded =
      mode === 'login'
        ? await onLogin(email.trim(), password)
        : await onRegister(email.trim(), password)
    setIsSubmitting(false)

    if (succeeded) {
      setEmail('')
      setPassword('')
    }
  }

  return (
    <section
      className="rounded-3xl border border-[#e4d2c3] bg-[#fffaf5]/95 p-5 shadow-[0_18px_45px_rgba(88,57,40,0.1)] sm:p-8"
      aria-label="Account"
    >
      <h2 className="font-serif text-2xl font-semibold text-[#493126]">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#7a6153]">
        {mode === 'login'
          ? 'Log in to see your private travel checklists.'
          : 'Register to save private checklists for your trips.'}
      </p>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full rounded-2xl border border-[#d8c0af] bg-[#fcf7f2] px-4 py-3 outline-none focus:border-[#8b6048] focus:ring-4 focus:ring-[#c9a995]/25"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            className="w-full rounded-2xl border border-[#d8c0af] bg-[#fcf7f2] px-4 py-3 outline-none focus:border-[#8b6048] focus:ring-4 focus:ring-[#c9a995]/25"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : undefined}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === 'register' && (
            <p className="mt-2 text-xs text-[#8d7364]">
              Use at least 8 characters.
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-[#8a3f32]" role="alert">
            {error}
          </p>
        )}

        <button
          className="w-full rounded-2xl bg-[#76513e] px-5 py-3 font-semibold text-[#fffaf5] transition hover:bg-[#5f3f30] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Please wait...'
            : mode === 'login'
              ? 'Log in'
              : 'Register'}
        </button>
      </form>

      <button
        className="mt-4 w-full text-sm font-semibold text-[#76513e] underline-offset-4 hover:underline"
        type="button"
        disabled={isSubmitting}
        onClick={() => {
          setMode((currentMode) =>
            currentMode === 'login' ? 'register' : 'login',
          )
        }}
      >
        {mode === 'login'
          ? 'Need an account? Register'
          : 'Already have an account? Log in'}
      </button>
    </section>
  )
}

export default AuthForm
