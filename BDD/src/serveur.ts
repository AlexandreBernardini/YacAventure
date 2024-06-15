// Import des dépendances
import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import path from 'path';

// Charger les variables d'environnement
dotenv.config();

// Configuration de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Activer les CORS pour toutes les requêtes
app.use(cors());

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

// Interface étendue pour inclure user
interface CustomRequest extends Request {
  user?: string;
  userId?: number;
}

//#region Multer
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: express.Request, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post('/uploadProfileImage', upload.single('profileImage'), (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${file.filename}`;

  const sql = 'UPDATE utilisateurs SET profile_image = ? WHERE id = ?';
  db.query(sql, [imageUrl, userId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'image de profil :', err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'image de profil' });
      return;
    }
    res.status(200).json({ message: 'Image de profil mise à jour avec succès', imageUrl });
  });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});
//#endregion


// Middleware pour vérifier le token JWT
const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Aucun token fourni' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Échec de l\'authentification du token' });
    }
    req.user = (decoded as { pseudo: string }).pseudo;
    next();
  });
};

////////////////////////////
//  GET /All              //
///////////////////////////
app.get('/utilisateurs', verifyToken, (req: CustomRequest, res: Response) => {
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
  const { prenom, nom, mot_de_passe, email, pseudo, age } = req.body;
  console.log('Données d\'inscription reçues :', req.body);

  // Insertion des données d'inscription dans la base de données
  const sql = 'INSERT INTO utilisateurs (prenom, nom , mot_de_passe, email, pseudo, age) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [prenom, nom, mot_de_passe, email, pseudo, age], (err, result) => {
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
//  GET /pseudo           //
///////////////////////////
app.get('/pseudo', verifyToken, (req: CustomRequest, res: Response) => {
  const pseudo = req.user;
  const sql = 'SELECT id, pseudo FROM utilisateurs WHERE pseudo = ?';
  db.query(sql, [pseudo], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du pseudo :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du pseudo' });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({ pseudo: user.pseudo, userId: user.id });
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  });
});

  

////////////////////////////
//  POST /connexion       //
///////////////////////////
// Route pour la connexion
app.post('/connexion', (req, res) => {
  const { pseudo, mot_de_passe } = req.body;

  // Requête pour vérifier si les informations de connexion sont correctes
  const sql = 'SELECT * FROM utilisateurs WHERE pseudo = ? AND mot_de_passe = ?';
  db.query(sql, [pseudo, mot_de_passe], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des informations de connexion :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la connexion' });
      return;
    }

    if (results.length > 0) {
      // Si les informations sont correctes, générer un token
      const user = { id: results[0].id, pseudo: results[0].pseudo };
      const accessToken = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.status(200).json({ success: true, token: accessToken });
    } else {
      // Si les informations sont incorrectes, retourner un échec
      res.status(401).json({ success: false, error: 'Informations de connexion incorrectes' });
    }
  });
});

////////////////////////////
//  GET /utilisateur       //
///////////////////////////
app.get('/utilisateur', verifyToken, (req: CustomRequest, res: Response) => {
  const pseudo = req.user;

  // Sélection des données de l'utilisateur connecté dans la base de données
  const sql = 'SELECT * FROM utilisateurs WHERE pseudo = ?';
  db.query(sql, [pseudo], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données de l\'utilisateur :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données de l\'utilisateur' });
      return;
    }
    console.log('Données de l\'utilisateur récupérées avec succès');
    res.status(200).json(results[0]); // Comme il ne devrait y avoir qu'un seul utilisateur, nous renvoyons results[0]
  });
});

// Route pour ajouter un ami
app.post('/ajouterAmi', verifyToken, (req: CustomRequest, res: Response) => {
    const { userId, userIdDemandeur } = req.body;
    // Logique pour ajouter un ami
    res.status(200).json({ message: 'Ami ajouté avec succès' });
});

// Route pour récupérer les demandes d'amis reçues
app.get('/demandesAmis', verifyToken, (req, res) => {
  const utilisateur_receveur_id = req.query.utilisateur_receveur_id;

  // Sélectionner les demandes d'amis reçues
  const sql = 'SELECT da.id, u.prenom, u.nom FROM demande_amis da JOIN utilisateurs u ON da.utilisateur_demandeur_id = u.id WHERE da.utilisateur_receveur_id = ? AND da.etat = "en_attente"';
  db.query(sql, [utilisateur_receveur_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des demandes d\'amis :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des demandes d\'amis' });
      return;
    }
    res.status(200).json(results);
  });
});

  
  // Route pour accepter une demande d'ami
  app.post('/accepterAmi', verifyToken, (req, res) => {
    const { requestId } = req.body;
  
    // Logique pour accepter la demande d'ami (mise à jour de l'état)
    const sql = 'UPDATE demande_amis SET etat = "acceptee" WHERE id = ?';
    db.query(sql, [requestId], (err) => {
      if (err) {
        console.error('Erreur lors de l\'acceptation de la demande d\'ami :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'acceptation de la demande d\'ami' });
        return;
      }
      res.status(200).json({ message: 'Demande d\'ami acceptée avec succès' });
    });
  });
  
  
  // Route pour rejeter une demande d'ami
  app.post('/rejeterAmi', verifyToken, (req, res) => {
    const { requestId } = req.body;
  
    // Logique pour rejeter la demande d'ami (mise à jour de l'état)
    const sql = 'UPDATE demande_amis SET etat = "rejettee" WHERE id = ?';
    db.query(sql, [requestId], (err) => {
      if (err) {
        console.error('Erreur lors du rejet de la demande d\'ami :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors du rejet de la demande d\'ami' });
        return;
      }
      res.status(200).json({ message: 'Demande d\'ami rejetée avec succès' });
    });
  });
  
  


  // Exemple pour la route /incrementerNotification
  app.post('/incrementerNotification', verifyToken, (req, res) => {
    const { userId } = req.body;
    // Logique pour incrémenter les notifications
  });
  
// Ajouter une nouvelle route pour récupérer les messages
app.get('/messages', verifyToken, (req, res) => {
    const { userId, friendId } = req.query;
    
    const sql = `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at DESC`;
    db.query(sql, [userId, friendId, friendId, userId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des messages :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
        return;
      }
      res.status(200).json(results);
    });
  });

  // Route pour récupérer les amis
app.get('/amis', verifyToken, (req, res) => {
  const utilisateur_id = req.query.utilisateur_id;

  const sql = `
    SELECT u.id, u.prenom, u.nom
    FROM utilisateurs u
    JOIN demande_amis da ON (u.id = da.utilisateur_demandeur_id OR u.id = da.utilisateur_receveur_id)
    WHERE (da.utilisateur_demandeur_id = ? OR da.utilisateur_receveur_id = ?) AND da.etat = 'acceptee' AND u.id != ?
  `;

  db.query(sql, [utilisateur_id, utilisateur_id, utilisateur_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des amis :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des amis' });
      return;
    }
    res.status(200).json(results);
  });
});

  
  // Ajouter une nouvelle route pour envoyer des messages
  app.post('/messages', verifyToken, (req, res) => {
    const { text, userId, friendId } = req.body;
  
    const sql = `INSERT INTO messages (text, sender_id, receiver_id) VALUES (?, ?, ?)`;
    db.query(sql, [text, userId, friendId], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'envoi du message :', err);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
        return;
      }
      res.status(201).json({ message: 'Message envoyé avec succès' });
    });
  });
  
////////////////////////////
//  POST /demandeAmi      //
///////////////////////////
app.post('/demandeAmi', verifyToken, (req, res) => {
  const { utilisateur_demandeur_id, utilisateur_receveur_id, etat } = req.body;

  // Vérifier si la demande d'amitié existe déjà
  const sqlCheckFriendshipRequest = 'SELECT COUNT(*) AS count FROM demande_amis WHERE utilisateur_demandeur_id = ? AND utilisateur_receveur_id = ?';
  db.query(sqlCheckFriendshipRequest, [utilisateur_demandeur_id, utilisateur_receveur_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'existence de la demande d\'ami :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de la vérification de l\'existence de la demande d\'ami' });
      return;
    }

    const count = results[0].count;
    if (count > 0) {
      res.status(400).json({ error: 'La demande d\'ami existe déjà' });
      return;
    }

    // Enregistrer la demande d'amitié dans la base de données
    const sqlAddFriendshipRequest = 'INSERT INTO demande_amis (utilisateur_demandeur_id, utilisateur_receveur_id, etat) VALUES (?, ?, ?)';
    db.query(sqlAddFriendshipRequest, [utilisateur_demandeur_id, utilisateur_receveur_id, etat], (err) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement de la demande d\'ami :', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement de la demande d\'ami' });
        return;
      }
      res.status(200).json({ message: 'Demande d\'ami enregistrée avec succès' });
    });
  });
});


////////////////////////////
//  POST /incrementerNotification //
///////////////////////////
app.post('/incrementerNotification', verifyToken, (req, res) => {
  const { user } = req.body;

  // Incrémenter le nombre de notifications pour l'utilisateur spécifié
  const sqlIncrementNotification = 'UPDATE notification SET nombre_notification = nombre_notification + 1 WHERE utilisateur_id = ?';
  db.query(sqlIncrementNotification, [user], (err) => {
    if (err) {
      console.error('Erreur lors de l\'incrémentation du nombre de notifications :', err);
      res.status(500).json({ error: 'Une erreur est survenue lors de l\'incrémentation du nombre de notifications' });
      return;
    }
    res.status(200).json({ message: 'Nombre de notifications incrémenté avec succès' });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});
