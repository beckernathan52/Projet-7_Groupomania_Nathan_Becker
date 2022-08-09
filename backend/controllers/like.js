// Like et Dislike
import {Post} from "../models/post.js";
import {User} from "../models/user.js";
import {Like} from "../models/like.js";

// Vérifie si le post existe
const checkPostExist = async (req) => {
    try {
        return await Post.findOne({where: {id: req.params.id}, include: User})
    } catch (error) {
        console.log(error)
    }
}

// Vote like ou dislike
const likeOrDislike = async (req, res) => {

    const userId = req.auth.userId
    const like = req.body.like

    try {
        // Vérifie si le post existe
        const postExist = await checkPostExist(req)
        if (!postExist) {
            return res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }

        if (like !== 1 && like !== -1) {
            return res.status(403).json({ error: "Requête incorrecte, votre demande est erronée."})
        }

        // Vérifie si le le vote existe
        const voteExist = await Like.findOne({where: {postId: req.params.id, userId: userId}, include: Post})

        // Like
        if (like === 1) {
            // Si l'utilisateur à déjà voté le post
            if (voteExist) {
                // Si l'utilisateur like le post, alors qu'il avait dislike
                if (voteExist.like === -1) {
                    const newLike = {like : 1 }
                    await Like.update(newLike ,{where: {id: voteExist.id}})
                    return res.status(200).json({message: "Dislike annulé et like créé !"})

                // Sinon le like est annulé
                } else {
                    await Like.destroy({where: {id: voteExist.id}})
                    return res.status(200).json({message: "Like annulé !"})
                }
            }

            // Si l'utilisateur n'a pas voté, le like est créé
            await Like.create({
                postId: postExist.id,
                userId: userId,
                like: 1
            })
            res.status(200).json({message: 'Post liké !'})
        }


        // Dislike
        if (like === -1) {
            // Si l'utilisateur à déjà voté le post
            if (voteExist) {
                // Si l'utilisateur dislike le post, alors qu'il avait like
                if (voteExist.like === true) {
                    const newLike = {like : -1 }
                    await Like.update(newLike ,{where: {id: voteExist.id}})
                    return res.status(200).json({message: "Like annulé et dislike créé !"})

                // Sinon le dislike est annulé
                } else {
                    await Like.destroy({where: {id: voteExist.id}})
                    return res.status(200).json({message: "Dislike annulé !"})
                }
            }

            // Si l'utilisateur n'a pas voté, le dislike est créé
            await Like.create({
                postId: postExist.id,
                userId: userId,
                like: -1
            })
            res.status(200).json({message: 'Post disliké !'})
        }
    } catch (error) {
        res.status(404).json({message: error.message})
        console.log(error)
    }
}

export {likeOrDislike}