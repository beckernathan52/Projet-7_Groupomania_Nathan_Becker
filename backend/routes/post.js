import { Router } from "express";
import {authentication} from "../middleware/auth.js";
import {createPost, deletePost, getAllPosts, getOnePost, updatePost} from "../controllers/post.js"
import { imgStorage } from '../middleware/multer-config.js'
import {likeOrDislike} from "../controllers/like.js";

// Création du routeur pour les Posts
const routerPost = Router()

// Routes des Posts
routerPost.post('/create', authentication, imgStorage, createPost)
routerPost.get('/all', authentication, getAllPosts)
routerPost.get('/:id', authentication, getOnePost)
routerPost.put('/:id', authentication, imgStorage, updatePost)
routerPost.delete('/:id', authentication, deletePost)
routerPost.post('/:id/like', authentication, likeOrDislike)

export {routerPost}