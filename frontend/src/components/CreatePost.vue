<template>
  <h2><i class="fa-solid fa-share"></i>Exprimez-vous!</h2>
  <form>
    <div class="input-group">
      <label for="message"><i class="fa-solid fa-pen-to-square"></i>Écrivez une publication</label>
      <input id="message" type="text" placeholder="Écrivez une publication" v-model="dataForm.text" @input="validText">
      <p>{{error.MsgText}}</p>
    </div>
    <label for="file"><i class="fa-solid fa-file"></i>Ajouter une image</label>
    <input id="file" type="file">
    <div class="btn">
      <button @click.prevent="createPost" @add-Post="addPost">Publier</button>
    </div>
  </form>
</template>

<script>
import {useUserStore} from "@/store/user";
import {usePostStore} from "@/store/post";
import {formattingDate} from "@/common/utils";

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
      },
      error: {
        MsgText: null
      },
    }
  },
  methods: {
    // Vérifie si le champ "text" n'est pas vide
    validText() {
      this.error.MsgText = ""
      if (!this.dataForm.text?.trim()) {
        this.error.MsgText = "Ce champ est obligatoire !"
        return false
      }
      return true
    },
    // Création d'un Post
    async createPost() {
      const isValidText = this.validText()
      if (!isValidText) {
        return
      }
      // Récupération des informations saisies par l'utilisateur
      const formData = {
        text: this.dataForm.text
      }
      // Envoi une requête à l'API
      try {
        const response = await fetch("http://localhost:3000/api/posts/create", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {"Authorization": `Bearer ${this.userStore.token}`, "Content-Type": "application/json"}
        })
        // Récupération de la réponse
        const post = await response.json()

        // Modifie le format de la date avant l'envoi au store
        formattingDate(post)

        // Si la réponse est positive, envoi le nouveau Post au store
        if (response.status === 201) {
          this.postStore.getNewPost(post)
          // Réinitialise le formulaire
          document.querySelector('form').reset()
        }
        return
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
h2{
  margin-bottom: 5px;
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
  box-shadow: 0px 0px 35px 3px rgba(0,0,0,0.15);
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

.btn{
  display: flex;
  justify-content: center;
}

button{
  width: 120px;
  background: #4E5166;
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
}

#message, button{
  height: 30px;
}
</style>