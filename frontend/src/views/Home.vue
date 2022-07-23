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
  width: 50%;
  margin: 0 auto;
}

#news{
  margin-top: 40px;
  border-top: solid #FD2D01 2px;

}
</style>
