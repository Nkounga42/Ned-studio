const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    console.log('Register body:', req.body);

    let { firstName, lastName, email, password, username } = req.body;

    // Générer un username à partir de l'email si non fourni
    if (!username) {
      username = email.split('@')[0];
    }

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Vérification email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    // Vérification username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ error: 'Nom d\'utilisateur déjà pris' });
    }

    // Création utilisateur
    const newUser = new User({ firstName, lastName, email, password, username });
    try {
      await newUser.save();
    } catch (saveErr) {
      // Erreur de validation mongoose
      if (saveErr.name === 'ValidationError') {
        return res.status(400).json({ error: 'Erreur de validation: ' + saveErr.message });
      }
      // Erreur de duplication unique
      if (saveErr.code === 11000) {
        return res.status(409).json({ error: 'Email ou nom d\'utilisateur déjà utilisé.' });
      }
      console.error('Erreur lors de la sauvegarde:', saveErr);
      return res.status(500).json({ error: 'Erreur serveur lors de la création du compte.' });
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username,
      },
      token
    });
  } catch (err) {
    console.error('Erreur register:', err);
    // Erreur de validation JSON ou autre
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

 

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    console.log('Password valid:', isPasswordValid);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        sexe: user.sexe
      },
      token
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});


module.exports = router;
