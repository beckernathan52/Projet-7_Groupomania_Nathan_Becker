import { Router } from "express";
import {authentication} from "../middleware/auth.js";
import {createPost, getAllPosts} from "../controllers/post.js"

// Création du routeur pour les Posts
const routerPost = Router()

// Routes des Posts
routerPost.post('/create', authentication, createPost)
routerPost.get('/all', authentication, getAllPosts)


export {routerPost}