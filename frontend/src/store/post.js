import { defineStore } from 'pinia'

export const usePostStore = defineStore("post",{
    state: () => ({
        post: {},
        posts: [],
    }),
    actions: {
        getPosts(dataPosts) {
            // Récupère l'ensemble des posts connus de la base de données
            this.posts = dataPosts
        },
        getNewPost(post){
            // Récupère le post nouvellement crée
            this.post = post
            // Puis l'insère au début du tableau
            this.posts.unshift(this.post)
        }
    },
    getters: {
        allPosts () {
            /// A voir avec Florian //////////////////////////////////////////////////////
            // Se charge 2 fois à l'apparation de la page // vide et plein
            if (!this.posts) {
                return null
            }
            const postArray = this.posts
            //console.log(postArray)
            return postArray
        }
    }
})