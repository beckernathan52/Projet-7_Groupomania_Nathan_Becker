<template>
  <Header></Header>
  <div id="homepage">
    <section id="post">
      <h2>Postez une publication</h2>
      <form>
        <label for="message"><i class="fa-solid fa-pen-to-square"></i>Écrivez une publication</label>
        <input id="message" type="text" placeholder="Écrivez une publication">
        <label for="file"><i class="fa-solid fa-file"></i>Ajouter une image</label>
        <input id="file" type="file">
        <div id="preview">
          <p>Aperçu de l'image</p>
          <img src="">
        </div>
        <div class="btn">
          <button>Publier</button>
        </div>
      </form>
    </section>
    <section id="news">
      <h2><i class="fa-solid fa-newspaper"></i>Actualités</h2>
      <article>
        <p>photo profil+ nom et prénom utilisateur</p>
        <p>le message</p>
        <p> image</p>
      </article>
    </section>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: `Home`,
  components: {Header}
}
</script>

<style scoped>
#homepage{
  font-weight: bold;
}

h2{
  margin-bottom: 5px;
}

i{
  margin-right: 5px;
}

#news article, input, button, form{
  border-radius: 10px;
}

#post, #news{
  width: 50%;
  margin: 0 auto;
}

#news article{
  margin-bottom: 20px;
  border: solid 2px #FFD7D7;
  padding: 20px 30px;
}

form{
  padding: 20px 30px;
  background: #FFD7D7;
}

label{
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}

input{
  width: 100%;
  margin-bottom: 25px;
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
