<template>
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
      <button type="submit" @click.prevent="signup">S'inscrire</button>
      <p>Je possède déjà un compte ? <br>Cliquez ici: <router-link to="/login">"Se connecter"</router-link></p>
    </form>
  </div>
</template>

<script>
import router from "@/router";
import {validEmail, validPassword} from "@/common/utils";

export default {
  name: `Signup`,
  components: {},
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
    // Vérifie le format de l'email et du mot de passe
    validEmail,
    validPassword,

    // Vérifie le format du prénom
    validFirstName() {
      this.error.MsgFirstName = ""
      if (! /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})?([-]{0,1})?([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})$/.test(this.dataForm.firstName) || this.dataForm.firstName === null) {
        this.error.MsgFirstName = "Prénom au format incorrect."
        return false
      }
      return true
    },

    // Vérifie le format du nom
    validLastName() {
      this.error.MsgLastName = ""
      if (! /^([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})?([-]{0,1})?([A-Za-zàáâäçèéêëìíîïñòóôöùúûü]{3,20})$/.test(this.dataForm.lastName ) || this.dataForm.lastName === null) {
        this.error.MsgLastName = "Nom au format incorrect."
        return false
      }
      return true
    },

    // Inscription
    async signup () {
      // Récupération des informations saisies par l'utilisateur
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

        // Si l'email est déjà utilisé, affiche le message d'erreur
        if (response.status === 403) {
          this.error.MsgEmail= "Adresse mail déjà utilisé !"
          return
        }

        // Si la réponse est positive, l'utilisateur est redirigé vers la page de connexion
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
/* Formulaire d'inscription */
.signup{
  display: flex;
  justify-content: center;
  font-weight: bold;
}

.signup form{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  margin: 80px auto;
  padding: 40px 20px;
  background: #FFD7D7;
  border-radius: 20px;
  box-shadow: 0 0 35px 3px rgba(0,0,0,0.15);
}

.input-group label{
  display: flex;
  align-items: flex-start;
  margin-bottom: 5px;
}

.input-group input{
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

form button{
  width: 120px;
  height: 35px;
  background: #4E5166;
  border-radius: 10px;
  border: none;
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 15px;
  margin-top: 30px;
  cursor: pointer;
  transition: all 0.4s;
}

form button:hover{
  opacity: 0.9;
  box-shadow: 0 10px 19px -4px rgba(0,0,0,0.4);
}

form span{
  text-align: center;
  color: #FD2D01;
}

  /* Tablette Version */
  @media screen and (max-width: 992px){
    .signup form{
      width: 50%;
    }
  }

    /* Smartphone Version */
    @media screen and (max-width: 500px){
      .signup form{
        width: 80%;
      }
    }
</style>