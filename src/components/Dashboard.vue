<template>
  <div>
    <Navbar/>
    <!-- <alert/> -->
    <div class="container-fluid">
      <div class="row">
        <Sidebar></Sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./BackEnd/Sidebar";
import Navbar from "./BackEnd/Navbar";
// import Alert from "./AlertMessage";

export default {
  components: {
    Sidebar,
    Navbar,
    // Alert
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/BackEnd/Dashboard";

</style>