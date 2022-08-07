<template>
  <h2><i class="fa-solid fa-newspaper"></i>Actualités</h2>
  <article  v-for="post in postStore.allPosts" :key="post.id">
    <div class="post-infos">
      <figure>
        <img src="../assets/image_par_defaut.png" alt="photo de profil">
      </figure>
      <div>
        <h3>{{post.User.firstName}} {{post.User.lastName}} </h3>
        <span>Publié le {{ post.createdAt }}</span>
      </div>
    </div>
    <div class="post-content">
      <p>{{post.text}}</p>
      <figure v-if="post.filePicture !== ''">
        <img  :src="'http://localhost:3000/images/' + post.filePicture" :alt="post.filePicture">
      </figure>
    </div>
    <div id="vote">
      <div class="content-button">
        <span>
          <button ><i class="fa-solid fa-thumbs-up green"></i>J'aime</button>
          <button @click.prevent="likePost(post)"><i class="fa-solid fa-thumbs-up"></i>J'aime</button>
        </span>
        <span>
          <button  class="red" @click.prevent="dislikePost(post)"><i class="fa-solid fa-thumbs-down red"></i>Je n'aime pas</button>
          <button  @click.prevent="dislikePost(post)"><i class="fa-solid fa-thumbs-down"></i>Je n'aime pas</button>
        </span>
      </div>
      <div class="content-button" id="options" v-if="authorizedUser(post.userId)">
        <span>
          <button @click="updatePost(post.id)"  ><i class="fa-solid fa-pen-to-square"></i>Modifier</button>
        </span>
        <span>
          <button @click="deletePost(post.id)"><i class="fa-solid fa-trash-can"></i>Supprimer</button>
        </span>
      </div>
    </div>
  </article>
  <article v-if="!postStore.allPosts.length">
    <p id="no-post">Il n'y a rien à afficher pour le moment.</p>
  </article>
</template>

<script>
import {useUserStore} from "@/store/user";
import {usePostStore} from "@/store/post";
import {formattingDate} from "@/common/utils";
import router from "@/router";

export default {
  name: "GetAllPosts",
  setup() {
    const userStore = useUserStore()
    const postStore = usePostStore()
    return {
      userStore,
      postStore
    }
  },
  data() {
    return {
    }
  },
  async beforeMount() {
    // Affiche les posts et les likes à l'apparation de la page
    await this.displayPosts()
  },


  methods: {

    // Call API pour récupérer l'ensemble des Posts
    async displayPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/posts/all',{
          method: "GET",
          headers: {"Authorization": `Bearer ${this.userStore.token}`}
        })

        // Récupère le tableau des posts
        const dataPosts = await response.json()

        // Si le token arrive à expiration l'utilisateur est redirigé vers la page de connexion
        if (response.status === 401 && dataPosts.error === "Erreur authentification") {
          alert("Votre session arrive à expiration, veuillez vous reconnecter.")
          localStorage.clear()
          await router.push({path:'/login'})
        }

        if (response.status !== 200) {
          return
        }



        // Modifie le format des dates de création
        dataPosts.forEach(post => {
          formattingDate(post)
        })






        // Envoi le tableau de posts au store
        this.postStore.setPosts(dataPosts)

      } catch (error) {
        console.log(error)
      }
    },

    // Vérfie si l'utilisateur est le créateur du Post
    authorizedUser (postUserId) {
      const authUser = this.userStore.user.userId
      const adminUser = this.userStore.user.isAdmin

      return authUser === postUserId || adminUser
    },

    // Modification d'un post
    updatePost (postId) {
      router.push({path:`/${postId}`})
    },

    // Suppression d'un post
    async deletePost(postId) {
      if (confirm("Voulez-vous vraiment supprimer cette publication?")) {
        try {
          const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: "Delete",
            headers: {"Authorization": `Bearer ${this.userStore.token}`}
          })

          const responseMsg = await response.json()

          // Si le token arrive à expiration l'utilisateur est redirigé vers la page de connexion
          if (response.status === 401 && responseMsg.error === "Erreur authentification") {
            alert("Votre session arrive à expiration, veuillez vous reconnecter.")
            localStorage.clear()
            await router.push({path:'/login'})
          }

          if (response.status === 200) {
            // Actualise le fil d'actualités
            this.postStore.deletePost(postId)
            alert("Votre publication a été supprimée avec succès !")
          }
        } catch (error) {
          console.log(error)
        }
      }
    },

    // LIKE
    async likePost(post) {
      // Défini le like
      const newLike = {
        like: 1
      }


      try {
        const response = await fetch(`http://localhost:3000/api/posts/${post.id}/like`, {
          method: "Post",
          body: JSON.stringify(newLike),
          headers: {"Authorization": `Bearer ${this.userStore.token}`, "Content-Type": "application/json"}
        })

        // Récupère le message de la réponse
        const responseMsg = await response.json()

        // Si le token arrive à expiration l'utilisateur est redirigé vers la page de connexion
        if (response.status === 401 && responseMsg.error === "Erreur authentification") {
          alert("Votre session arrive à expiration, veuillez vous reconnecter.")
          localStorage.clear()
          await router.push({path:'/login'})
        }

        if (response.status === 404) {
          return
        }


        post.Likes.find(like => like.postId === post.id && like.userId === this.userStore.user.userId && like.like === true)

        // Si le post est liké, le boutton "J'aime" passe au vert
        if (responseMsg.message === "Post liké !") {
          post.hasUserLiked = true
        }

        // Si le like est annulé le boutton "J'aime" est remis par défaut
        if (responseMsg.message === "Like annulé !") {
          post.hasUserLiked = false
        }

        // Si le post est disliké et que l'utisateur like
        if (responseMsg.message === "Dislike annulé et like créé !") {
          // Le boutton "Je n'aime pas" est remis par défaut, et le boutton "J'aime" passe au vert
          post.hasUserDisliked = false
          post.hasUserLiked = true
        }

      } catch (error) {
        console.log(error)
      }
    },

    // DISLIKE
    async dislikePost(post) {
      // Défini le dislike
      const newLike = {
        like: -1
      }

      try {
        const response = await fetch(`http://localhost:3000/api/posts/${post.id}/like`, {
          method: "Post",
          body: JSON.stringify(newLike),
          headers: {"Authorization": `Bearer ${this.userStore.token}`, "Content-Type": "application/json"}
        })

        // Récupère le message de la réponse
        const responseMsg = await response.json()

        // Si le token arrive à expiration l'utilisateur est redirigé vers la page de connexion
        if (response.status === 401 && responseMsg.error === "Erreur authentification") {
          alert("Votre session arrive à expiration, veuillez vous reconnecter.")
          localStorage.clear()
          await router.push({path:'/login'})
        }

        if (response.status === 404) {
          return
        }

        // Si le post est disliké, le boutton "Je n'aime pas" passe au rouge
        if (responseMsg.message === 'Post disliké !') {
          post.hasUserDisliked = true
        }

        // Si le dislike est annulé le bouton "Je n'aime pas" est remis par défaut
        if (responseMsg.message === "Dislike annulé !") {
          post.hasUserDisliked = false
        }

        // Si le post est liké et que l'utisateur dislike
        if (responseMsg.message === "Like annulé et dislike créé !") {
          // Le bouton "J'aime" est remis par défaut, et le boutton "Je n'aime pas" passe au rouge
          post.hasUserLiked = false
          post.hasUserDisliked = true
        }

      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
/* Base */
*{
  color: #4E5166;
}

h2{
  margin-bottom: 15px;
  position: relative;
}

h2::before{
  content: " ";
  border-bottom: solid #FD2D01 3px;
  position: absolute;
  width: 5em;
  bottom: -5px;
}

h3{
  color: #FD2D01;
  font-size: 17px;
  margin: 0 0 14px 0;
}

i{
  margin-right: 5px;
}

article {
  border: solid 2px #FFD7D7;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 0 35px 3px rgba(0,0,0,0.15);
}


/* Informations relative au post */
.post-infos{
  border-bottom: #FFD7D7 1px solid;
  position: relative;
  padding: 14px 30px 5px 30px;
  display: flex;
}

.post-infos figure{
  width: 35px;
  margin: 0 10px 0 0;
}

.post-infos figure img{
  width: 100%;
}

.post-infos span{
  font-size: 10px;
  font-style: italic;
  position: absolute;
  bottom: 7px;
}


/* Contenu du post */
.post-content p{
  margin: 20px 30px ;
  font-size: 14px;
}

.post-content figure{
  margin: 20px 30px;
}
.post-content figure img{
  width: 100%;
}


/* Boutons Like/Dislile, Modifier/Supprimer */
#vote{
  display: flex;
  border-top: #FFD7D7 1px solid;
}

.content-button{
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-evenly;
}

.content-button span{
  width: 100%;
  text-align: center;
}

.content-button button {
  font-weight: bold;
  border: none;
  background-color: white;
  cursor: pointer;
  transition: 100ms ease-in-out;
  text-align: center;
}

.content-button button:hover i, .content-button button:hover{
  color: #FD2D01;
  transform: scale(1.1);
  transition: 100ms ease-in-out;
}

.content-button span:nth-of-type(1){
  border-right: #FFD7D7 1px solid;
}

#options{
  border-left: #FFD7D7 1px solid;
}

#no-post{
  margin: 20px 30px;
}

.red{
  color: #FD2D01;
}

.green{
  color: green;
}

  /* Tablette and Smartphone Version */
  @media screen and (max-width: 992px){
    #vote{
      flex-direction: column;
    }

    .content-button{
      padding: 5px 0;
    }

    #options{
      border-left: none;
      border-top: #FFD7D7 1px solid;
    }
  }
</style>