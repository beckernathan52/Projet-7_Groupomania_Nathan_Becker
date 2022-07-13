<template>
  <header>
    <router-link to="/">
      <img src="../assets/logos/icon-left-font.png" alt="Logo Groupomania">
    </router-link>
    <nav v-if="isAuthenticated">
      <router-link to="/"><i class="fas fa-user"></i>Profil</router-link>
      <router-link to="/" @click="logout" class="link"><i class="fas fa-sign-out-alt"></i> Déconnexion</router-link>
    </nav>
    <nav v-else-if="!isAuthenticated">
      <router-link to="/login">Se connecter</router-link> |
      <router-link to="/signup">S'inscrire</router-link>
    </nav>
  </header>
</template>

<script>
import router from "@/router"

export default {
  name: `Header`,
  data() {
    return {
      isAuthenticated: this.getConnectedUser()
    }
  },
  props: {

  },
  components: {},

  methods: {
    logout() {
      router.push({ path: '/login' })
      localStorage.clear()
    },
    getConnectedUser () {
      const user = localStorage.getItem('token')
      return user
    }
  }
}

</script>

<style scoped>
header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 20px 0px;
  border-bottom: solid #FD2D01 2px;
}

nav{
  width: 30%;
  text-align: right;
}

nav a.router-link-exact-active {
  color: #FD2D01;
  margin: 5px;
}

img{
  width: 300px;
  height: 50px;
  object-fit: cover;
}
</style>

