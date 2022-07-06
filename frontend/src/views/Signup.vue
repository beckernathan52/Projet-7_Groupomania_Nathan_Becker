<template>
  <div class="signup">
    <form>
      <h2>Inscription</h2>
      <div class="input-group">
        <label for="name">Nom</label>
        <input id="name" type="text" placeholder="Nom" v-model="dataForm.lastname" @input="validLastName">
        <p>{{errorMsgLastName}}</p>
      </div>
      <div class="input-group">
        <label for="firstname">Prénom</label>
        <input id="firstname" type="text" placeholder="Prénom" v-model="dataForm.firstname" @input="validFirstName">
        <p>{{errorMsgFirstName}}</p>
      </div>
      <div class="input-group">
        <label for="email">Email</label>
        <input id="email" type="email" placeholder="Email" v-model="dataForm.email" @input="validEmail">
        <p>{{errorMsgEmail}}</p>
      </div>
      <div class="input-group">
        <label for="password">Mot de passe</label>
        <input id="password" type="password" placeholder="Mot de passe" v-model="dataForm.password" @input="validPassword">
        <p>{{errorMsgPassword}}</p>
      </div>
      <span>{{errorMsg}}</span>
      <button type="submit" @click="formSubmit">S'inscrire</button>
      <p>Je possède déjà un compte ? <br>Cliquez ici: <router-link to="/login">"Se connecter"</router-link></p>
    </form>
  </div>
</template>

<script>
export default {
  name: `Signup`,
  data() {
    return {
      dataForm: {
        lastname: null,
        firstname: null,
        email: null,
        password: null,
      },
      errorMsg: null,
      errorMsgLastName: null,
      errorMsgFirstName: null,
      errorMsgEmail: null,
      errorMsgPassword: null,
    }
  },
  methods: {

    /* Vérifie le format de l'email */
    validEmail() {
      const data = {
        ...this.dataForm
      }
      this.errorMsgEmail = ""
      if (! /^\w+(\.-]?\w+)*@\w+([-]?\w+)*(\.\w{2,10})+$/.test(data.email) || data.email === null) {
        this.errorMsgEmail = "Email au format invalide!"
        return false
      }
      return true
    },

    validFirstName() {
      const data = {
        ...this.dataForm
      }
      this.errorMsgFirstName = ""
      /* Vérifie le format du prénom */
      if (! /^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(data.firstname) || data.firstname === null) {
        this.errorMsgFirstName = "Prénom au format incorrect."
        return false
      }
      return true
    },

    validLastName() {
      const data = {
        ...this.dataForm
      }
      this.errorMsgLastName = ""
      /* Vérifie le format du nom */
      if (! /^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(data.lastname ) || data.lastname === null) {
        this.errorMsgLastName = "Nom au format incorrect."
        return false
      }
      return true
    },

    validPassword() {
      const data = {
        ...this.dataForm
      }
      this.errorMsgPassword=""
      /* Vérifie le format du mot de passe */
      if (! /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,20})$/.test(data.password) || data.password === null) {
        this.errorMsgPassword = "Mot de passe au format invalide, il doit contenir entre 8 et 20 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial."
        return false
      }
      return true
    },

    formSubmit() {
      const data = {
        ...this.dataForm
      }

      //console.log(this.validLastName())

      /*const login = {
        email: this.dataForm.email,
        password: this.dataForm.password
      }*/

      const isValidFirstName = this.validFirstName()
      const isValidLastName = this.validLastName()
      const isValidEmail = this.validEmail()
      const isValidPassword = this.validPassword()


      /* Vérifie l'ensemble des champs sont remplis */
      if (!isValidFirstName || !isValidLastName || !isValidEmail || !isValidPassword) {
        this.errorMsg = "Une erreur est survenue! Veuillez vérifier les informations saisies."
        return
      }

      console.log(data)

      // Envoi une requête à l'API
      /*try {
        fetch("http://localhost:3000/api/users/signup", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        })
      } catch (error) {
        console.log(error)
      }*/


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
  margin-top: 20px;
}

span{
  text-align: center;
  color: #FD2D01;
}
</style>