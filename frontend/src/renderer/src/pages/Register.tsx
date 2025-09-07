import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useRegisterConfig, RegisterConfig } from '../hooks/useRegisterConfig'

interface Props {
  config?: Partial<RegisterConfig>
}

export default function Register({ config }: Props): React.JSX.Element {
  const { loginUrl, brand } = useRegisterConfig(config)
  const [firstName, setFirstName] = useState('exauce')
  const [lastName, setLastName] = useState('nkounga')
  const [email, setEmail] = useState('nkoungagil@gmail.com')
  const [password, setPassword] = useState('117Gv12Cg')
  const [confirmPassword, setConfirmPassword] = useState('117Gv12Cg')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!firstName.trim()) {
      toast.error('Le prénom est requis.')
      return
    }
    if (!lastName.trim()) {
      toast.error('Le nom est requis.')
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Veuillez entrer un email valide.')
      return
    }
    if (!password || password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }

    
    try { 
      
      setLoading(true)
      // Appel à l'API d'inscription
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          username: email.split('@')[0], 
        }),
      })


      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      
      // Redirection vers la page de connexion après un court délai
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
       <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,.25),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,.25),transparent_35%)]" />
      <div className="relative z-10 grid min-h-screen  grid-cols-1 items-center pl-4 sm:pl-6 lg:grid-cols-2 lg:gap-16 lg:pl-8">
        <div > 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden text-white/90 lg:block"
        >
          <div>
            {brand?.logoUrl ? (
              <img src={brand.logoUrl} alt={brand?.name || 'Brand'} className="h-12 w-auto" />
            ) : (
              <div className="text-3xl font-semibold tracking-tight">{brand?.name || 'Votre App'}</div>
            )}
            <p className="mt-6 max-w-md text-balance text-lg text-white/70">
              Rejoignez notre communauté et commencez à créer des projets extraordinaires. 
              Gérez vos idées, collaborez et donnez vie à vos ambitions.
            </p>
          </div>
        </motion.div>

        <p className="m-4 sm:m-6 lg:m-8 absolute bottom-0 left-0 text-center text-xs text-white/60">
          © {new Date().getFullYear()} {brand?.name || 'Votre App'}. Tous droits réservés.
        </p>
        </div>
        <div 
          className="w-full mx-auto  h-screen flex flex-col justify-center border border-white/10 bg-white/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,.3)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            {brand?.logoUrl && (
              <img src={brand.logoUrl} alt={brand?.name || 'Brand'} className="h-8 w-8 rounded" />
            )}
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Créer un compte
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Prénom et Nom */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-white/80">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-white placeholder-white/40 outline-none ring-0 transition focus:border-white/30 focus:bg-white/15"
                  placeholder="Jean"
                  aria-invalid={false}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-white/80">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-white placeholder-white/40 outline-none ring-0 transition focus:border-white/30 focus:bg-white/15"
                  placeholder="Dupont"
                  aria-invalid={false}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-white placeholder-white/40 outline-none ring-0 transition focus:border-white/30 focus:bg-white/15"
                placeholder="vous@exemple.com"
                aria-invalid={false}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-white placeholder-white/40 outline-none focus:border-white/30 focus:bg-white/15"
                  placeholder="••••••••"
                  aria-invalid={false}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPwd ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-white/80">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/15 bg-white/10 px-2 py-1.5 text-white placeholder-white/40 outline-none focus:border-white/30 focus:bg-white/15"
                  placeholder="••••••••"
                  aria-invalid={false}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  aria-label={showConfirmPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPwd ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-2 py-1.5 font-medium text-slate-900 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80 mt-6"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/80 border-r-transparent" />
                  Inscription…
                </span>
              ) : (
                <>
                  Créer mon compte
                  <span className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 blur transition will-change-transform group-hover:opacity-100" />
                </>
              )}
            </button>

            {/* Diviseur */}
            <div className="flex items-center gap-3 text-white/40">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-xs uppercase tracking-wider">ou</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Boutons sociaux */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-white/90 transition hover:bg-white/15">
                Google
              </button>
              <button type="button" className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-white/90 transition hover:bg-white/15">
                GitHub
              </button>
            </div>

            {/* Lien connexion */}
            <p className="text-center text-sm text-white/70">
              Déjà un compte ?{' '}
              <a href={loginUrl} className="font-medium text-white underline-offset-4 hover:underline">
                Connectez-vous
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
