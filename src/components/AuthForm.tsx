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
      className="clay-card auth-card"
      aria-label="Account"
    >
      <p className="eyebrow">Your private travel space</p>
      <h2>
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h2>
      <p className="auth-intro">
        {mode === 'login'
          ? 'Log in to see your private travel checklists.'
          : 'Register to save private checklists for your trips.'}
      </p>

      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <div>
          <label htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="clay-input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            className="clay-input"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : undefined}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === 'register' && (
            <p className="password-hint">
              Use at least 8 characters.
            </p>
          )}
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <button
          className="clay-button auth-submit"
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
        className="auth-switch"
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
