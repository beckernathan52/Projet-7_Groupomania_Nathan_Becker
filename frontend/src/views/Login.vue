<template>
  <Header></Header>
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
      <button type="submit" @click="formSubmit">Se connecter</button>
      <p>Je n'ai pas de compte ? <br>Cliquez ici: <router-link to="/signup">"S'inscrire'"</router-link></p>
    </form>
  </div>
</template>

<script>
import router from "@/router";
import Header from "@/components/Header";

export default {
  name: `Login`,
  components: {Header},
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
      }
    }
  },
  methods: {
    validEmail() {
      this.error.MsgEmail = ""
      //eslint-disable-next-line
      if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.dataForm.email) || this.dataForm.email === null) {
        this.error.MsgEmail = "Email au format invalide!"
        return false
      }
      return true
    },

    validPassword() {
      this.error.MsgPassword=""
      /* Vérifie le format du mot de passe */
      if (! /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,20})$/.test(this.dataForm.password) || this.dataForm.password === null) {
        this.error.MsgPassword = "Mot de passe au format invalide, il doit contenir entre 8 et 20 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial."
        return false
      }
      return true
    },

    async formSubmit() {

      const isValidEmail = this.validEmail()
      const isValidPassword = this.validPassword()

      /* Vérifie l'ensemble des champs sont remplis */
      if (!isValidEmail || !isValidPassword) {
        alert("Une erreur est survenue! Veuillez vérifier les informations saisies.")
        return
      }

      const login = {
        email: this.dataForm.email,
        password: this.dataForm.password
      }

      // Envoi une requête à l'API
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          body: JSON.stringify(login),
          headers: {"Content-Type": "application/json"}
        })
        if (response.status === 401) {
          this.error.Msg = 'Utilisateur ou mot de passe invalide !'
          return
        }

        // Décodage du Token
        const dataUser = await response.json()
        const base64Url = dataUser.token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        const token = JSON.parse(window.atob(base64))
        const userId = token.userId

        localStorage.setItem('token', userId)
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