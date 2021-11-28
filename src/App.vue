<template>
  <Header />
  <Content />
  <Footer />
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Content from './components/Content.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Content
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>