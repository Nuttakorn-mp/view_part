<template>
  <div class="blank">
    <p class="header-name" style="left: 80px; top: -5px"> <img src= "~@/assets/original.png" @error="$event.target.src='/src/assets/original.png'" style="width: 269px" /> </p>
    <p class="animal-name">{{ this.animalName }}</p>
    <div class="main-box" id="main-box">
      <div class="click-box" id="click-box" ref="click">
        <div class="img-box">
          <img :src="imgLoad()" class="pic-size" />
        </div>
      </div>
      <div id="drawLine" class="drawLine-box" ></div>
      <button class="prev" @click="prevImg()">&#10094;</button>
      <button class="next" @click="nextImg()">&#10095;</button>
      <div class="showNumberOfImage">{{ this.indexImg + 1 }}/{{ this.imgLength }}</div>
    </div>
    <div class="descriptionBox">
      <p>Thai Name : {{ this.animaldata.animal.thaiName}}</p>
      <p class="englishName">English Name : {{this.animaldata.animal.englishName}}</p>
      <p>Scientific Name : {{this.animaldata.animal.scienceName}}</p>
      <p class="technicalTerm">Technical Term : {{this.animaldata.animal.technicalTerm}}</p>
      <p>Description : {{this.animaldata.animal.description}}</p>
    </div>
  </div>
</template>



<script>
import Vue from "vue/dist/vue.esm";
import draggable from "vuedraggable";
import Router from "vue-router";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(Router);
Vue.use(VueAxios, axios);

export default {
  name: "ViewAnimal",
  components: {},
  props: {},
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
          return user.title.toLowerCase().includes(this.search.toLowerCase());
        })
        .sort(compare);
    },
  },
  methods: {
    axis(event) {
      const x = event.x;
      const y = event.y;
      var a = document.getElementById("click-box").getBoundingClientRect();
      var scrollX =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      var scrollY =
        document.documentElement.scrollTop || document.body.scrollTop;
      //เอาค่าจากViewport(นับจากหน้าจอ)มา - position ของ element แม่มัน แล้วมาลบกับค่าเลื่อนscroll เม้าเพื่อเวลาเลื่อน แม้กด ก็จะไม่เพี้ยน
      this.$data.x = x - a.left - scrollX;
      this.$data.y = y - a.top - scrollY;
      return { x: x - a.left - scrollX, y: y - a.top - scrollY };
      
    },
    addDragBox(event, titleDefault = "drop data here") {
        var xCal = "";
        var yCal = "";
        var Q = "";
        if (this.x >= 390 && this.y <= 210) {
          //Q2
          xCal = event.x + 62;
          yCal = event.y - 50;
          Q = 2;
        }
        if (this.x < 390 && this.y <= 210) {
          //Q1
          xCal = event.x - 62 - 117 + (13 - titleDefault.length) * 8;
          xCal -=15;
          yCal = event.y - 50 - 25;
          Q = 1;
        } else if (this.x >= 390 && this.y > 210) {
          //Q3
          xCal = event.x + 60;
          yCal = event.y + 48;
          Q = 3;
        } else if (this.x < 390 && this.y > 210) {
          //Q4
          xCal = event.x - 62 - 117 + (13 - titleDefault.length) * 8;
          yCal = event.y + 50;
          Q = 4;
        }
        for (let i = 0; i < this.addList.length; i++) {
          if (document.getElementById(this.addList[i].id)!=null) {
            if(Math.abs(this.addList[i].y - event.y) < 71 && Math.abs(this.addList[i].x - event.x) < 10){ // ตรง71 คือ รัศมีรอบๆจุดที่กด
              if (this.addList[i].y> event.y) {yCal = yCal-(25);}
              else{yCal = yCal+(25);}
            }

          }
        }

        const app = new Vue({
          template: `
          <div id="${event.x}${Math.ceil(event.y)}${
            this.indexImg
          }" v-show="show" :style="dragCreate" @drop="onDrop($event);" @dragover.prevent @dragenter.prevent >
            {{this.createList[0].title}}
            <button :style="deleteIcon"></button>
          </div>
          `,
          data: {
            Q: Q,
            id: `${event.x}${Math.ceil(event.y)}${this.indexImg}`,
            axis: { x: xCal, y: yCal },
            refAxis: { x: xCal, y: yCal },
            createList: [{ id: 0, title: titleDefault }],
            dragCreate: {
              "min-width": "25px",
              "min-height": "15px",
              "background-color": "whitesmoke",
              position: "absolute",
              top: yCal + "px",
              left: xCal + "px",
              border: "2.5px solid red",
              "padding-left": "10px",
              "z-index": 3,
            },
            deleteIcon: {
              "background-color": "white",
              border: "unset",
            },
            show: true,
            function() {
              return this.createList[0].title;
            },
          },
          methods: {
            onDrop(evt) {
              const itemTitle = evt.dataTransfer.getData("itemTitle");
              this.createList[0] = { title: itemTitle };

              if (this.Q == 1 || this.Q == 4) {
                var yNew = (13 - this.createList[0].title.length) * 8;
                if (this.createList[0].title.length > 13) {
                  yNew = yNew + (this.createList[0].title.length - 13) * 5;
                }
                this.axis.x = yNew + this.refAxis.x;
                this.dragCreate.left = String(yNew + this.refAxis.x) + "px";
              }
              app.$mount();
            },
          },
          components: { draggable },
        });
        const stat = document.getElementById('click-box');
        let vueContainer = document.createElement("span");
        stat.appendChild(vueContainer);
        app.$mount(vueContainer);

        /**************************************************************************/
        this.addList.push({
          id: `${event.x}${Math.ceil(event.y)}${this.indexImg}`,
          x: event.x,
          y: event.y,
          name: titleDefault,
          pic: this.indexImg,
        });
        /**************************************************************************/

        let _this = this;
        _this.drawLine(xCal,yCal);
      // } //END IF CHECK DUP ID
    },
    imgLoad() {
      return this.imgLoadList[this.$data.indexImg];
    },
    nextImg() {
      this.$data.indexImg = (this.$data.indexImg + 1) % this.imgLength;
      if(this.animalName =="Arapaima"){
        this.millisecond = 100;
      }
      else{
        this.millisecond = 0;
      }
      
      setTimeout(() => {

      for (let i = 0; i < this.addList.length; i++) {
        //hide ก่อนแล้วค่อยเปลี่ยนรูป this.addList[i].pic == this.indexImg &&
        if (
          this.addList[i].pic == this.indexImg &&
          document.getElementById(this.addList[i].id) != null
        ) {
          document.getElementById(this.addList[i].id).__vue__.show = true;
          document.getElementById(this.addList[i].id + "L").__vue__.show = true;
        } else if (
          this.addList[i].pic != this.indexImg &&
          document.getElementById(this.addList[i].id) != null
        ) {
          document.getElementById(this.addList[i].id).__vue__.show = false;
          document.getElementById(
            this.addList[i].id + "L"
          ).__vue__.show = false;
        }
      }

      }, this.millisecond);
    },
    prevImg() {
      if (this.$data.indexImg == 0) {
        this.$data.indexImg = this.$data.indexImg + (this.imgLength - 1);
      } else {
        this.$data.indexImg = this.$data.indexImg - 1;
      }
      if(this.animalName =="Arapaima"){
        this.millisecond = 100;
      }
      else{
        this.millisecond = 0;
      }
      
      setTimeout(() => {

      for (let i = 0; i < this.addList.length; i++) {
        if (
          this.addList[i].pic == this.indexImg &&
          document.getElementById(this.addList[i].id) != null
        ) {
          document.getElementById(this.addList[i].id).__vue__.show = true;
          document.getElementById(this.addList[i].id + "L").__vue__.show = true;
        } else if (
          this.addList[i].pic != this.indexImg &&
          document.getElementById(this.addList[i].id) != null
        ) {
          document.getElementById(this.addList[i].id).__vue__.show = false;
          document.getElementById(
            this.addList[i].id + "L"
          ).__vue__.show = false;
        }
      }


      }, this.millisecond);

    },
    drawLine(xCal,yCal) {
      var testsum = Math.pow(62, 2) + Math.pow(50, 2);
      var deg = "";
      var xDragto = "";
      var yDragto = "";
      var xDistance="";
      var yDistance="";

      if (this.x >= 390 && this.y <= 210) {
        //Q2
        deg = (Math.atan2(Math.abs(this.y-yCal),Math.abs(this.x-xCal) ) *180 / Math.PI);
        if (yCal<this.y) { deg = deg*(-1);}
        xDragto = xCal;
        yDragto = yCal;
        testsum = Math.pow(Math.abs(this.x-xCal),2)   +  Math.pow(Math.abs(this.y-yCal),2);
        
      } else if (this.x < 390 && this.y <= 210) {
        //Q1
        xDistance =Math.abs(this.x-(xCal+5+document.getElementById(`${this.x}${Math.ceil(this.y)}${this.indexImg}`).__vue__._data.createList[0].title.length*8.5));
        yDistance =Math.abs(this.y-(yCal+25) );
        deg = (Math.atan2(yDistance,xDistance)*180/Math.PI)+180;
        if (yCal>=this.y) {deg = 180-(Math.atan2(yDistance,xDistance)*180/Math.PI);}
        testsum = (Math.pow(xDistance,2)   +  Math.pow(yDistance,2));
        xDragto = xCal;
        yDragto= yCal;
      } else if (this.x >= 390 && this.y > 210) {
        //Q3
        deg = Math.atan2(Math.abs(this.y-yCal),Math.abs(this.x-xCal) ) *180 / Math.PI;
        xDragto = xCal;
        yDragto = yCal;
        testsum = Math.pow(Math.abs(this.x-xCal),2)   +  Math.pow(Math.abs(this.y-yCal),2);
        
      } else if (this.x < 390 && this.y > 210) {
        //Q4
        xDistance =Math.abs(this.x-(xCal+5+document.getElementById(`${this.x}${Math.ceil(this.y)}${this.indexImg}`).__vue__._data.createList[0].title.length*8.5));
        yDistance =Math.abs(this.y-yCal );
        deg= (180-Math.atan2(yDistance,xDistance)*180/Math.PI);
        if (yCal<=this.y) {deg = 180+(Math.atan2(yDistance,xDistance)*180/Math.PI);}
        testsum = (Math.pow(xDistance,2)   +  Math.pow(yDistance,2));
        xDragto = xCal;
        yDragto = yCal;
      }

      const app = new Vue({
        template: `
        <div id=${this.x}${Math.ceil(this.y)}${
          this.indexImg
        }L v-show="show" :style="drawLine">
        </div>
        `,
        data: {
          to: { x: xDragto, y: yDragto },
          start: { x: this.x, y: this.y },
          drawLine: {
            position: "absolute",
            "min-width": "25px",
            width: Math.sqrt(testsum) + "px",
            "border-top": "1px solid red",
            transform: `rotate(${deg}deg)`,
            "transform-origin": "0% 0%",
            top: this.y + "px",
            left: this.x + "px",
            "z-index": 3,
          },
          show: true,
        },
      });
      const stat = document.getElementById("drawLine");
      let vueContainer = document.createElement("div");
      stat.appendChild(vueContainer);
      app.$mount(vueContainer);
    },
    loadTag() {
      //First time load tag
      let _this = this;
      this.x = 0;
      this.y = 0;

      for (let i = 0; i < this.dataGet[0].data.length; i++) {
        //วนตาม จน รูป
        for (let j = 0; j < this.dataGet[0].data[i].coordinator.length; j++) {
          //วนตาม จน tag
          this.firstPut.push({
            pic: this.dataGet[0].animal.completeImagePath.indexOf(this.dataGet[0].data[i].imageName),
            id:
              `${this.dataGet[0].data[i].coordinator[j].lineStartX}${Math.ceil(this.dataGet[0].data[i].coordinator[j].lineStartY)}${this.dataGet[0].animal.completeImagePath.indexOf(this.dataGet[0].data[i].imageName)}`,
            title: this.dataGet[0].data[i].coordinator[j].title,
            positionX: this.dataGet[0].data[i].coordinator[j].positionX,
            positionY: this.dataGet[0].data[i].coordinator[j].positionY,
            lineStartX: this.dataGet[0].data[i].coordinator[j].lineStartX,
            lineStartY: this.dataGet[0].data[i].coordinator[j].lineStartY,
            lineToX: this.dataGet[0].data[i].coordinator[j].lineToX,
            lineToY: this.dataGet[0].data[i].coordinator[j].lineToY,
          });
        }
      }
      for (let k = 0; k < this.firstPut.length; k++) {
        var load = {
          x: this.firstPut[k].lineStartX,
          y: this.firstPut[k].lineStartY,
        };
        this.x = load.x;
        this.y = load.y;
        if (this.firstPut[k].pic > 0) {
          this.indexImg = this.firstPut[k].pic;
          _this.addDragBox(load, this.firstPut[k].title);
          document.getElementById(this.firstPut[k].id).__vue__.show = false;
          document.getElementById(
            this.addList[k].id + "L"
          ).__vue__.show = false;
          this.indexImg = 0;
          
        } else {
          _this.addDragBox(load, this.firstPut[k].title);
        }
      }
    },
    initData() {
      let _this = this;
      this.dataGet[0] = this.animaldata;

      setTimeout(()=>_this.loadTag(),200);
    },
  },
  created() {
    //ถ้า F5 แล้ว propที่ส่งมาจากหน้าแรกจะหาย ==> ส่งกลับหน้าแรก
    if(typeof this.$route.params.animalName == 'undefined'){this.$router.replace("/animalList");}
    this.dataGet=[];
    this.thaiName = this.$route.params.thaiName;
    this.animalName = this.$route.params.animalName;
    this.id = this.$route.params.animalID;
    this.animaldata = this.$route.params.animalData;
    this.imgLoadList = this.$route.params.imgLoadList;
    this.imgLength = this.$route.params.imgLength;
    this.initData();
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
