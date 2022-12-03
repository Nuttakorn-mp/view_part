import Vue from "vue/dist/vue.esm";
import Router from 'vue-router';
import AnimalList from '@/components/AnimalList';
import NotFound from '@/components/NotFound';
import ViewAnimal from '@/components/ViewAnimal';

Vue.use(Router)
const routes = [
  {name:'view-animal',path:'/view-animal', component:ViewAnimal, props: true},
  {path:'/animalList', component:AnimalList, props: true},
  { path: "/view-animal/*", component: NotFound },
  {path:'*', redirect:'/animalList' ,component:AnimalList, props: true},// เด้งไปบรรทัดที่ 11
];
export default routes;  