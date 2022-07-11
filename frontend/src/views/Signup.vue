<template>
  <Header></Header>
  <div class="signup">
    <form>
      <h2>Inscription</h2>
      <div class="input-group">
        <label for="name">Nom</label>
        <input id="name" type="text" placeholder="Nom" v-model="dataForm.lastName" @input="validLastName">
        <p>{{error.MsgLastName}}</p>
      </div>
      <div class="input-group">
        <label for="firstName">Prénom</label>
        <input id="firstName" type="text" placeholder="Prénom" v-model="dataForm.firstName" @input="validFirstName">
        <p>{{error.MsgFirstName}}</p>
      </div>
      <div class="input-group">
        <label for="email">Email</label>
        <input id="email" type="email" placeholder="Email" v-model="dataForm.email" @input="validEmail">
        <p>{{error.MsgEmail}}</p>
      </div>
      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input id="password" type="password" placeholder="Mot de passe" v-model="dataForm.password" @input="validPassword">
        <p>{{error.MsgPassword}}</p>
      </div>
      <span>{{error.Msg}}</span>
      <button type="submit" @click="formSubmit">S'inscrire</button>
      <p>Je possède déjà un compte ? <br>Cliquez ici: <router-link to="/login">"Se connecter"</router-link></p>
    </form>
  </div>
</template>

<script>
import router from "@/router";
import Header from "@/components/Header";

export default {
  name: `Signup`,
  components: {Header},
  data() {
    return {
      dataForm: {
        lastName: null,
        firstName: null,
        email: null,
        password: null,
      },
      error:{
        Msg: null,
        MsgLastName: null,
        MsgFirstName: null,
        MsgEmail: null,
        MsgPassword: null,
      }
    }
  },
  methods: {
    /* Vérifie le format de l'email */
    validEmail() {
      this.error.MsgEmail = ""
      //eslint-disable-next-line
      if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.dataForm.email) || this.dataForm.email === null) {
        this.error.MsgEmail = "Email au format invalide!"

        return false
      }
      return true
    },

    validFirstName() {
      this.error.MsgFirstName = ""
      /* Vérifie le format du prénom */
      if (! /^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(this.dataForm.firstName) || this.dataForm.firstName === null) {
        this.error.MsgFirstName = "Prénom au format incorrect."
        return false
      }
      return true
    },

    validLastName() {
      this.error.MsgLastName = ""
      /* Vérifie le format du nom */
      if (! /^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(this.dataForm.lastName ) || this.dataForm.lastName === null) {
        this.error.MsgLastName = "Nom au format incorrect."
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

    async formSubmit () {
      const data = {
        ...this.dataForm
      }

      const isValidFirstName = this.validFirstName()
      const isValidLastName = this.validLastName()
      const isValidEmail = this.validEmail()
      const isValidPassword = this.validPassword()

      /* Vérifie l'ensemble des champs sont remplis */
      if (!isValidFirstName || !isValidLastName || !isValidEmail || !isValidPassword) {
        alert("Une erreur est survenue! Veuillez vérifier les informations saisies.")
        return
      }

      // Envoi une requête à l'API
      try {
        const response = await fetch("http://localhost:3000/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        })

        if (response.status === 403) {
          this.error.Msg = "Adresse mail déjà utilisé !"
          return
        }

        if (response.status === 201) {
          alert("Votre compte a bien été créé, vous allez être rédirigé vers la page de connexion.")
          await router.push({path:'/login'})
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.signup{
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