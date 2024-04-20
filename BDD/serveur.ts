// Import des dépendances
import express, { Request, Response } from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';

// Configuration de l'application Express
const app = express();
const port = 3000;

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'YacAventure'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Middleware pour parser les corps des requêtes en JSON
app.use(bodyParser.json());

////////////////////////////
//  GET /All              //
///////////////////////////
app.get('/utilisateurs', (req, res) => {
  // Sélection de toutes les données des utilisateurs dans la base de données
  const sql = 'SELECT * FROM utilisateurs';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des utilisateurs' });
      return;
    }
    console.log('Utilisateurs récupérés avec succès');
    res.status(200).json(results);
  });
});

////////////////////////////
//  POST /inscription    //
///////////////////////////
// Route pour recevoir les données d'inscription
app.post('/inscription', (req, res) => {
  console.log(req.body);
  const { prenom, nom, age, mot_de_passe } = req.body;
  console.log('Données d\'inscription reçues :', req.body);

  // Insertion des données d'inscription dans la base de données
  const sql = 'INSERT INTO utilisateurs (prenom, nom, age, mot_de_passe) VALUES (?, ?, ?, ?)';
  db.query(sql, [prenom, nom, age, mot_de_passe], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'inscription :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de l\'inscription' });
      return;
    }
    console.log('Utilisateur inscrit avec succès');
    res.status(200).json({ message: 'Inscription réussie' });
  });
});

////////////////////////////
//  POST /connexion       //
///////////////////////////
app.post('/connexion', (req, res) => {
  const { prenom, nom, mot_de_passe } = req.body;

  // Requête pour vérifier si les informations de connexion sont correctes
  const sql = 'SELECT * FROM utilisateurs WHERE prenom = ? AND nom = ? AND mot_de_passe = ?';
  db.query(sql, [prenom, nom, mot_de_passe], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des informations de connexion :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la connexion' });
      return;
    }

    if (results.length > 0) {
      // Si les informations sont correctes, retourner un succès
      res.status(200).json({ success: true });
    } else {
      // Si les informations sont incorrectes, retourner un échec
      res.status(200).json({ success: false });
    }
  });
});

////////////////////////////
//  GET /utilisateursNotif //
///////////////////////////
app.get('/utilisateursNotif', (req, res) => {
  const { prenom, nom } = req.body; // Assurez-vous de récupérer le prénom et le nom de l'utilisateur connecté

  // Sélection de l'utilisateur avec le nombre de notifications dans la base de données
  const sql = 'SELECT notification FROM utilisateurnotif WHERE prenom = ? AND nom = ?';
  db.query(sql, [prenom, nom], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur avec notifications :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur avec notifications' });
      return;
    }
    console.log('Utilisateur avec notifications récupéré avec succès');
    res.status(200).json(results[0]); // Comme il ne devrait y avoir qu'un seul utilisateur, nous renvoyons results[0]
  });
});


// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});