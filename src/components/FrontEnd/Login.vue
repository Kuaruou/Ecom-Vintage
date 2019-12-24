<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Navbar :navItemShowJudge="'login'" />
    <div class="d-flex justify-content-center align-items-center vw-100 vh-100 bg-image">
      <form
        class="form-signin bg-light shadow rounded pt-4 pb-2"
        v-if="!isDeviceError"
        @submit.prevent="signin"
      >
        <h1 class="h3 mb-3 font-weight-normal text-center">系統登入</h1>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input
          type="email"
          id="inputEmail"
          class="form-control"
          placeholder="Email address"
          v-model="user.username"
          required
          autofocus
        />
        <label for="inputPassword" class="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          class="form-control"
          placeholder="Password"
          v-model="user.password"
          required
          autofocus
        />
        <div class="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me" /> 記住我
          </label>
        </div>
        <button class="btn btn-lg btn-info btn-block" type="submit">登入</button>
        <a class="my-3 text-center nav-link p-0 font-weight-bold" href="#"
          @click.prevent="goBack">返回首頁</a>
        <p class="mt-5 mb-3 text-muted">Rolly's Vintage&copy; 2019</p>
      </form>
    </div>
    <div v-if="isDeviceError" class="h3 text-center text-white text-bolder c-device-error p-3 rounded">
      <span>
        請使用電腦
        <br>
        操作後台!
      </span>
      <br>
      <button class="btn text-dark bg-light mt-2 font-weight-bolder" 
        @click="ogBack">確定</button>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar';

export default {
  name: "Login",
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      isLoading: false,
      isDeviceError: false,
    };
  },
  methods: {
    signin() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/admin/signin`;
      vm.isLoading = true;
      vm.$http.post(api, vm.user).then((response) => {
        if (window.screen.width < 992) {
          vm.isDeviceError = true;
          vm.isLoading = false;
          return;
        }
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/admin/edit_products");
        } else {
          vm.$bus.$emit('alert', response.data.message, 'danger');
          vm.isLoading = false;
        }
      });
    },
    goBack() {
      const vm = this;
      vm.isLoading = true;
      setTimeout( ()=> {
        vm.$router.push('home');
        vm.isLoading = false;
      }, 750);
    },
  },
  components: {
    Navbar,
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/FrontEnd/Login";
</style>