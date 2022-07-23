<template>
  <div class="login">
    <form>
      <h2>Connexion</h2>
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" placeholder="Email" v-model="dataForm.email" @input="validEmail">
        <p>{{error.MsgEmail}}</p>
      </div>
      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input id="password" type="password" placeholder="Mot de passe" v-model="dataForm.password" @input="validPassword">
        <p>{{error.MsgPassword}}</p>
      </div>
      <span>{{error.Msg}}</span>
      <button type="submit" @click.prevent="formSubmit">Se connecter</button>
      <p>Je n'ai pas de compte ? <br>Cliquez ici: <router-link to="/signup">"S'inscrire"</router-link></p>
    </form>
  </div>
</template>

<script>
import router from "@/router";
import {validEmail, validPassword} from "@/common/utils";
import {useUserStore} from "@/store/user";

export default {
  name: `Login`,
  data() {
    return {
      dataForm: {
        email: null,
        password: null,
      },
      error:{
        Msg: null,
        MsgEmail: null,
        MsgPassword: null,
      },
    }
  },
  methods: {
    // Vérification du format de l'email et du mot de passe.
    validEmail,
    validPassword,

    async formSubmit() {
      const isValidEmail = this.validEmail()
      const isValidPassword = this.validPassword()

      /* Vérifie l'ensemble des champs sont remplis */
      if (!isValidEmail || !isValidPassword) {
        alert("Une erreur est survenue! Veuillez vérifier les informations saisies.")
        return
      }

      // Récupération des informations saisies par l'utilisateur
      const userLog = {
        email: this.dataForm.email,
        password: this.dataForm.password
      }

      // Envoi une requête à l'API
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          body: JSON.stringify(userLog),
          headers: {"Content-Type": "application/json"}
        })

        // Si la réponse est négative, affiche un message d'erreur
        if (response.status === 401) {
          this.error.Msg = 'Utilisateur ou mot de passe invalide !'
          return
        }

        // Récupération des informations de l'utilisateur (token, userId)
        const dataUser = await response.json()
        const encodedToken = dataUser.token

        // Envoi le token au store
        const userStore = useUserStore()
        userStore.login(encodedToken)

        // Redirige l'utilisateur sur la page d'accueil
        await router.push({path:'/'})

      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.login{
  display: flex;
  justify-content: center;
  font-weight: bold;
}

form{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin: 100px;
  padding: 40px 20px;
  background: #FFD7D7;
  border-radius: 20px;
  box-shadow: 0px 0px 35px 3px rgba(0,0,0,0.15);
}

.input-group{
  width: 80%;
  margin-bottom: 10px;
  position: relative;
}

.input-group p{
  margin-top: -20px;
  position: absolute;
  color: #FD2D01;
  font-size: 12px;
}

label{
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
}

input{
  height: 30px;
  border: none;
  border-radius: 10px ;
  width: 100%;
  padding: 0;
  margin-bottom: 25px;
}

button{
  width: 120px;
  height: 35px;
  background: #4E5166;
  border-radius: 10px;
  border: none;
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  margin-top: 30px;
}

span{
  text-align: center;
  color: #FD2D01;
}
</style>