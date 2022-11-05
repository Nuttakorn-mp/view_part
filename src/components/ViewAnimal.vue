<template>
  <div>
  <div>Hi 123456789</div>
  <div class="header-name">Animal name : {{this.animalName}}</div>
  </div>
</template>



<script>
import Vue from "vue/dist/vue.esm";
// import Vue from "vue/dist/vue.js";
import Router from "vue-router";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(Router);
Vue.use(VueAxios, axios);

export default {
  name: "ViewAnimal",
  components: {},
  props: {},
  methods: {},
  data: () => {
    return {
      id: null,
      firstPut: [],
      dataGet: [],
      animaldata: [],
      imgLoadList: [],
      imgLength: null,
      animalName:'',
      thaiName:'',
      englishName:'',
      scienceName:'',
      technicalTerm:'',
      des:'',
      dup: [],
      description: [{ descriptionMain: "" }],
      show: true,
      x: 100,
      y: 200,
      height: 100,
      addList: [],
      createList: [],
      indexImg: 0,
      element:'',
      millisecond:0,
    };
  },
  computed: {
    filteredAndSorted() {
      // function to compare names
      function compare(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }

      return this.createList
        .filter((user) => {
          /* console.log(user.name.toLowerCase().includes(this.search.toLowerCase())); */
          // console.log(user.name.toLowerCase())
          // console.log(this.search.toLowerCase())
          return user.title.toLowerCase().includes(this.search.toLowerCase());
        })
        .sort(compare);
    },
  },
  created() {
    //ถ้า F5 แล้ว propที่ส่งมาจากหน้าแรกจะหาย ==> ส่งกลับหน้าแรก
    if(typeof this.$route.params.animalName == 'undefined'){this.$router.replace("/Views");}


    // console.log("---------------- create --------------")
    this.dataGet=[];
    this.thaiName = this.$route.params.thaiName;
    this.animalName = this.$route.params.animalName;
    this.id = this.$route.params.animalID;

    this.animaldata = this.$route.params.animalData;
    this.imgLoadList = this.$route.params.imgLoadList;
    this.imgLength = this.$route.params.imgLength;
    // this.initData();

  },
};
</script>


<style module>
.baz {
  color: red;
  width: 100px;
  height: 100px;
  background-color: whitesmoke;
  border: 1px solid black;
  position: relative;
  left: 100px;
  top: 200px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auto {
  position: relative;
  top: 50px;
  left: 50px;
  width: 600px;
  height: 400px;
  border: 1px solid red;
}
.blank {
  width: 100%;
  height: 700px;
  background-color: white;
}
.click-box {
  position: absolute;
  top: 35px;
  left: 75px;
  width: 800px;
  height: 450px;
  background-color: black;
  border: 1px solid blue;
}
.main-box {
  position: absolute;
  left: 270px;
  top: 106px;
  width: 950px;
  height: 520px;
}
.img-box {
  position: absolute;
  top: 25px;
  left: 100px;
  align-self: center;
  width: 600px;
  height: 400px;
}
.pic-size {
  height: inherit;
  margin: auto;
  display: block;
}
.header-name {
  position: absolute;
  left: 670px;
  top: 0px;
  font-size: xx-large;
  font: bold;
}
.prev {
  position: absolute;
  top: 220px;
  font-size: 50px;
  border: 0px;
  background-color: unset;
}
.next {
  position: absolute;
  top: 220px;
  right: 0px;
  font-size: 50px;
  border: 0px;
  background-color: unset;
}
.animal-name {
  position: relative;
  left: -20px;
  text-align: center;
  font-size: xx-large;
  font: bold;
  color: black;
  z-index: 2;
}
.showNumberOfImage {
  position: absolute;
  top: 500px;
  left: 450px;
  font-size: x-large;
}
.drawLine-box {
  position: absolute;
  top: 35px;
  left: 75px;
  width: 800px;
  height: 450px;
  background-color: unset;
  border: 1px solid blue;
  z-index: 2;
}
.drawLine {
  position: absolute;
  border-top: 1px solid red;
  width: 40px;
  transform: rotate(45deg);
  transform-origin: 0% 0%;
  top: 494px;
  left: 133px;
}
.descriptionBox {
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  width: 910px;
  position: absolute;
  top: 640px;
  left: 280px;
  border: 1.5px solid black;
  text-align-last: left;
  font-size: 20px;
  border-radius: 10px;
}
.englishName{
  position: absolute;
  left: 450px;
  top: 8px;
}
.technicalTerm{
  position: absolute;
  left: 450px;
  top: 50px;
}
</style>
