import { useState } from 'react'

type AuthMode = 'login' | 'register' | 'recover'
type AuthFormProps = {
  onLogin: (email: string, password: string) => Promise<boolean>
  onRegister: (email: string, password: string) => Promise<boolean>
  onResetPassword: (email: string, recoveryCode: string, newPassword: string) => Promise<boolean>
  error: string
}

function AuthForm({ onLogin, onRegister, onResetPassword, error }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!email.trim() || !password || (mode === 'recover' && !recoveryCode.trim())) return
    setIsSubmitting(true)
    const succeeded = mode === 'login'
      ? await onLogin(email.trim(), password)
      : mode === 'register'
        ? await onRegister(email.trim(), password)
        : await onResetPassword(email.trim(), recoveryCode.trim(), password)
    setIsSubmitting(false)

    if (succeeded) {
      setPassword('')
      setRecoveryCode('')
      if (mode === 'recover') setMode('login')
      else setEmail('')
    }
  }

  const title = mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create your account' : 'Reset your password'
  const intro = mode === 'login'
    ? 'Log in to see your private travel checklists.'
    : mode === 'register'
      ? 'Register to save private checklists for your trips.'
      : 'Enter the recovery code you saved when you created your account.'

  return (
    <section className="clay-card auth-card" aria-label="Account">
      <p className="eyebrow">Your private travel space</p>
      <h2>{title}</h2>
      <p className="auth-intro">{intro}</p>

      <form className="auth-form" onSubmit={(event) => { event.preventDefault(); void submit() }}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" className="clay-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        {mode === 'recover' && <div>
          <label htmlFor="recovery-code">Recovery code</label>
          <input id="recovery-code" className="clay-input recovery-code-input" type="text" autoComplete="off" required placeholder="XXXX-XXXX-XXXX-XXXX" value={recoveryCode} onChange={(event) => setRecoveryCode(event.target.value.toUpperCase())} />
        </div>}

        <div>
          <label htmlFor="password">{mode === 'recover' ? 'New password' : 'Password'}</label>
          <div className="password-field">
            <input id="password" className="clay-input" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={mode === 'login' ? undefined : 8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          {mode !== 'login' && <p className="password-hint">Use at least 8 characters.</p>}
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}
        <button className="clay-button auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log in' : mode === 'register' ? 'Register' : 'Reset password'}
        </button>
      </form>

      {mode === 'login' && <button className="forgot-password-button" type="button" disabled={isSubmitting} onClick={() => setMode('recover')}>Forgot password?</button>}
      <button className="auth-switch" type="button" disabled={isSubmitting} onClick={() => setMode((current) => current === 'register' ? 'login' : current === 'recover' ? 'login' : 'register')}>
        {mode === 'login' ? 'Need an account? Register' : 'Back to login'}
      </button>
    </section>
  )
}

export default AuthForm
