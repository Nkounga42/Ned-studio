require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- ajouter CORS
const User = require('./models/user'); 


const app = express();
app.use(express.json());

const PORT = process.env.PORT 
const ORIGINE = process.env.ORIGINE  

app.use(cors({
  origin: ORIGINE, // URL de ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ned-studio-db" 
})
.then(() => console.log('✅ Connecté à MongoDB Atlas'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// ✅ Route test
app.get('/', (req, res) => {
  res.send('API Node.js + MongoDB est en ligne 🚀');
});

// ======================
//   ROUTES CRUD USERS
// ======================

// 🔹 Récupérer tous les users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 🔹 Récupérer un user par ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'ID invalide' });
  }
});

// 🔹 Créer un nouveau user
app.post('/users', async (req, res) => {
  try {
    const { name, lastname, email, password, sexe } = req.body;
    if (!name || !lastname || !email || !password || !sexe) {
      return res.status(400).json({ ok: false, message: 'Tous les champs sont obligatoires' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ ok: false, message: 'Email déjà utilisé' });
    }

    const newUser = new User({ name, lastname, email, password, sexe });
    await newUser.save();

    res.status(201).json({ ok: true, user: newUser });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ ok: false, message: 'Email ou mot de passe incorrect' });
    }

    // Optionnel : générer un token JWT ici
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// 🔹 Mettre à jour un user
app.put('/users/:id', async (req, res) => {
  try {
    const { name, lastname, email, sexe } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, lastname, email, sexe },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Impossible de mettre à jour le user', details: err });
  }
});

// 🔹 Supprimer un user
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ error: 'Impossible de supprimer le user', details: err });
  }
});

// ======================
//   LANCEMENT SERVEUR
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
