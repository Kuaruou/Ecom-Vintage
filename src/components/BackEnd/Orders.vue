<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="150">購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th width="150">應付金額</th>
          <th width="100">是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in sortOrder" :key="key"
           :class="{'text-secondary': !item.is_paid}">
          <td>{{ item.create_at | date }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量 {{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td>
            <strong v-if="item.is_paid" class="text-success">已付款</strong>
            <span v-else class="text-muted">尚未啟用</span>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :pages="pagination" @emitPages="getOrders"></Pagination>
  </div>
</template>

<script>
import Pagination from "../Pagination";
import { truncate } from 'fs';

export default {
  data() {
    return {
      orders: {},
      isNew: false,
      isLoading: false,
      pagination: {},
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getOrders(currentPage = 1) {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${currentPage}`; //'https://vue-course-api.hexschool.io/api/pomme/products';
      vm.isLoading = true;
      this.$http.get(url, vm.tempProduct).then((response) => {
        console.log(response.data);
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    },
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.orders.length) {
        newOrder = vm.orders.sort((a,b) =>{
          const aIsPaid = a.is_paid ?1 : 0;
          const bIsPaid = b.is_paid ?1 : 0;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    }
  },
  created() {
    this.getOrders();
    console.log(process.env.VUE_APP_APIPATH)
  }
};
</script>

