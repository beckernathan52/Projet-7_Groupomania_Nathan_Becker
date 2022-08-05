<template>
  <div class="content">
    <h2><i class="fa-solid fa-pen-to-square"></i>Modifier votre publication</h2>
    <article>
      <div class="post-infos">
        <figure>
          <img src="../assets/image_par_defaut.png" alt="photo de profil">
        </figure>
        <div>
          <h3>{{creator.firstName}} {{creator.lastName}} </h3>
          <span>Publié le {{post.createdAt}}</span>
        </div>
      </div>
      <div class="post-content">
        <label for="message">Modifier votre message</label>
        <textarea id="message" @input="validText" v-model="post.text"></textarea>
        <p>{{error.MsgText}}</p>
        <label for="file"><i class="fa-solid fa-file"></i>Modifier votre image</label>
        <input id="file" type="file" @change="selectFile">
        <figure v-if="post.filePicture !== 'defaultPostPicture.png'">
          <img  :src="'http://localhost:3000/images/' + post.filePicture" :alt="post.filePicture">
        </figure>
      </div>
      <div id="vote">
        <div class="content-button">
        <span>
          <button><i class="fa-solid fa-thumbs-up"></i>J'aime</button>
        </span>
          <span>
          <button><i class="fa-solid fa-thumbs-down"></i>Je n'aime pas</button>
        </span>
        </div>
        <div class="content-button" id="options">
        <span>
          <button @click.prevent="updatePost"><i class="fa-solid fa-pen-to-square"></i>Modifier</button>
        </span>
          <span>
          <button @click.prevent="cancelUpdate"><i class="fa-solid fa-ban"></i>Annuler</button>
        </span>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import {useUserStore} from "@/store/user";
import {usePostStore} from "@/store/post";
import {formattingDate} from "@/common/utils";
import router from "@/router";

export default {
  name: "UpdatePost",
  setup() {
    const userStore = useUserStore()
    const postStore = usePostStore()
    return {
      userStore,
      postStore
    }
  },
  data(){
    return{
      post: {},
      creator: {},
      error: {
        MsgText: null
      },
    }
  },
  beforeMount() {
    this.getOnePost()
  },
  methods: {
    // Vérifie si le champ "text" n'est pas vide
    validText() {
    this.error.MsgText = ""
      if (!this.post.text?.trim()) {
        this.error.MsgText = "Ce champ est obligatoire !"
        return false
      }
      return true
    },


    // Récupère le post à afficher
    async getOnePost() {

      // Récupère l'ID du post
      const postId = this.$route.params.id

      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
          method: "GET",
          headers: {"Authorization": `Bearer ${this.userStore.token}`}
        })
        // Récupère la réponse
        const post = await response.json()

        // Reformate la date de création
        formattingDate(post)

        this.post = post
        this.creator = post.User

      } catch (error) {
        console.log(error)
      }
    },


    // Séléctionne l'image
    selectFile(event) {
      this.file = event.target.files[0]
    },


    // Modification d'un post
    async updatePost() {
      // Vérifie si le champ "text" n'est pas vide
      const isValidText = this.validText()
      if (!isValidText) {
        return
      }

      // Récupération des informations saisies par l'utilisateur
      const postBody = JSON.stringify(this.post.text)
      const postFile = this.file

      const formData = new FormData()
      formData.append('text', postBody)

      // Si la requête contient une image
      if (postFile) {
        formData.append('filePicture', postFile)
      }

      if (confirm("Voulez-vous appliquer ces modifications ?")) {
        try {
          const response = await fetch(`http://localhost:3000/api/posts/${this.post.id}`, {
            method: "Put",
            body: formData,
            headers: {"Authorization": `Bearer ${this.userStore.token}`}
          })

          if (response.status === 201) {
            alert("Votre publication a été modifiée avec succès!")
            // Redirige l'utilisateur sur la page d'accueil
            await router.push({path:'/'})
          }
        } catch (error) {
          console.log(error)
        }
      }
    },

    // Annulation des modifications
    cancelUpdate() {
      if (confirm("Êtes-vous sûr de vouloir annuler ? Vos modifications ne seront pas sauvegardées.")) {
        router.push({path:'/'})
      }
    }
  }
}
</script>

<style scoped>
/* Base */
*{
  color: #4E5166;
  font-weight: bold;
}
.content{
  width: 50%;
  margin: 0 auto;
  padding-top: 30px;
}

article {
  text-decoration: none;
  border: solid 2px #FFD7D7;
  border-radius: 10px;
  box-shadow: 0 0 35px 3px rgba(0,0,0,0.15);
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
  width: 10em;
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
.post-content{
  margin: 14px 30px 14px 30px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  position: relative;

}

.post-content textarea{
  resize: none;
  margin-bottom: 30px;
  position: relative;
}

.post-content p{
  position: absolute;
  top: 65px;
  color: #FD2D01;
  font-size: 12px;
}

.post-content figure{
  margin: 0 0 20px 0;
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

  /* Tablette and Smartphone Version */
  @media screen and (max-width: 992px){
    #vote{
      flex-direction: column;
    }

    .content{
      width: 85%;
      padding-top: 30px;
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