# Ecom-Vintage

### [[網站連結]](https://kuaruou.github.io/Ecom-Vintage/#/) ###
![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/cover.png)

## 簡介
<h4>本電商網站為<code>Vue.js</code>練習作品，主要的功能有:</h4>
<h4>前台</h4>
  <ul>
    <li>以卡片形式展示商品，先簡約的只呈現圖片、商品和價格，再以Modal呈現詳細介紹。</li>
    <li>設計搜尋欄和商品分類方便快速尋找所要的商品。</li>
    <li>購物車可對於購買商品進行確認及刪除，同時可套用優惠碼獲得折扣，並用VeeValidate對用戶進行表單驗證，避免資料不符格式或缺漏。</li>
    <li>管理者可以透過帳號密碼登入系統認證直接進入後台。</li>
    <li>使用video.js在網頁中嵌入影片且自動播放。</li>
  </ul>
<h4>後台</h4>
  <ul>
    <li>利用Vue Router製作SPA單頁應用減少載入負擔。</li>
    <li>商品列表可對商品進行編輯、上下架、新增刪除，管理圖片、價格、內容及是否啟用等功能。</li>
    <li>訂單列表可以檢視客戶資訊、購買項目、付款情形。</li>
    <li>優惠券列表可以編輯和新增刪除優惠券，並可編輯優惠券的名稱、折扣數、到期日及是否啟用。</li>
  </ul>

<h4>技術</h4>
<p>
  <code>Vue CLI</code>
  <code>Vue Router</code>
  <code>Bootstrap 4</code>
  <code>SCSS</code>
  <code>jQuery</code>
  <code>video.js</code>
  <code>Font Awesome</code>
  <code>VeeValidate</code>
  <code>vue-axios</code>
  <code>Evnet Bus</code>
  <code>Props & Emit</code>
</p>

## 分頁說明

<h3>前台</h3>

<h4>1. 首頁</h4>
<p>使用跑馬燈輪播形象照和標語，對消費者傳達店家理念塑造品牌形象。Navbar固定於上方，方便用戶隨時找尋不同頁面。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/cover.png)

<p>商品內容上方有search bar，可以輸入如年分或者商品名稱等關鍵字進行搜尋篩選，在搜尋欄左方有商品分類選項也可以以此搜尋同類型商品。商品以卡片式呈現，於圖片上動態覆蓋資訊品名價格等資訊，再以Modal呈現詳細內容。</p>

![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/shop.png)

<p>搜尋欄邏輯：篩選分類(將商品分類顯示於左方option中)，篩選與select相同分類的產品和篩選符合輸入關鍵字的產品。@Home.vue</p>

```html
        <form class="py-3 c-width mx-auto c-sticky-top" @submit.prevent>
          <div class="input-group">
            <div class="input-group-prepend">
              <select
                name="CategorySelector"
                id="CategorySelector"
                class="form-control rounded-left"
                v-model="searchData.productCategory"
              >
                <option value="all" selected>All</option>
                <option v-for="(item, key) in categoryFilter" :key="key" :value="item">{{item}}</option>
              </select>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Search for items, vintages and styles."
              aria-label="Text input with dropdown button"
              v-model="searchData.productContent"
              id="searchInput"
            />
            <div class="input-group-append">
              <a
                href="#"
                class="input-group-text c-text-decoration-none"
                @click.prevent="clearSearchBar"
              >&times;</a>
            </div>
          </div>
          <div class="bg-danger mt-3 text-white">
            <div class="h3 d-flex justify-content-center">Xmas: Old Gifts For Old Friends</div>
            <div class="h4 d-flex justify-content-center">Enter Code "merry1225" for 25% off discount.</div> 
          </div>
        </form>
```

```javascript
//篩選分類
    categoryFilter() {
      const vm = this;
      const cacheCategory = [];
      let filteredCategory = [];
      //過濾重複出現的類型
      vm.products.forEach(el => cacheCategory.push(el.category));
      filteredCategory = cacheCategory.filter(
        (el, id, ary) => ary.indexOf(el) === id
        //indexOf() 方法會回傳給定元素於陣列中第一個被找到之索引，若不存在於陣列中則回傳 -1。
      );
      return filteredCategory;
      console.log(filteredCategory);
    },
    //篩選與select相同分類的產品
    productCategoryFilter() {
      const vm = this;
      //如果分類為全部，返回原來的值
      if (vm.searchData.productCategory === "all") {
        return vm.products;
      }
      //返回與option相同的分類
      return vm.products.filter(
        item => item.category === vm.searchData.productCategory
      );
      console.log(item);
    },
    //篩選符合輸入關鍵字的產品
    productContentFilter() {
      const vm = this;
      //如果input/text內有字即過濾產品
      if (vm.searchData.productContent) {
        return vm.productCategoryFilter.filter(el => {
          const title = el.title.toLowerCase().trim();//將字串變成小寫後回傳且刪去前後的空格
          const content = el.description.toLowerCase().trim();
          const keyword = vm.searchData.productContent;
          //同時搜尋title與content內的文字
          return (
            title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1
          );
        });
      }
      // 若輸入欄內沒有文字，就用select再判斷一次
      return vm.productCategoryFilter;
    }
  }
```

<p>overlay在設計時圖片覆蓋上色和文字覆蓋分開變成兩層覆蓋，避免文字位置遷就覆蓋色塊而難以放置到正確的位置。另外在transition設定足夠秒數使得覆蓋效果看起來比較柔和而不突兀。@Home.scss</p>

```css
.overlay-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .5s ease;
  background-color: darkcyan;
}

.overlay-text {
  display: none;
  position: absolute;
  transition: .5s ease;
  top: 50%;
  transform: translateY(-50%);
}

.card:hover .overlay-box {
  transition: .5s ease;
  opacity: 0.9;
}

.card:hover .overlay-text {
  display: block;
  transition: .5s ease;
  opacity: 1;
}
```

<p>Modal中商品數量預設為1，可以選擇商品數量後再加入購物車。</p>

![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/modal.png)

<p>使用watch預設數量的值為1，在qty數量有變動時監聽將指定數量傳到cartData。@ProductModal.vue</p>

```javascript
watch: {
    cartData() {
      this.qty = 1;
    },
  }
```
```javascript
cartData: {
      type: Object,//指定組件的 props 驗證規則，如果傳入的數據不符合型別檢測等要求Vue會發出警告。
      default() {//無傳入資料時，使用預設值
        return {};
      },
    },
```



<h4>2. 購物車</h4>
<p>第一步：進行購物資料確認以及輸入優惠折扣碼，可刪除不想要的商品。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/cart-step1.png)

<p>第二步：輸入客戶資料，且有表單驗證功能避免缺漏或者格式不符合的情形。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/cart-step2.png)

<p>第三步：確認商品資料及客戶資料無誤再行結帳。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/cart-step3.png)

<h4>3. 登入頁面</h4>
<p>在登入時有簡易的驗證功能。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/login.png)

<h4>4. 關於店家</h4>
<p>在網頁中嵌入影片且自動播放，介紹店家和主理人的故事背景以及店面的位置及聯絡方式。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/about.png)

<h3>後台</h3>

<h4>1. 商品列表</h4>
<p>商品列表可以新增、刪除、編輯和啟用產品。</p>


![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/products.png)

<p>各項商品以Modal來進行新增及編輯。</p>

![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/product-modal.png)

<h4>2. 訂單列表</h4>
<p>呈現訂單購買的品項等基本資訊。</p>

![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/orders.png)

<h4>3. 優惠券列表</h4>
<p>呈現優惠券的各項資訊，可以新增、刪除、編輯和啟用優惠券。</p>

![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/coupons.png)

<p>各別優惠券以Modal來進行新增及編輯。</p>

![image](https://github.com/Kuaruou/Ecom-Vintage/blob/master/web-img/coupon-modal.png)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


