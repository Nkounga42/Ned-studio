export interface RegisterResult {
  ok: boolean
  message?: string
}

export interface RegisterConfig {
  onRegister: (email: string, password: string, confirmPassword: string, firstName: string, lastName: string) => Promise<void>
  loginUrl: string
  brand: {
    name?: string
    logoUrl?: string
  }
}

export function useRegisterConfig(config?: Partial<RegisterConfig>): RegisterConfig {
  const defaultConfig: RegisterConfig = {
    onRegister: async () => {},
    loginUrl: '/login',
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
