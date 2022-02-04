import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js"

let productModal = null;
let delProductModal = null;

//token eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS92dWUtY291cnNlLWFwaSIsImF1ZCI6InZ1ZS1jb3Vyc2UtYXBpIiwiYXV0aF90aW1lIjoxNjQzMDE0Nzk2LCJ1c2VyX2lkIjoieU9nUk92VXU4b09HZTlqY3hRS0pKMDZYTnk0MiIsInN1YiI6InlPZ1JPdlV1OG9PR2U5amN4UUtKSjA2WE55NDIiLCJpYXQiOjE2NDMwMTQ3OTYsImV4cCI6MTY0MzQ0Njc5NiwiZW1haWwiOiJoc3VodWEuaHVhbmcuODJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImhzdWh1YS5odWFuZy44MkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.oxzpMgJvugYdoqeqHH5fB1D1HpG0kbXKd0zzMXak1GV_jkr1j9Wv4ycP0n4D8_OCCRS9Y87o0oUuxD5MbhuJ1FI0BQ2tsALmWIpRs6ITXsgRwLFJXJU8PCBohyJXc1l8OHc9pXmvKM6BJCuyyaX99Me63qjIqfNNxb0fGpMoHaUNPIMQLTnoMG0vOfTSTMunxnRyZuchnZq813Px9FVxNniwDASbitgw4OWagSsnesWp2Qt9-atl_VDSMwQsYnSnfDkCEPVN-V0EieRZavqZR14SvGtY__9CCEH6DFEK8ZtlscVOiAhS7uwwNCsBtSw2Hpc49mq1h9TkXsk3jGIt3A
const app = ({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'andy22',
      products: [],
      isNew : false,
      tempProduct: {
        imagesUrl : [],
      },
    }
  },

  mounted(){
    //將modal綁定在mounted裡
    productModal = new bootstrap.Modal(document.getElementById('productModal'),{
      keyboard : false
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'),{
      keyboard : false
    });
    // 取出 Token
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)andyToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
  axios.defaults.headers.common['Authorization'] = token;
  console.log(token);
  this.checkAdmin()
},

  methods: {
    checkAdmin() {
        //檢查是否登入成功
      const url = `${this.url}/api/user/check`;
      axios.post(url)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message)
          //cookie不存在會轉址，轉回登入頁面
          window.location = 'index.html';
        })
    },

    getData() {
        //取得產品
      const url = `${this.url}/api/${this.path}/admin/products/all`;
      axios.get(url)
        .then((res) => {
          console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },

    openModal(isNew, item){
      //用new/edit/delete來判斷modal的狀態
      if(isNew === 'new'){
        this.tempProduct = {
          imagesUrl :[],
        };
        this.isNew = true;
        productModal.show();
      }
      else if (isNew === 'edit'){
        this.tempProduct = { ...item };//必須用拷貝不然會直接複製到畫面上
        this.isNew = false;
        productModal.show();
      }
      else if (isNew === "delete"){
        this.tempProduct = {...item};
        delProductModal.show()
      }
    },

    updateProduct(){
      let url = `${this.url}/api/${this.path}/admin/product`;
      let http = 'post';
      
      if(!this.isNew){
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url,{ data: this.tempProduct})
      .then((res)=>{
        alert(res.data.message);
        productModal.hide();
        this.getData();
      })
      .catch((err)=>{
        alert(err.data.message);
      })

    },
   
    delProduct(){

      const url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
   
      axios.delete(url)
      .then((res)=>{
        alert(res.data.message);
        delProductModal.hide();
        this.getData();
      })
      .catch((err)=>{
        alert(err.data.message);
      })

    },

    createImages(){
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');

    },


  },

  

});

Vue.createApp(app).mount("#app");



