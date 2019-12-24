<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4 mt-2 " v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm h-100 d-flex card-radius">
          <div class="img-container rounded">
            <img class="card-img-top" :src="item.imageUrl" />
          </div>
          <!-- add overlay -->
          <div class="overlay-box d-flex">
          </div>
          <div class="card-content overlay-text align-self-center mx-auto">
              <div class="card-body">
                <div class="card-title d-flex align-items-center h5">
                  <a href="#" 
                  @click.prevent="getProduct(item.id)" 
                  class="text-dark mx-auto text-overflow-center"
                  >{{ item.title }}</a>
                </div>
                <div class="d-flex justify-content-center align-items-baseline">
                  <div class="h5 " v-if="item.price">NT${{ item.price }}</div>
                </div>
              </div>
              <div class="card-btns d-flex justify-content-center p-3">
                <div>
                  <button
                    type="button"
                    class="btn btn-outline-light btn-sm"
                    @click="getProduct(item.id)"
                  >
                    <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                    查看更多
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    
    <!-- proudct-modal -->
    <ProductModal :productData="product" @emitAddToCart="addToCart" :cartData="carts" />

    <!-- Pagination -->
    <Pagination :pageData="pages" @updatePage="getProducts"/>

  </div>
</template>>

<script>
import $ from "jquery";
import Pagination from '../Pagination';
import ProductModal from './ProductModal';

export default {
  data() {
    return {
      products: [],
      product: {
        // num: 1
      },
      search: '',
      pages: {},
      pagination: {},
      searchData: {
        productCategory: 'all',
        productContent: '',
      },
      status: {
        loadingItem: ""
      },
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      isLoading: false,
      cart: {},
      carts: {},
      cartLength: 0,
      coupon_code: ""
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
      console.log(url);
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.products = response.data.products;
        console.log(response.data);
        vm.isLoading = false;
        vm.pages = response.data.pagination;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then(response => {
        vm.product = response.data.product;
        $("#productModal").modal("show");
        vm.product.num = 1; //使v-model綁定統一預設num為1
        console.log(response);
        vm.status.loadingItem = "";
      });
    },
    getCart() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      vm.$http.get(url).then((response) => {
        vm.carts = response.data.data;
        vm.cartLength = response.data.data.carts.length;
        vm.isLoading = false;
      });
    },
    addToCart(id, qty = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(url, { data: cart }).then(response => {
        console.log(response);
        vm.status.loadingItem = "";
        vm.getCart();
        $("#productModal").modal("hide");
      });
    },
  },
  components: {
    Pagination,
    ProductModal,
  },
  created() {
    this.getProducts();
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/FrontEnd/Item";

</style>