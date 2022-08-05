<template>
  <Header></Header>
  <router-view/>
</template>

<script>
import Header from "@/components/Header";

export default {
  components: {Header}
}

</script>

<style>
#app {
  font-family: 'Lato', sans-serif;
  color: #4E5166;
}
body{
  max-width: 1200px;
  margin: 0 auto;

}
a{
  text-decoration: none;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
}
</style>