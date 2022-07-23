import {Post} from "../models/post.js";
import {User} from "../models/user.js";

const checkPostValid = (req) => {
    let postText = {}
    try {
        postText = req.body.text
    } catch (error) {
        console.log(error)
        return false
    }
    if (!postText?.trim()) {
        return false
    }
    return true
}

// Création d'un Post
const createPost = async (req, res, next) => {
    // Vérifie si le post est conforme avant la création
    const postValid = checkPostValid(req)
    if (!postValid) {
        return res.status(422).json({message: "Requête incorrecte, des informations sont manquantes."})
    }
    const postText = req.body.text

    try {
        // Définition des informations du post
        const newPost = await Post.create({
            text:postText,
            userId: req.auth.userId,
            //filePicture
        })
        // Sauvegarde du post
        await newPost.save()

        // A VOIR AVEC FLORIAN /////////////////////// /////////////////////// /////////////////////// /////////////////////// /////////////////////// /////////////////////// ///////////////////////
        const post = await Post.findOne({where: {id: newPost.id}, include:User})

        // Requête traitée avec succès et création d’un post
        return res.status(201).json(post)
    } catch (error) {
        console.log(error)
    }
}

// Récupération de l'ensemble des Posts
const getAllPosts = async (req, res, next) => {
    try{
        // Récupère les Posts en ordre décroissant via la date de création
        const allPosts = await Post.findAll( {order: [['createdAt', 'DESC']], include: User })

        if (!allPosts.length) {
            return res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }
        res.status(200).json(allPosts)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}



export {createPost, getAllPosts}