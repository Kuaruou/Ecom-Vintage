<template>
  <div>
    <nav id="navbar" class="navbar navbar-expand-lg transparent fixed-top">
      <div class="nav-item">
        <a
          class="nav-link c-nav-link text-white h2 font-weight-bolder rounded mb-0"
          href="#"
          @click.prevent="toPage('home')"
        >Rolly's Vintage</a>
      </div>
      <!-- 漢堡選單 -->
      <button
        class="navbar-toggler h3"
        type="button"
        data-toggle="collapse"
        data-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fas fa-bars text-white"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ml-auto mr-4">
          <li class="nav-item ml-3 py-2" v-if="navItemShowJudge !== 'home'">
            <a
              class="nav-link c-nav-link text-white h6 rounded mb-0"
              href="#"
              @click.prevent="toPage('shop')"
            >
              <i class="fas fa-shopping-cart"></i>
              <span class="font-weight-bold">&nbsp;Shop</span>
            </a>
          </li>
          <li class="nav-item ml-3 py-2" v-if="navItemShowJudge !== 'about'">
            <a
              class="nav-link c-nav-link text-white h6 rounded mb-0"
              href="#"
              @click.prevent="toPage('about')"
            >
              <i class="fas fa-info-circle"></i>
              <span class="font-weight-bold">&nbsp;About</span>
            </a>
          </li>
          <li class="nav-item ml-3 py-2" v-if="navItemShowJudge !== 'checkout'">
            <a
              class="nav-link c-nav-link text-white h6 rounded mb-0"
              href="#"
              @click.prevent="toPage('checkout')"
            >
              <div>
                <i class="fas fa-shopping-bag"></i>
                <span class="font-weight-bold">&nbsp;Checkout</span>
                <!-- <div
                  class="bg-danger rounded-circle text-white c-cart-qty d-inline-block text-center ml-1"
                  v-if="cartLength >= 1"
                  >{{cartLength}}
                </div> -->
              </div>
            </a>
          </li>
          <li class="nav-item ml-3 py-2" v-if="navItemShowJudge !== 'login'">
              <a
                class="nav-link c-nav-link text-white h6 rounded mb-0"
                href="#"
                tabindex="-1"
                aria-disabled="true"
                @click.prevent="toPage('login')"
              >
                <i class="fas fa-cog"></i>
                <span class="font-weight-bold">&nbsp;Login</span>
              </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "Navbar",
  props: {
    navItemShowJudge: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      carts: {},
      cartLength: 0,
      isLoading: false,
    };
  },
  methods: {
    toPage(el) {
      const vm = this;
      let location = "";
      if (el === "home") {
        location = "/";
      } else if (el === "shop") {
        location = "/";
        // window.scrollTo({top:window.innerHeight, behavior: 'smooth'}); 
      } else if (el === "checkout") {
        location = '/cart';
      } else if (el === "about") {
        location = '/about';  
      } else {
        location = "/login";
      }
      vm.isLoading = true;
      setTimeout(() => {
        vm.$router.push(location).catch(err => {});
        vm.isLoading = false;
      }, 750);
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
    signout() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/logout`;
      this.$http.post(url).then(response => {
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/login");
        }
      });
    }
  },
  created() {
    $(window).scroll(() => {
      if ($(document).scrollTop() > 50) {
        $("#navbar").removeClass("transparent");
        $("#navbar").addClass("bg-dark");
      } else {
        $("#navbar").addClass("transparent");
        $("#navbar").removeClass("bg-dark");
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/FrontEnd/Navbar";

</style>