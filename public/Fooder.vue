<template>
  <div class="container">
    <hr style="margin-botton: 0px">
    <div class="content">
      <span>&copy; Sistema de Recomendacion {{ new Date().getFullYear() }}</span>
      <div class="redessociales">
        <a href="https://github.com/EindhovenLion99/RecomendationSystem">
          <i class="fab fa-github"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style scoped>
  .container {
    margin-top: 30px !important;
    width: 90%;
    margin: auto;
  }
  .content {
    display: flex;
    justify-content: space-between;
    margin: 10px auto;
    font-size: 25px;
  }
  .redessociales a {
    margin: auto 3px;
    color: black;
  }
</style>