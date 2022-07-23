// Importation des dépendances
import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import {database} from "./models/index.js";

// Importation des routes
import {routerUser} from "./routes/user.js";
import {routerPost} from "./routes/post.js";

// Création de l'application Express
const appExpress = express()

// Connexion à la base de données MySQL
try {
    // Automatise la création des tables
    await database.sync({alter:true})
    console.log('Connection Sequelize to MySQL > successful');
} catch (error) {
    console.error('Unable to connect sequelize to the database:', error);
}

// Analyse du corps de la requête
appExpress.use(express.json());

// Résoud les erreurs de CORS
appExpress.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

// Routes
appExpress.use('/api/auth',  routerUser)
appExpress.use('/api/posts', routerPost)

// Exportation de l'application Express
export {appExpress}