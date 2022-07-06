<template>
  <header>
    <router-link to="/">
      <img src="../assets/logos/icon-left-font.png" alt="Logo Groupomania">
    </router-link>
    <nav>
      <router-link to="/">Accueil</router-link> |
      <router-link to="/login">Se connecter</router-link> |
      <router-link to="/signup">S'inscrire</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: `Header`,
  props: {

  }
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
  width: 30%;
  text-align: right;
}
nav a.router-link-exact-active {
  color: #FD2D01;
}

img{
  width: 300px;
  height: 50px;
  object-fit: cover;
}
</style>