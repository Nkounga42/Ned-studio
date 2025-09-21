import React from "react"
import { 
  Rocket, 
  Zap, 
  Shield, 
  Code, 
  Users, 
  Star,
  ArrowRight,
  Play,
  Download,
  Github
} from "lucide-react"
import { motion } from "framer-motion"
import { useNotify } from "../hooks/useNotify"

const HomePage: React.FC = () => {
  const notify = useNotify()

  const handleGetStarted = () => {
    notify.success({
      title: "Bienvenue dans NED Studio !",
      message: "Explorez les différentes sections pour découvrir toutes les fonctionnalités."
    })
  }

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Développement Moderne",
      description: "Outils de développement avancés avec support TypeScript et React"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Performance Optimale",
      description: "Architecture haute performance avec Electron et Vite"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Sécurisé",
      description: "Sécurité renforcée avec authentification et gestion des permissions"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Collaboratif",
      description: "Outils de collaboration et de gestion d'équipe intégrés"
    }
  ]

  const stats = [
    { number: "100+", label: "Projets créés" },
    { number: "50+", label: "Plugins disponibles" },
    { number: "99%", label: "Temps de fonctionnement" },
    { number: "24/7", label: "Support technique" }
  ]

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <div className="relative bg-primary text-primary-content p-4 rounded-full">
                    <Rocket className="h-12 w-12" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                NED Studio
              </h1>
              
              <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-3xl mx-auto">
                La plateforme de développement moderne qui transforme vos idées en réalité. 
                Créez, collaborez et déployez avec une efficacité sans précédent.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Play className="h-5 w-5" />
                Commencer maintenant
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button className="btn btn-outline btn-lg gap-2">
                <Github className="h-5 w-5" />
                Voir sur GitHub
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-base-content/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir NED Studio ?
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font de NED Studio l'outil de développement 
              de référence pour les équipes modernes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
              >
                <div className="card-body text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="card-title text-lg justify-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-content mb-6">
              Prêt à transformer votre workflow ?
            </h2>
            <p className="text-lg text-primary-content/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de développeurs qui utilisent déjà NED Studio 
              pour créer des applications exceptionnelles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-secondary btn-lg gap-2 shadow-lg">
                <Download className="h-5 w-5" />
                Télécharger gratuitement
              </button>
              <button className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                En savoir plus
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6 bg-base-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <h2 className="text-2xl font-bold text-center mb-12">
              Accès rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Projets
                  </h3>
                  <p className="text-base-content/70">
                    Gérez vos projets et collaborez avec votre équipe
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-secondary" />
                    Modules
                  </h3>
                  <p className="text-base-content/70">
                    Explorez et installez des modules pour étendre les fonctionnalités
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="card-body">
                  <h3 className="card-title text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" />
                    Tests
                  </h3>
                  <p className="text-base-content/70">
                    Testez toutes les fonctionnalités et vérifiez les performances
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
