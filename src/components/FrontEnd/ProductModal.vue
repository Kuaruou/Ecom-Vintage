<template>
  <div>
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ productData.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="productData.imageUrl" class="img-fluid" :alt="productData.title" />
            <blockquote class="blockquote mt-3">
              <footer class="blockquote-footer m-2 text-right">{{ productData.description }}</footer>
              <p class="mb-0">{{ productData.content }}</p>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!productData.price">{{ productData.origin_price }}元</div>
              <del class="h6" v-if="productData.price">原價{{ productData.origin_price }}元</del>
              <div class="h4" v-if="productData.price">現在只要{{ productData.price }}元</div>
            </div>
            <select name class="form-control mt-3" v-model="qty">
              <option value="0" disabled>--請選擇--</option>
              <option v-for="num in 10" :value="num" :key="num">選購 {{num}} {{productData.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ qty * productData.price }}</strong>元
            </div>
            <button
              type="button"
              class="btn btn-danger"
              @click="emitAddToCart(productData.id, qty)" 
            >加到購物車</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { type } from "os";
export default {
  data() {
    return {
      qty: 1,
    };
  },
  props: {
    productData: {
      type: Object,
      default() {
        return {};
      },
    },
    cartData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    emitAddToCart(id, num) {
      this.$emit('emitAddToCart', id, num);
    },
  },
  watch: {
    cartData() {
      this.qty = 1;
    },
  },
};
</script>