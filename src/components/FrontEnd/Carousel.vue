<template>
  <div>
    <div id="banner-carousel" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#banner-carousel" data-slide-to="0" class="active"></li>
        <li data-target="#banner-carousel" data-slide-to="1"></li>
        <li data-target="#banner-carousel" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item c-carousel-01 c-carousel position-relative active">
          <h4 class="font-weight-bolder c-carousel-slogan">About Style.</h4>
          <p class="py-1 c-carousel-description">Being a mod is more of a sensibility than a style. -Martin Freeman</p>
        </div>
        <div class="carousel-item c-carousel-02 c-carousel position-relative">
          <h4 class="font-weight-bolder c-carousel-slogan">About History.</h4>
          <p class="py-1 c-carousel-description">We are not makers of history. We are made by history. -Martin Luther King, Jr.</p>
        </div>
        <div class="carousel-item c-carousel-03 c-carousel position-relative">
          <h4 class="font-weight-bolder c-carousel-slogan">About Passion.</h4>
          <p class="py-1 c-carousel-description">Love and war, it seemed, worked by the same rules. One had to hurry, before the fires flared out. -Robin Oliveira</p>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#banner-carousel"
        role="button"
        data-slide="prev"
      >
        <span class="sr-only">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#banner-carousel"
        role="button"
        data-slide="next"
      >
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/scss/FrontEnd/Carousel";

</style>
