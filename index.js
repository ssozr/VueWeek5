const url = "https://vue3-course-api.hexschool.io";
const api_path = "ssozr";

const { createApp } = Vue;
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});


const productModal ={
    props:["id","addToCard"],
    data(){
        return {
            temProduct:{},
            modal:{},
            product:{},
            qty:1,
            
        }
    },
    template:"#userProductModal",
    methods:{
       addCart(){

       }
    },
    methods:{
        closeModal(){
            this.modal.hide()
        },
        openModal(){
            this.modal.show()
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal)
        
    },
    watch:{
        id(){
            console.log("外層傳入的Id",this.id)
            axios.get(`${url}/v2/api/${api_path}/product/${this.id}`)
            .then((res)=>{
                console.log(res.data.product)
                this.product = res.data.product
                this.modal.show()
            })
        }
    }

}

const app = createApp({
    data(){
        return{
            isLoading:false,
            products:[],
            productId:"",
            cartListData:{},
            loading:"",
            form:{
              user:{
              name:"",
              email:"",
              tel:"",
              address:""
            },
            Message:"",
            }
        }
    },
    methods:{
        getData(){
            axios.get(`${url}/v2/api/${api_path}/products/all`)
            .then((res)=>{
                this.products = res.data.products
            })
            .catch((err)=>{
            })
        },
        gerProductId(id){
            this.productId = id
            this.loading = id
            setTimeout(()=>{
                this.loading = "";
                this.$refs.productModal.openModal()

            },1000)
        },
        addToCard(product_id,qty = 1){
            const data = {
                product_id,
                qty
            }
            this.loading = product_id
            
            axios.post(`${url}/v2/api/${api_path}/cart`,{ data })
            .then((res)=>{
                console.log(res)
                alert(res.data.message)
                this.$refs.productModal.closeModal()
                this.loading=""
                this.getCartList()
            })
        },
        getCartList(){
          axios.get(`${url}/v2/api/${api_path}/cart`)
          .then((res)=>{
            this.cartListData = res.data.data
          })
        },
        uptodateCartQty(item){
            this.loading = item.id 
          const data = {
            product_id : item.product.id,
            qty : item.qty
          }
          
          axios.put(`${url}/v2/api/${api_path}/cart/${item.id}`,{data})
          .then((res)=>{
            this.loading = ""
            this.getCartList()
            
          })
        },
        deleteCartProduct(item){
          axios.delete(`${url}/v2/api/${api_path}/cart/${item.id}`)
          .then((res)=>{
            alert("刪除成功")
            this.getCartList()
          })
        },
        deleteCarts(){
          axios.delete(`${url}/v2/api/${api_path}/carts`)
          .then((res)=>{
            alert("購物車已清空")
            this.getCartList()
          })
        },
        onSubmit(){
          console.log(this.form.user,this.form.Message)
          const data = this.form
          axios.post(`${url}/v2/api/${api_path}/order`,{data})
          .then((res)=>{
            alert("訂單建立成功")
          })
        }
    },
    components:{
        productModal,
    },
    mounted(){
        this.getData()
        this.getCartList()
    }

})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
console.log(VueLoading)
app.component('loading',VueLoading.Component)
app.mount("#app")