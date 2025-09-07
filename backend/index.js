require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ORIGINE = process.env.ORIGINE || '*';

// CORS
app.use(cors({
  origin: ORIGINE,
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "ned-studio-db"
})
.then(() => console.log('✅ Connecté à MongoDB Atlas'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Route test
app.get('/', (req, res) => res.send('API Node.js + MongoDB en ligne 🚀'));

// Routes CRUD utilisateurs (optionnel, côté admin)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'ID invalide' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, username, sexe } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, username, sexe },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Impossible de mettre à jour le user', details: err });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ error: 'Impossible de supprimer le user', details: err });
  }
});

// Routes Auth
app.use('/auth', authRoutes);

// Lancer serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
