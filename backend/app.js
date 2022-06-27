// Importation des dépendances
import express from 'express'
import dotenv from 'dotenv'
dotenv.config();

// Création de l'application Express
const appExpress = express()

// Analyse du corps de la requête
appExpress.use(express.json());

// Résoud les erreurs de CORS
appExpress.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})


// Exportation de l'application Express
export {appExpress}