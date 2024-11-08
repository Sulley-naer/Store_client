<template>
  <div>
    <keep-alive>
      <Component
        :is="views"
        v-model:active="menu"
        v-model:id="id"
        @update="toggleEvent"
      ></Component>
    </keep-alive>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Shop from '@/views/Admin/Manager/Shop.vue'
import NewProduct from '@/views/Admin/Manager/NewProduct.vue'
import CustomerBaby from '@/views/Admin/Manager/CustomerBaby.vue'
import StoreOperation from '@/views/Admin/Manager/StoreOperation.vue'
import Orders from '@/views/Admin/Manager/Orders.vue'
import Details from '@/views/Admin/Manager/Details.vue'
import Orders_belong from '../Manager/Orders_belong.vue'

const menu = defineModel('active')

const views = ref()
const id = ref(0)

function toggle(val) {
  switch (val) {
    case '1':
      views.value = Details
      break
    case '1-X':
      views.value = Orders_belong
      break
    case '1-1':
      views.value = Shop
      break
    case '1-2':
      views.value = NewProduct
      break
    case '1-3':
      views.value = StoreOperation
      break
    case '1-4':
      views.value = CustomerBaby
      break
    case '1-5':
      views.value = Orders
  }
}

watch(menu, (val) => {
  menu.value = val
  console.log(val)

  toggle(val)
})
const toggleEvent = (val) => {
  id.value = val
  menu.value = id.value > 0 ? '1' : menu.value
  views.value = Shop
  toggle(menu.value)
}
</script>
