<template>
  <h2><i class="fa-solid fa-newspaper"></i>Actualités</h2>
  <article v-for="post in postStore.allPosts" :key="post.id" >
    <div class="post-infos">
      <figure>
        <img src="../assets/image_par_defaut.png">
      </figure>
      <div>
        <h3>{{post.User.firstName}} {{post.User.lastName}} </h3>
        <span>Publié le {{ post.createdAt }}</span>
      </div>
    </div>
    <div class="post-content">
      <p>Texte du post: {{post.text}}</p>
    </div>
    <div id="vote">
      <span><i class="fa-solid fa-thumbs-up"></i>J'aime</span>
      <span><i class="fa-solid fa-thumbs-down"></i>Je n'aime pas</span>
    </div>

  </article>
  <article v-if="!posts">
    <p>Il n'y a rien à afficher pour le moment.</p>
  </article>
</template>

<script>
import {useUserStore} from "@/store/user";
import {usePostStore} from "@/store/post";
import {formattingDate} from "@/common/utils";

export default {
  name: "GetAllPosts",
  setup() {
    const userStore = useUserStore()
    const postStore = usePostStore()
    return {
      userStore,
      postStore
    }
  },
  data() {
    return {
      posts : [],
    }
  },
  mounted() {
    // Affiche les posts au chargement de la page
    this.fetchPosts()
  },
  methods: {
    // Call API pour récupérer l'ensemble des Posts
    async fetchPosts() {
      const response = await fetch('http://localhost:3000/api/posts/all',{
        method: "GET",
        headers: {"Authorization": `Bearer ${this.userStore.token}`}
      })
      // Récupère le tableau des posts
      const dataPosts = await response.json()

      if (response.status === 404) {
        this.posts = null
        console.log('ici')
        return
      }
      // Modifie le format des dates de création
      dataPosts.forEach(post => {
        formattingDate(post)
      })

      // Envoi le tableau de posts au store
      this.postStore.getPosts(dataPosts)
    },
  },
}
</script>

<style scoped>
article {
  border: solid 2px #FFD7D7;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 35px 3px rgba(0,0,0,0.15);
}

h2{
  margin-bottom: 5px;
}

h3{
  color: #FD2D01;
  font-size: 17px;
  margin: 0px 0px 14px 0px;
}

i{
  margin-right: 5px;
}

.post-infos{
  border-bottom: #FFD7D7 1px solid;
  position: relative;
  padding: 14px 30px 5px 30px;
  display: flex;
}

figure{
  width: 6%;
  margin: 0px 10px 0px 0px;
}

figure img{
  width: 100%;
}

.post-infos span{
  font-size: 10px;
  font-style: italic;
  position: absolute;
  bottom: 7px;
}

article p{
  margin: 14px 30px 14px 30px;
  font-size: 14px;
}

#vote{
  border-top: #FFD7D7 1px solid;
}

#vote span {
  display: inline-block;
  width: 49%;
  text-align: center;
  font-weight: bold;
}

#vote span:nth-of-type(1){
  border-right: #FFD7D7 1px solid;;
}

#vote span i{
  margin: 8px;
}
</style>