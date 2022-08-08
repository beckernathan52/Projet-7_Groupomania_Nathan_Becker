import {Post} from "../models/post.js";
import {User} from "../models/user.js";
import {Like} from "../models/like.js";
import fs from 'fs'

// Vérifie si les champs sont valides
const checkPostValid = (req) => {
    let postText = {}
    try {
        postText = JSON.parse(req.body.text)
    } catch (error) {
        console.log(error)
        return false
    }
    return postText?.trim();
}


// Vérifie si le post existe
const checkPostExist = async (req) => {
    try {
        return await Post.findOne({where: {id: req.params.id}, include: User})

    } catch (error) {
        console.log(error)
    }
}

// Supprime les informations sensibles de l'utilisateur
function deleteSentitiveInfos(post)  {
    post.User.email = undefined
    post.User.password = undefined
}


// Création d'un Post
const createPost = async (req, res) => {
    // Récupération des objets de la requête
    const postText = JSON.parse(req.body.text)
    const postImg = req.file

    // Vérifie si le post est conforme avant la création
    const postValid = checkPostValid(req)
    if (!postValid) {
        return res.status(422).json({message: "Requête incorrecte, des informations sont manquantes."})
    }

    let post
    let newPost

    try {
        // Si le post ne contient pas d'image
        if (!postImg) {
            // Définition des informations du post
            newPost = await Post.create({
                text: postText,
                userId: req.auth.userId,
            })

        // Si le post contient une image
        } else {
            // Définition des informations du post
            newPost = await Post.create({
                text: postText,
                userId: req.auth.userId,
                filePicture: postImg.filename,
            })
        }
        // Sauvegarde du post
        await newPost.save()

        // Récupération du post crée
        post = await Post.findOne({where: {id: newPost.id, userId: req.auth.userId}, include:User})

        // Supprime l'email et le mot de passe du créateur
        deleteSentitiveInfos(post)

        // Requête traitée avec succès et création d’un post
        return res.status(201).json(post)

    } catch (error) {
        console.log(error)
    }
}



// Modification d'un Post
const updatePost = async (req, res) => {
    try {
        const postText = JSON.parse(req.body.text)
        const postImg = req.file

        if (!req.params.id) {
            return res.status(404).json({ error: "L'identifiant n'est pas défini."})
        }

        // Vérifie si le post existe
        const postExist = await checkPostExist(req)
        if (!postExist) {
            return res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }

        // Vérifie si l'utilisateur est autorisé
        if (postExist.userId !== req.auth.userId && !req.auth.isAdmin) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à effectuer cette opération."})
        }

        // Vérifie si le post est conforme avant la modification
        const postValid = checkPostValid(req)
        if (!postValid) {
            return res.status(422).json({message: "Requête incorrecte, des informations sont manquantes."})
        }

        let postObject

        // Si la requête contient une image
        if (postImg) {
            // Si un post contient uniquement du texte et qu'on souhaite lui ajouter une image
            if (postExist.filePicture === '') {
                // Post mis à jour avec une nouvelle image
                postObject = {
                    text: postText,
                    filePicture: postImg.filename
                }

            // Si on souhaite remplacer l'image existante
            } else {
                // Supprime l'ancienne image
                fs.unlink(`images/${postExist.filePicture}`, error => {
                    if (error) throw error;
                    console.log('Image effacée !')
                })

                // Post mis à jour avec une nouvelle image
                postObject = {
                    text: postText,
                    filePicture: postImg.filename
                }
            }

        // Si la requête contient uniquement du texte
        } else {
            postObject = {text: postText}
        }

        await Post.update(postObject, {where: {id: req.params.id, userId: req.auth.userId}})
        res.status(201).json({ message: 'Post modifié !'})

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}



// Suppression d'un post
const deletePost = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({ error: "L'identifiant n'est pas défini."})
        }

        // Vérifie si le post existe
        const postExist = await checkPostExist(req)
        if (!postExist) {
            return res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }

        // Vérifie si l'utilisateur est autorisé
        if (postExist.userId !== req.auth.userId && !req.auth.isAdmin) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à effectuer cette opération."})
        }

        // Si le post contient une image
        if (postExist.filePicture !== '') {
            fs.unlink(`images/${postExist.filePicture}`, error => {
                if (error) throw error;
                console.log('Image effacée !')
            })
        }

        await Post.destroy({where: {id:req.params.id}})
        res.status(200).json({ message: 'Post supprimé !'})

    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}



// Récupération du post demandé
const getOnePost = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({ error: "L'identifiant n'est pas défini."})
        }

        // Vérifie si le post existe
        const postExist = await checkPostExist(req)
        if (!postExist) {
            return res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }

        // Vérifie si l'utilisateur est autorisé
        if (postExist.userId !== req.auth.userId && !req.auth.isAdmin) {
            return res.status(403).json({ error: "Vous n'êtes pas autorisé à effectuer cette opération."})
        }

        // Supprime l'email et le mot de passe de la réponse
        deleteSentitiveInfos(postExist)

        // Renvoi le post
        res.status(200).json(postExist)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}


// Récupération de l'ensemble des Posts
const getAllPosts = async (req, res) => {
    try{
        // Récupère les Posts en ordre décroissant via la date de création
        const allPosts = await Post.findAll( {order: [['createdAt', 'DESC']], include: [{model: User}, {model: Like, required: false}]})

        if (!allPosts.length) {
            return res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }

        // Supprime l'email et le mot de passe du créateur sur chaque Post
        allPosts.forEach(post => {
            deleteSentitiveInfos(post)
        })

        res.status(200).json(allPosts)
    } catch (error) {
        res.status(500).json({ error: "Une erreur est survenue !" })
        console.log(error)
    }
}

export {createPost, getAllPosts, getOnePost, updatePost, deletePost}