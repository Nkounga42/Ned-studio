const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Route d'inscription (register)
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;

    // Vérifier si tous les champs requis sont présents
    if (!firstName || !lastName || !email || !password || !username) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    // Vérifier si l'utilisateur existe déjà
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // Le mot de passe sera haché automatiquement grâce au middleware pre-save
      username
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Générer un token JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '24h' }
    );

    // Retourner les informations de l'utilisateur et le token
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        username: newUser.username
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route de connexion (login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '24h' }
    );

    // Retourner les informations de l'utilisateur et le token
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

module.exports = router;