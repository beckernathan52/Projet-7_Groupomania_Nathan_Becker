<template>
  <header>
    <router-link to="/">
      <img src="../assets/logos/icon-left-font.png" alt="Logo Groupomania">
    </router-link>
    <nav v-if="userStore.user">
      <router-link to="/login" @click="logout" class="link"><i class="fas fa-sign-out-alt"></i>Déconnexion</router-link>
    </nav>
    <nav v-else-if="!userStore.user">
      <router-link to="/login"><i class="fa-solid fa-right-to-bracket"></i>Se connecter</router-link>
      <router-link to="/signup"><i class="fa-solid fa-user-plus"></i>S'inscrire</router-link>
    </nav>
  </header>
</template>

<script>
import router from "@/router"
import {useUserStore} from "@/store/user";

export default {
  name: `Header`,
  setup() {
    const userStore = useUserStore()
    return {
      userStore
    }
  },
  methods: {
    logout() {
      this.userStore.logout()
      router.push({ path: '/login' })
      localStorage.clear()
    },
  },
}
</script>

<style scoped>
header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: solid #FD2D01 2px;
}

nav{
  width: 25%;
  text-align: right;
}

nav a {
  margin: 5px;
}

nav a.router-link-exact-active {
  color: #FD2D01;
}

nav i {
  margin-right: 5px;
}

img{
  width: 300px;
  height: 50px;
  object-fit: cover;
}

  /* Tablette Version */
  @media screen and (max-width: 992px){
    header{
      flex-direction: column;
      padding: 20px 20px 10px 20px;
      align-content: center;
    }
    header nav{
      margin-top: 20px;
      width: 100%;
      display: flex;
      justify-content: space-evenly;
    }
  }
</style>

