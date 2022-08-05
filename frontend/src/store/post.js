import { defineStore } from 'pinia'

export const usePostStore = defineStore("post",{
    state: () => ({
        post: {},
        posts: [],
    }),
    actions: {
        setPosts(dataPosts) {
            // Récupère l'ensemble des posts connus de la base de données
            this.posts = dataPosts
        },
        setCreatedPost(post){
            // Récupère le post nouvellement crée
            this.post = post

            // Puis l'insère au début du tableau
            if (!this.posts) {
                this.posts = []
            }
            this.posts.unshift(this.post)
        },
        deletePost(postId) {
            this.posts = this.posts.filter((post) => post.id !== postId)
        }
    },
    getters: {
        allPosts () {
            if (!this.posts) {
                return false
            }
            return this.posts
        }
    }
})