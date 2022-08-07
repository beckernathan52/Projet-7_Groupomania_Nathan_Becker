// Importation des dépendances
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

// Importation des informations de l'utilisateur
import { User } from '../models/user.js'

// Vérification du format de l'email
const validateEmail = (req) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)
}

// Vérification du format du nom
const validateLastName = (req) => {
    return /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})?([-]{0,1})?([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})$/.test(req.body.lastName)
}

// Vérification du format du prénom
const validateFirstName = (req) => {
    return /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})?([-]{0,1})?([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})$/.test(req.body.firstName)
}

// Vérification du format du mot de passe
const validatePassword = (req) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_#])([-+!*$@%_#\w]{8,20})$/.test(req.body.password)
}

// Inscription
const signup = async (req, res, next) => {
    // Vérifie si l'email et le mot de passe ont un format valide
    const emailValid = validateEmail(req)
    const passwordValid = validatePassword(req)
    const firstNameValid = validateFirstName(req)
    const lastNameValid = validateLastName(req)

    if (!firstNameValid) {
        return res.status(400).json({ error: 'Format prénom invalide !' })
    }

    if (!lastNameValid) {
        return res.status(400).json({ error: 'Format nom invalide !' })
    }

    if (!emailValid) {
        return res.status(400).json({ error: 'Format email invalide !' })
    }
    if (!passwordValid) {
        return res.status(400).json({ error: 'Format mot de passe invalide !' })
    }

    try {
        // Crée un hash crypté du mot de passe de l'utilisateur, hash 10 fois
        const hash = await bcrypt.hash(req.body.password, 10)
        const userFound = await User.findOne({where: {email:req.body.email}})

        // Si l'adresse mail est déjà utilisé
        if (userFound) {
            return res.status(403).json({ error: 'Adresse mail déjà utilisé !' })
        }

        // Définition des informations de l'utilisateur
        const user = await User.create({
            email: req.body.email,
            password: hash,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            isAdmin: req.body.isAdmin,
            id: req.body.id,
        });

        // Sauvegarde des informations de l'utilisateur
        await user.save()

        // Requête traitée avec succès et création d’un utilisateur
        return res.status(201).json({ message: 'Utilisateur créé !' })
    } catch (error) {
        res.status(500).json()
        console.log(error)
    }
}

// Connexion
const login = async (req, res, next) => {
    // Vérifie si l'email et le mot de passe ont un format valide
    const emailValid = validateEmail(req)
    const passwordValid = validatePassword(req)

    if (!emailValid) {
        return res.status(400).json({ error: 'Format email invalide !' })
    }
    if (!passwordValid) {
        return res.status(400).json({ error: 'Format mot de passe invalide !' })
    }

    try {
        // Tente de trouver une adresse mail identique entre la base de données et la requête
        const userFound = await User.findOne({where: {email:req.body.email}})

        // Si aucun utilisateur n'a été trouver
        if (!userFound) {
            return res.status(401).json({ error: 'Utilisateur ou mot de passe invalide !' })
        }

        // Compare le mot de passe de la requête avec celui de la base de donnée
        const match = await bcrypt.compare(req.body.password, userFound.password)

        // Si le mot de passe n'est pas valide
        if (!match) {
            return res.status(401).json({ error: 'Utilisateur ou mot de passe invalide !' })
        }

        // Si le mot de passe et l'email sont valide
        res.status(200).json({isAdmin: userFound.isAdmin, userId: userFound.id, token: jwt.sign({ userId: userFound.id, isAdmin: userFound.isAdmin }, process.env.RANDOM_TOKEN, { expiresIn: '24h' })})

    } catch (error) {
        res.status(500).json()
        console.log(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll()

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json()
        console.log(error)
    }
}

// Exportation
export {signup, login}