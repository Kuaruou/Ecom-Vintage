<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Navbar />
    <div class="d-flex justify-content-center align-items-center bg-image">
      <div class="bg-text d-flex">
        <div class="h5 container justify-content-center align-items-center position-relative p-3">
          <div class="">
            <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9 mb-4" autoplay muted 
              controls preload="auto" style="height: 100%; width: auto;">
              <source src="../../assets/images/about/about.mp4" type="video/mp4">
            </video>
          </div> 
          <!-- <img src="../../assets/images/about/owner.jpg" style="height: 20rem;" alt align="left" class="p-3 justify-content-center"/> -->
          <p>
            本店主理人Carl Fan原本從事科技業，由於父親熱愛收集各類古董家具和藝術品，
            從小就影響了他個人的美感和對於老東西的喜好。Carl高中時代便開始打工收集各國經典古著，
            一路走來到現在最喜愛英挺的英軍軍裝以及歐洲工裝。Carl於2010年開始網路自營品牌《Rolly's Vintage》，
            主打頂級歐洲古著，到2016年決定提早退休專心於古著的志業，遂在同年在台北開啟了店面，把收藏了三十年的心血都放在裡面。
          </p>
          <p>
            《Rolly's Vintage》除了讓人瞠目結舌的博物館級收藏外也有許多台灣少見但價格親民的品項，主理人希望除了在主流之外能引進更多不同風格的好商品。
            Carl相信古著除了收藏，拿來穿著才是擁有它們的意義，穿出去讓這些古著被人們看見、被喜愛才是重新賦予它們生命。
            除了販賣古著之外我們也出租最稀有的單品供廣告、電影拍攝或設計師參考使用，當然，如果您有珍稀的收藏願意割愛，也歡迎來信討論交換或者收購事宜。
          </p>
          <p>地址: 台北市中正區忠孝西路三段56號</p>
          <p>電話: 02-22445566</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";

export default {
  name: "Login",
  data() {
    return {
      isLoading: false,
      player: null
    };
  },
  methods: {
    signin() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/admin/signin`;
      vm.isLoading = true;
      vm.$http.post(api, vm.user).then(response => {
        if (window.screen.width < 992) {
          vm.isDeviceError = true;
          vm.isLoading = false;
          return;
        }
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push("/admin/edit_products");
        } else {
          vm.$bus.$emit("alert", response.data.message, "danger");
          vm.isLoading = false;
        }
      });
    },
    goBack() {
      const vm = this;
      vm.isLoading = true;
      setTimeout(() => {
        vm.$router.push("home");
        vm.isLoading = false;
      }, 750);
    }
  },
  components: {
    Navbar
  },
  mounted() {
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        console.log("onPlayerReady", this);
      }
    );
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style lang="scss" scoped>
.bg-image {
  padding: 15vh;
  min-height: 100vh;
  width: 100%;
  background: url("../../assets/images/about/about.jpg") center center / cover
    no-repeat;
  background-attachment: fixed;
  @media (max-width: 768px) {
    padding: 15vh 0;
  }
}

.bg-text {
  background: rgba(38, 69, 61, 0.9);
  color: bisque;
}

img {
  z-index: 100;
  opacity: 1;
}
</style>