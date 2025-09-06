import { useAuth } from '../contexts/AuthContext'

export interface LoginResult {
  ok: boolean
  message?: string
}

export interface LoginConfig {
  onLogin: (username: string, password: string) => Promise<void>
  forgotPasswordUrl: string
  signUpUrl: string
  brand: {
    name?: string
    logoUrl?: string
  }
}

export function useLoginConfig(config?: Partial<LoginConfig>): LoginConfig {
  const { login } = useAuth()

  const defaultConfig: LoginConfig = {
    onLogin: login, // Utilise la fonction login du contexte d'authentification
    forgotPasswordUrl: '#',
    signUpUrl: '/register',
    brand: {
      name: 'NED Studio',
      logoUrl: undefined
    }
  }

  return {
    ...defaultConfig,
    ...config
  }
}
