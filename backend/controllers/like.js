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

    try{
        // Vérifie si le post existe
        const postExist = await checkPostExist(req)
        if (!postExist) {
            res.status(404).json({ error: "Aucun post n'a été trouvé."})
        }

        // Vérifie si le le vote existe
        const voteExist = await Like.findOne({where: {postId: req.params.id, userId: userId}, include: Post})

        let hasUserLiked
        let hasUserDisliked

        // Like
        if (like === 1) {
            // Si l'utilisateur à déjà voté le post
            if (voteExist) {
                // Si l'utilisateur like le post, alors qu'il avait dislike
                if (voteExist.like === -1) {
                    const newLike = {like : 1 }
                    await Like.update(newLike ,{where: {id: voteExist.id}})

                    // Met à jour le post en conséquence
                    //hasUserLiked = {hasUserLiked: true, hasUserDisliked: false}
                    //await Post.update(hasUserLiked, {where: {id: req.params.id}})

                    return res.status(200).json({message: "Dislike annulé et like créé !"})

                // Sinon le like est annulé
                } else {
                    //hasUserLiked = {hasUserLiked: false}
                    //await Post.update(hasUserLiked, {where: {id: req.params.id}})

                    await Like.destroy({where: {id: voteExist.id}})
                    return res.status(200).json({message: "Like annulé !"})
                }
            }

            //hasUserLiked = {hasUserLiked: true}
            //await Post.update(hasUserLiked, {where: {id: req.params.id}})
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

                    // Met à jour le post en conséquence
                    //hasUserDisliked = {hasUserDisliked: true, hasUserLiked: false}
                    //await Post.update(hasUserDisliked, {where: {id: req.params.id}})
                    return res.status(200).json({message: "Like annulé et dislike créé !"})

                // Sinon le dislike est annulé
                } else {
                    //hasUserDisliked = {hasUserDisliked: false}
                    //await Post.update(hasUserDisliked, {where: {id: req.params.id}})

                    await Like.destroy({where: {id: voteExist.id}})
                    return res.status(200).json({message: "Dislike annulé !"})
                }
            }

            // Met à jour le post
            //hasUserDisliked = {hasUserDisliked: true}
            //await Post.update(hasUserDisliked, {where: {id: req.params.id}})

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