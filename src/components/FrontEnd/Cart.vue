<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <Navbar />
    <div class="c-wrap-bg" :class="{'d-flex align-items-center' :cartLength === 0}">
      <div class="content d-flex flex-column">
        <!-- step -->
        <ul class="list-group list-group-horizontal-lg justify-content-center my-3 mx-auto"
        v-if="cartLength !== 0">
          <li class="list-group-item text-center mx-1 py-4 rounded shadow c-step-width" 
          :class="{'bg-dark text-white c-mobile-width' :step === 1,
          'd-none d-lg-block' :step !== 1}"
          >
            <span class="font-weight-bold h4">step 1</span>
            <br />
            <span class="font-weight-bold">確認購物清單</span>
          </li>
          <li class="list-group-item text-center mx-1 py-4 rounded shadow c-step-width" 
          :class="{'bg-dark text-white c-mobile-width' :step === 2,
          'd-none d-lg-block' :step !== 2}"
          >
            <span class="font-weight-bold h4">step 2</span>
            <br />
            <span class="font-weight-bold">填寫訂購資料</span>
          </li>
          <li class="list-group-item text-center mx-1 py-4 rounded shadow c-step-width" 
          :class="{'bg-dark text-white c-mobile-width' :step === 3,
          'd-none d-lg-block' :step !== 3}"
          >
            <span class="font-weight-bold h4">step 3</span>
            <br />
            <span class="font-weight-bold">付款及完成訂單</span>
          </li>
        </ul>
        <div class="inner-content shadow p-3 pt-2 pb-3 bg-light rounded"
          :class="{'c-table-width':step === 1, 'c-form-width': step !== 1}">
          <div class="empty-alert d-flex flex-column align-items-center justify-content-center py-3 mx-auto"
            v-if="cartLength === 0" >
            <h5 class="my-5">
              您的購物車是空的!
            </h5>
            <button class="btn btn-info mb-3 empty-alert" type="button" @click="toHome">
              繼續選購
            </button>
          </div>
          <div v-else>
            <table class="table mt-5 table-responsive-lg c-mobile-text-size"
            v-if="step === 1">
              <thead>
                <th></th>
                <th>品名</th>
                <th width="20%">數量</th>
                <th class="text-center" width="15%">合計</th>
              </thead>
              <tbody>
                <tr v-for="(item, key) in carts.carts" :key="key">
                  <td class="align-middle">
                    <button type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeCartItem(item.id)">
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </td>
                  <td class="align-middle">
                    {{ item.product.title }}
                    <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                    <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                    <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right">總計</td>
                  <td class="text-right">{{ carts.total | currency }}</td>
                </tr>
                <tr v-if="carts.final_total !== carts.total">
                  <td colspan="3" class="text-right text-success">折扣價</td>
                  <td class="text-right text-success">{{ carts.final_total | currency }}</td>
                </tr>
              </tfoot>
            </table>
            <!-- customerData -->
            <form class="mx-auto" @submit.prevent="createOrder" v-if="step === 2">
              <div class="form-group mt-5">
                <label for="usermail">Email</label>
                <input type="email" class="form-control" :class="{'is-invalid': errors.has('email')}"
                name="email" id="useremail" v-model="form.user.email" placeholder="請輸入email" v-validate="'required|email'"
                >
                <span class="text-danger" v-if="errors.first('email')">
                  {{errors.first('email')}}
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
                id="useraddress" :class="{'is-invalid': errors.has('address')}"
                v-model="form.user.address" v-validate="'required'" placeholder="請輸入地址"/>
                <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
              </div>

              <div class="form-group">
                <label for="comment">留言</label>
                <textarea name id="comment" class="form-control" cols="30"
                rows="10" v-model="form.message"></textarea>
              </div>
              <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" type="button"
                @click="goPreStep"
                v-if="step === 2">返回上一步
                </button>
                <button class="btn btn-danger" v-if="step === 2">前往付款及完成訂單</button>
              </div>
            </form>
            <!-- orderlist -->
            <form class="c-mobile-text-size" 
              @submit.prevent="payOrder" v-if="step === 3">
              <table class="table mt-5">
                <thead>
                  <th>品名</th>
                  <th>數量</th>
                  <th>單價</th>
                </thead>
                <tbody>
                  <tr v-for="item in order.products" :key="item.id">
                    <td class="align-middle">{{ item.product.title }}</td>
                    <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                    <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="font-weight-bold">
                    <td colspan="2" class="text-right">總計</td>
                    <td class="text-right">{{ order.total | currency }}</td>
                  </tr>
                </tfoot>
              </table>

              <table class="table">
                <tbody>
                  <tr>
                    <th width="100">Email</th>
                    <td>{{ order.user.email }}</td>
                  </tr>
                  <tr>
                    <th>姓名</th>
                    <td>{{ order.user.name }}</td>
                  </tr>
                  <tr>
                    <th>收件人電話</th>
                    <td>{{ order.user.tel }}</td>
                  </tr>
                  <tr>
                    <th>收件人地址</th>
                    <td>{{ order.user.address }}</td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <span v-if="!order.is_paid">尚未付款</span>
                      <span v-else class="text-success">付款完成</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="text-right" v-if="order.is_paid === false">
                <button class="btn btn-danger">確認付款去</button>
              </div>
              <div class="text-right" v-else>
                <button class="btn btn-secondary"
                @click="toHome">繼續選購</button>
              </div>
            </form>
            <!-- buttons -->
            <div class="input-group mb-3 input-group-sm" v-if="step === 1">
              <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
              </div>
            </div>            
            <div class="d-flex justify-content-between">
              <button class="btn btn-secondary" type="button"
              @click="toHome" v-if=" step === 1">繼續選購</button>
              <button class="btn btn-danger"
              type="button"
              @click="goNextStep"
              v-if="step === 1">
              下一步，前往結帳
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Navbar from "./Navbar";

export default {
  data() {
    return {
      order: {
        user: {},
      },
      orderId: '',
      coupon_code: '',
      isLoading: false,
      user:{},
      email: '',
      step: 1,
      // form: {
      //   user: {
      //     name: "",
      //     email: "",
      //     tel: "",
      //     address: ""
      //   },
      // },  
      form: {
        user: {},
      },
      cartLength: 0,
      isLoading: false,
      carts: {}
    };
  },
  methods: {
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
    getOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${vm.orderId}`;
      this.$http.get(url).then((response) => {
        vm.order = response.data.order;
        console.log(response);
      });
    },
    payOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${vm.orderId}`;
      vm.$http.post(url).then((response) => {
        if (response.data.success) {
          vm.getOrder();
        }
      });
    },
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then(response => {
        vm.getCart();
        vm.isLoading = false;
        vm.$bus.$emit('alert', '刪除成功', 'danger');
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
      vm.isLoading = true;
      this.$validator.validate().then((result) =>{
        if (result) {
          this.$http.post(url, { data: order }).then((response) => {
          console.log('訂單已建立', response);
          if (response.data.success){
            vm.orderId = response.data.orderId;
            vm.getOrder();
            vm.isLoading = true;
            setTimeout(() => {
              vm.step += 1;
              vm.isLoading = false;
            }, 250);
            // vm.$router.push(`/customer_checkout/${response.data.orderId}`)
          }
      });
        } else {
          vm.$bus.$emit('alert', '欄位不完整', 'danger');
          setTimeout(() => {
            vm.isLoading = false;
          }, 250);
        }
      })
    },
    toHome() {
      const vm = this;
      vm.isLoading = true;
      setTimeout(() => {
        window.location.href = './#/home'
        vm.isLoading = false;
      }, 750);
    },
    goPreStep() {
      const vm = this;
      vm.isLoading = true;
      setTimeout(() => {
        this.step -= 1;
        vm.isLoading = false;
      }, 250);
    },
    goNextStep() {
      const vm = this;
      vm.isLoading = true;
      setTimeout(() => {
        this.step += 1;
        vm.isLoading = false;
      }, 250);
    }
  },
  components: {
    Navbar,
  },
  created() {
    this.getCart();
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/FrontEnd/Cart";

</style>