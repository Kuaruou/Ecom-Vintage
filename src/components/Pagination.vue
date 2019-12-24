<template>
  <div class="justify-content-center d-flex">
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pageData.has_pre }">
          <a class="page-link" href="#" aria-label="Previous" 
          @click.prevent="updatePage(pageData.current_page -1)">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item" v-for="(page, key) in pageData.total_pages" :key="key"
        :class="{'active': pageData.current_page === page}" >
          <a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !pageData.has_next}">
          <a class="page-link" href="#" aria-label="Next" 
          @click.prevent="updatePage(pageData.current_page + 1)">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
// :pages="{頁碼資訊}"
// @emitPages="更新頁面事件"
export default {
  name: 'Layout',
  props : {
    // ["pages"]
    pageData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    updatePage(page) {
      this.$emit("updatePage", page);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/Pagination";

</style>


