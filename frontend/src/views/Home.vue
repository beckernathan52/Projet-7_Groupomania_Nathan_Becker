<template>
  <div id="homepage">
    <section id="post">
      <CreatePost></CreatePost>
    </section>
    <section id="news">
      <GetAllPosts></GetAllPosts>
    </section>
  </div>
</template>

<script>
import GetAllPosts from "@/components/Posts";
import CreatePost from "@/components/CreatePost";

export default {
  name: `Home`,
  components: {
    CreatePost,
    GetAllPosts
  },
}
</script>

<style scoped>
#post, #news{
  width: 55%;
  margin: 0 auto;
}

#news{
  margin-top: 40px;
}

  /* Tablette Version */
  @media screen and (max-width: 992px){
    #post, #news{
      width: 65%;
    }
  }

    /* Smartphone Version */
    @media screen and (max-width: 768px){
      #post, #news{
        width: 90%;
      }
    }
</style>
