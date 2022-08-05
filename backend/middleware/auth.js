// Importation des dépendances
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// Middleware d'authentification
const authentication = (req, res, next) => {
    try {
        // Extraction du token du header Authorization de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Verify pour décoder le token
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN);
        // Récupération de l'ID utilisateur
        const userId = decodedToken.userId;
        // Récupération du statut Administrateur
        const isAdmin = decodedToken.isAdmin

        // Ajout de l'ID utilisateur et du statut Administeur à la requête
        req.auth = { userId, isAdmin };

        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Erreur authentification' })
    }
}

export {authentication}