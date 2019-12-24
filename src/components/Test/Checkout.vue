<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <!-- 訂購商品明細 -->
    <div class="my-5 row justify-content-center">
      <div class="my-5 row justify-content-center">
        <table class="table">
          <thead>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm"
                  @click="removeCartItem(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title}}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{ cart.total }}</td>
            </tr>
            <tr v-if="cart.final_total !== cart.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{ cart.final_total }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 訂單表格 -->
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="createOrder">
        <div class="form-group">
          <label for="useremail">Email</label>
          <input type="email" class="form-control" name="email" id="useremail"
            v-validate="'required|email'"
            v-model="form.user.email" placeholder="請輸入 Email"/>
          <span class="text-danger" v-if="errors.has('email')">
            {{ errors.first('email') }}
          </span>
        </div>

        <div class="form-group">
          <label for="username">收件人姓名</label>
          <input type="text" class="form-control" name="name" 
          id="username" :class="{'is-invalid': errors.has('name')}"
          v-model="form.user.name" v-validate="'required'" placeholder="輸入姓名"/>
          <span class="text-danger" v-if="errors.has('name')">必須輸入姓名</span>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <input type="tel" class="form-control" name="tel"
            id="usertel" :class="{'is-invalid': errors.has('tel')}"
            v-model="form.user.tel" v-validate="'required'" placeholder="請輸入電話"/>
            <span class="text-danger" v-if="errors.has('tel')">必須輸入電話</span>
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <input type="text" class="form-control" name="address"
            id="useraddress" v-model="form.user.address" placeholder="請輸入地址"/>
          <span class="text-danger">地址欄位不得留空</span>
        </div>

        <div class="form-group">
          <label for="comment">留言</label>
          <textarea name id="comment" class="form-control" cols="30"
            rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-right">
          <button class="btn btn-danger">送出訂單</button>
        </div>
      </form>
    </div>
  </div>
</template>>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      product: {
        // num: 1
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
      coupon_code: ""
    };
  },
  methods: {
    getCart() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then(response => {
        vm.cart = response.data.data; //多一個data抓出真正後端回傳的值
        console.log(response.data.data);
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then(response => {
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      vm.isLoading = true;
      this.$http.post(url, { data: coupon }).then(response => {
        console.log(response);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      const order = vm.form;
      // vm.isLoading = true;
      this.$validator.validate().then((result) =>{
        if (result) {
          this.$http.post(url, { data: order }).then((response) => {
          console.log('訂單已建立', response);
          if (response.data.success){
            vm.$router.push(`/customer_checkout/${response.data.orderId}`)
          }
          vm.isLoading = false;
      });
        } else {
          console.log('欄位不完整')
        }
      })
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>