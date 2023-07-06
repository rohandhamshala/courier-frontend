<script setup>
import MenuBar from "./components/MenuBar.vue";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
</script>

<template>
  <v-app :style="{ background: '#F4F4F4' }">
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
  a {
    text-decoration: none;
    color: black;
  }
  .btn {
    color: white;
    background-color: '#8c43bca8';
  }
  body {
        font-family: 'Montserrat', sans-serif;
  }
  .create,.edit,.delete {
    background-color: #1877f2 ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
  }
</style>
