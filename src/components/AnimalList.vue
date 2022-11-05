<template>
  <div class="blank">
    <p class="header-name">Animal name</p>
    <p class="header-name" style="left: 80px; top: -5px">
      <!-- <img src="../assets/original.png" style="width: 269px" /> -->
      <img
        src="~@/assets/original.png"
        @error="$event.target.src = '/src/assets/original.png'"
        style="width: 269px"
      />
    </p>
    <div class="table">
      <div class="search">
        <input
          type="text"
          v-model="searchInput"
          placeholder="Search..."
          class="box-search"
        />

        <span class="icon">
          <img src="../assets/icon/magnify.svg" alt="" />
        </span>
      </div>
      <div class="element-name">
        <div class="result-search">
          <div v-for="item in filteredAndSorted" :key="item.englishName">
            <mouse-in>
              <article
                class="in-article-card"
                @click="goToPage(item.englishName, item._id, item.thaiName)"
              >
                {{ item.englishName }}
              </article>
            </mouse-in>
            <div class="data"></div>
          </div>
          <div
            v-if="
              this.completeImgfilter.length == 0 &&
              this.db_available_status == true
            "
            style="text-align: center"
          >
            <pre></pre>
            Loading...
          </div>
          <div
            v-if="this.db_available_status == false"
            style="text-align: center"
          >
            <pre></pre>
            database is offline
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue/dist/vue.esm";
import Router from "vue-router";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(Router);
Vue.use(VueAxios, axios);
export default {
  name: "AnimalList",
  components: {},
  props: {},
  data: () => {
    return {
      apiLink: "",
      apiCommand_GetAllAnimalName: "",
      apicommand_GetAnimal_by_id: "",
      db_available_status: true,

      searchInput: "",
      newline: "\n",
      animalList: [],
      bonefilter: [],
      completeImgfilter: [],
      templist: [],
      animalGet: [],
    };
  },
  computed: {
    //เรียงลำดับชื่อ และแสดงผล
    filteredAndSorted() {
      // function to compare names
      function compare(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }
      return this.completeImgfilter
        .filter((user) => {
          return user.englishName
            .toLowerCase()
            .includes(this.searchInput.toLowerCase());
        })
        .sort(compare);
    },
  },
  methods: {
    filter_out_animal_not_ready() {
      for (let i = 0; i < parseInt(this.animalGet.length); i++) {
        if (
          this.animalGet[i].bone == true &&
          this.animalGet[i].completeImage == true
        ) {
          this.completeImgfilter.push(this.animalGet[i]);
        }
      }
    },
    goToPage(englishName, _id, thaiName) {
      // console.log("U click");

      //Get animal from id Here! สำหรับเช็คเงื่อนไข
      let _this = this;
      _this.get(_id, englishName, thaiName);
    },
    async get(_id, englishName, thaiName) {
      // console.log(thaiName)
      // console.log(this.apiLink+this.apicommand_GetAnimal_by_id+"/"+ _id)
      var pullData = await axios
        .get(this.apiLink + this.apicommand_GetAnimal_by_id + "/" + _id, {
          timeout: 500,
        })
        .then((Response) => Response.data)
        .catch((err) => {
          if (err.code == "ECONNABORTED") {
            Promise.reject(err);
          }
          console.log("conncection error");
          this.completeImgfilter = [];
          this.db_available_status = false;
        });

      if (
        pullData.animal.completeImageLink.length > 0 &&
        pullData.data.length > 0
      ) {
        this.$router.push({
          name: "view-animal",
          params: {
            animalName: englishName,
            animalID: _id,
            thaiName: thaiName,
            animalData: pullData,
            imgLoadList: pullData.animal.completeImageLink,
            imgLength: pullData.animal.completeImageLink.length,
          },
        });
      } else {
        window.alert(englishName + " is under maintenance!");
      }
    },
  },
  async created() {
    //กำหนด apiLink และ apiCommand ตรงนี้
    // P pond DB  : http://localhost:3000/animal/get-all-animal-name
    // My DB      : http://localhost:4000/getAnimalName/

    //ลองยิง db 499 : ถ้าไม่เจอภายใน 500 ms ==>  close

    // var res = await axios
    //   .get("http://localhost:4000" + "/getAnimalName", { timeout: 500 })
    //   .then((Response) => Response)
    //   .catch((err) => {
    //     if (err.code == "ECONNABORTED") {
    //       Promise.reject(err);
    //     }
    //   });
    // if (typeof res !== "undefined") {
    //   console.log("499 db is online");
    //   this.apiLink = "http://localhost:4000";
    //   this.apiCommand_GetAllAnimalName = "/getAnimalName";
    //   this.apicommand_GetAnimal_by_id = "/getAnimalName";
    //   this.animalGet = res.data;
    //   this.filter_out_animal_not_ready();
    // } else {
    //   this.apiLink = "http://localhost:3000";
    //   this.apiCommand_GetAllAnimalName = "/animal/get-all-animal-name";
    //   this.apicommand_GetAnimal_by_id = "/animal/bone/web";
    //   axios
    //     .get(this.apiLink + this.apiCommand_GetAllAnimalName)
    //     .then((Response) => {
    //       console.log("optional db is online");
    //       this.animalGet = Response.data;
    //       this.filter_out_animal_not_ready();
    //     })
    //     .catch((err) => {
    //       if (err.code == "ECONNABORTED") {
    //         Promise.reject(err);
    //       }
    //       console.log("both db close");
    //       this.db_available_status = false;
    //       console.log(this.db_available_status);
    //     });
    // }

    // ตั้งค่า และเปิดตั้งแต่บรรทัดนี้
    this.apiLink ="http://localhost:3000"
    this.apiCommand_GetAllAnimalName="/animal/get-all-animal-name"
    this.apicommand_GetAnimal_by_id="/animal/bone/web"
    this.apiCommand_PUT_AnimalData="/animal/update-tag"
    this.apiCommand_POST_AnimalData="/animal/bone"

    axios.get(this.apiLink+this.apiCommand_GetAllAnimalName).then(Response => {
      console.log("optional db is online")
      this.animalGet = Response.data
      this.project499=false;
      this.filter_out_animal_not_ready();
    })
    .catch(err =>{
      if(err.code == 'ECONNABORTED'){Promise.reject(err)}
      this.db_available_status = false
    })
    //จนถึงบรรทัดนี้
  },
};
</script>
<style scoped>
.blank {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  display: flex;
  height: 100%;
  background-color: white;
}
.header-name {
  position: absolute;
  left: 670px;
  top: 80px;
  font-size: xx-large;
  font: bold;
}
.table {
  position: absolute;
  left: 100px;
  top: 100px;
  width: 1330px;
  height: 600px;
}
.search {
  position: absolute;
  top: 80px;
  left: 452.5px;
  width: 425px;
  height: 50px;
}
.box-search {
  border: 1px solid black;
  width: inherit;
  height: 35px;
  font-size: large;
  padding-left: 10px;
  border-radius: 5px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0.5rem 1.2rem rgb(0 0 0 / 10%);
  background-color: rgba(255, 255, 255, 0.5);
}
.search-header {
  font-size: x-large;
  right: 10px;
  position: absolute;
  font-size: xx-large;
  font: bold;
  height: 40.84px;
}
.table-header-name {
  width: auto;
  height: auto;
  position: absolute;
  top: 80px;
  font-size: x-large;
  font-weight: bold;
}
.element-name {
  position: absolute;
  font-size: x-large;
  top: 70px;
}
.result-search {
  position: absolute;
  top: 55px;
  left: 433px;
  min-width: 450px;
  height: auto;
  max-height: 100px;
  padding-top: 0.75rem;
  padding-right: 1.25rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
}
.boneCheck {
  left: 565px;
  position: absolute;
  background-color: unset;
  border: unset;
}
.imgCheck {
  left: 735px;
  position: absolute;
  background-color: unset;
  border: unset;
}
.modify {
  width: auto;
  height: auto;
  position: absolute;
  left: 1300px;
  top: 8px;
  font-size: x-large;
  font-weight: bold;
}
.in-article-card {
  padding-top: 0.75rem;
  padding-right: 1.25rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  width: 405px;
}
.box {
  background: rgb(139, 139, 139);
  border-radius: 8px;
  padding: 4rem;
  position: relative;
  width: 405px;
}
.data {
  padding-top: 10px;
}
mouse-in :hover {
  background-color: rgb(206, 206, 206);
  opacity: 0.66;
}
.icon {
  position: absolute;
  right: -8px;
  top: 8px;
}
</style>
