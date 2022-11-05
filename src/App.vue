<template>
  <div id="app" class="header">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {},
};
</script>
<style scoped>
body {
  margin: 0;
}
.vue-notification{
  position: "top center";
  top: 40;
  max-width: 200px;
  font-weight: 800;
  border-left: white;
  background-color: white;
}
</style>

