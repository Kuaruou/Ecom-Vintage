<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container">
      <nav class="navbar navbar-dark fixed-top bg-dark">
        <h4 class=" text-white font-weight-bold mb-0" href="#" @click.prevent>後臺管理系統</h4>
        <ul class="navbar-nav">
          <li class="nav-item d-flex">
            <a class="nav-link mr-4" href="#" @click.prevent="goIndex">首頁</a>
            <a class="nav-link mr-4" href="#" @click.prevent="signOut">登出</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    signOut() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/logout`;
      vm.isLoading = true;
      vm.$http.post(url).then(() => {
        vm.$bus.$emit('alert', '登出成功！', 'success');
        setTimeout(() => {
          vm.$router.push('./login');
          vm.isLoading = false;
        }, 750);
      });
    },
    goIndex() {
      setTimeout(() => {
        window.open('/');
      }, 250);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  background: #4d5139 !important;
}

</style>

