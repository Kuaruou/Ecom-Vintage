<template>
  <div>
    <!-- Navbar -->
    <Navbar ref="getCart" :navItemShowJudge = "'home'" />
    <!-- Carousel -->
    <Carousel />
    <div class="bg-camo">
      <!-- Container -->
      <div class="content">
        <!-- Searchbar -->
        <form class="py-3 c-width mx-auto c-sticky-top" @submit.prevent>
          <div class="input-group">
            <div class="input-group-prepend">
              <select
                name="CategorySelector"
                id="CategorySelector"
                class="form-control rounded-left"
                v-model="searchData.productCategory"
              >
                <option value="all" selected>All</option>
                <option v-for="(item, key) in categoryFilter" :key="key" :value="item">{{item}}</option>
              </select>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Search for items, vintages and styles."
              aria-label="Text input with dropdown button"
              v-model="searchData.productContent"
              id="searchInput"
            />
            <div class="input-group-append">
              <a
                href="#"
                class="input-group-text c-text-decoration-none"
                @click.prevent="clearSearchBar"
              >&times;</a>
            </div>
          </div>
          <div class="bg-danger mt-3 text-white">
            <div class="h3 d-flex justify-content-center">Xmas: Old Gifts For Old Friends</div>
            <div class="h4 d-flex justify-content-center">Enter Code "merry1225" for 25% off discount.</div> 
          </div>
          <!-- <p class="c-hide mt-3 hot-items">
            What's hot：
            <a
              href="#"
              v-for="(product, key) in products.slice(0,4)"
              :key="key"
              @click.prevent="recommend(product)"
            >{{product.title}}&nbsp;</a>
          </p> -->
        </form>
        <!-- Items -->
        <keep-alive>
          <div class="row mt-4">
            <div
              class="col-sm-6 col-md-4 col-lg-3 mb-4 mt-2"
              
              v-for="(product, key) in productContentFilter"
              :key="key"
            >
              <div class="card border-0 h-100 d-flex card-radius">
                <div class="img-container rounded">
                  <img class="card-img-top" :src="product.imageUrl" />
                </div>
                <!-- add overlay -->
                <div class="overlay-box d-flex"></div>
                <div class="card-content overlay-text align-self-center mx-auto">
                  <div class="card-body">
                    <div class="card-title d-flex align-items-center h5">
                      <a
                        href="#"
                        @click.prevent="getProduct(product.id)"
                        class="text-dark mx-auto text-overflow-center"
                      >{{ product.title }}</a>
                    </div>
                    <div class="d-flex justify-content-center align-items-baseline">
                      <div class="h5" v-if="product.price">NT${{ product.price }}</div>
                    </div>
                  </div>
                  <div class="card-btns d-flex justify-content-center p-3">
                    <div>
                      <button
                        type="button"
                        class="btn btn-outline-light btn-sm"
                        @click="getProduct(product.id)"
                      >
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === product.id"></i>
                        查看更多
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </keep-alive>
        <!-- Pagination -->
        <Pagination :pageData="pages" @updatePage="getProducts"/>
      </div>
      <!-- proudct-modal -->
      <ProductModal :productData="product" @emitAddToCart="addToCart" :cartData="carts" />
    </div>
    <!-- footer  -->
    <footer class="bg-dark align-items-center d-flex">
      <div class="h6 mx-auto text-white m-0 align-items-center d-block bg-dark">本網站所有資料皆來自網路，僅為學術用途。</div>
    </footer>
  </div>
</template>

<script>
import $ from "jquery";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
// import Items from "./Items";
import ProductModal from "./ProductModal";
import Pagination from "../Pagination";
import Cart from "./Cart";

export default {
  data() {
    return {
      products: [],
      product: {},
      isLoading: false,
      search: "",
      pages: {},
      status: {
        loadingItem: ""
      },
      searchData: {
        productCategory: "all",
        productContent: ""
      },
      isLoading: false,
      carts: {},
      cartLength: 0,
    };
  },
  methods: {
    signout() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/logout`;
      this.$http.post(url).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/signin");
        }
      });
    },
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
    addToCart(id, qty = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      const cart = {
        product_id: id,
        qty,
      };
      vm.isLoading = true;
      vm.$http.post(url, { data: cart }).then((response) => {
        if (response.data.success) {
          vm.getCart();
          $("#productModal").modal("hide");
          vm.$bus.$emit("alert", response.data.message, "success");
          console.log(cart);
        } else {
          vm.getCart();
          $("#productModal").modal("hide");
          vm.$bus.$emit("alert", response.data.message, "danger");
        }
        //從父元件取得子元件
        vm.$refs.getCart.getCart();
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
    // recommend(keyword) {
    //   //自動填入搜尋欄
    //   const vm = this;
    //   vm.searchData.productContent = keyword.title;
    //   vm.searchData.productCategory = keyword.category;
    // },
    clearSearchBar() {
      const vm = this;
      vm.searchData.productContent = "";
      vm.searchData.productCategory = "all";
    }
  },
  components: {
    Navbar,
    Carousel,
    ProductModal,
    Pagination,
    Cart
  },
  created() {
    this.getProducts();
    this.getCart();
  },
  computed: {
    //篩選分類
    categoryFilter() {
      const vm = this;
      const cacheCategory = [];
      let filteredCategory = [];
      //過濾重複出現的類型
      vm.products.forEach(el => cacheCategory.push(el.category));
      filteredCategory = cacheCategory.filter(
        (el, id, ary) => ary.indexOf(el) === id
      );
      return filteredCategory;
      console.log(filteredCategory);
    },
    //篩選與select相同分類的產品
    productCategoryFilter() {
      const vm = this;
      //如果分類為全部，返回原來的值
      if (vm.searchData.productCategory === "all") {
        return vm.products;
      }
      //返回與option相同的分類
      return vm.products.filter(
        item => item.category === vm.searchData.productCategory
      );
      console.log(item);
    },
    //篩選符合輸入關鍵字的產品
    productContentFilter() {
      const vm = this;
      //如果input/text內有字即過濾產品
      if (vm.searchData.productContent) {
        return vm.productCategoryFilter.filter(el => {
          const title = el.title.toLowerCase().trim();
          const content = el.description.toLowerCase().trim();
          const keyword = vm.searchData.productContent;
          //同時搜尋title與content內的文字
          return (
            title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1
          );
        });
      }
      // 若輸入欄內沒有文字，就用select再判斷一次
      return vm.productCategoryFilter;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/FrontEnd/Home";
</style>