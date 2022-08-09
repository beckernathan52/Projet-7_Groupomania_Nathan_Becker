<template>
  <h2><i class="fa-solid fa-share"></i>Exprimez-vous!</h2>
  <form ref="form"  @submit.prevent="createPost">
    <div class="input-group">
      <label for="message"><i class="fa-solid fa-pen-to-square"></i>Écrivez une publication</label>
      <input id="message" type="text" placeholder="Écrivez une publication" name="text" v-model="dataForm.text" @input="validText">
      <p>{{ error.msgText }}</p>
    </div>
    <label for="file"><i class="fa-solid fa-file"></i>Ajouter une image</label>
    <input id="file" type="file" @change="selectFile">
    <div class="btn-content">
      <button type="submit">Publier</button>
    </div>
  </form>
</template>

<script>
import {useUserStore} from "@/store/user";
import {usePostStore} from "@/store/post";
import {formattingDate, ifTokenExpirate, validText} from "@/common/utils";

export default {
  name: "CreatePost",
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
      dataForm: {
        text: null,
        file: null
      },
      error: {
        msgText: null
      },
    }
  },
  methods: {
    // Séléctionne l'image
    selectFile(event) {
      this.file = event.target.files[0]
    },

    // Vérifie si le champ "text" n'est pas vide
    validText,

    // Création d'un Post
    async createPost() {
      const isValidText = this.validText()
      if (!isValidText) {
        return
      }

      // Récupération des informations saisies par l'utilisateur
      const postBody = JSON.stringify(this.dataForm.text)
      const postFile = this.file

      const formData = new FormData()
      formData.append('text', postBody)

      // Si la requête contient une image
      if (postFile) {
        formData.append('filePicture', postFile)
      }

      // Envoi une requête à l'API
      try {
        const response = await fetch("http://localhost:3000/api/posts/create", {
          method: "POST",
          body: formData,
          headers: {"Authorization": `Bearer ${this.userStore.token}`}
        })

        // Récupération de la réponse
        const post = await response.json()

        // Si le token arrive à expiration l'utilisateur est redirigé vers la page de connexion
        await ifTokenExpirate(response, post)

        // Si la réponse est positive,
        if (response.status === 201) {
          // Modifie le format de la date
          formattingDate(post)

          // Envoi le nouveau Post au store
          this.postStore.setCreatedPost(post)

          // Réinitialise le formulaire
          this.$refs[`form`].reset()
          this.file = null
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

i{
  padding-right: 5px;
}

input, button, form{
  border-radius: 10px;
}

form{
  padding: 20px 30px;
  background: #FFD7D7;
  box-shadow: 0 0 35px 3px rgba(0,0,0,0.15);
}

.input-group {
  position: relative;
}

.input-group p {
  position: absolute;
  margin-top: -25px;
  color: #FD2D01;
  font-size: 12px;
}

label{
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}

label, p{
  font-weight: bold;
}

input{
  width: 100%;
  margin-bottom: 30px;
  padding: 0;
}

input, button{
  border: none;
}

.btn-content{
  display: flex;
  justify-content: center;
}

.btn-content button{
  width: 120px;
  background: #4E5166;
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.4s;
}

.btn-content button:hover{
  opacity: 0.9;
  box-shadow: 0 10px 19px -4px rgba(0,0,0,0.4);
}

#message,.btn-content button{
  height: 30px;
}
</style>