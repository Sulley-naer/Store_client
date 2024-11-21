<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMyDefaultStore } from '../../stores/counter'
import BabysList from './BabysList.vue'
const store = useMyDefaultStore()

const activeMenu = ref('')

const options = ref([
  {
    label: '所有订单',
    value: 'All'
  },
  {
    label: '未付款',
    value: 'wait'
  },
  {
    label: '待发货',
    value: 'complete'
  }
])

//分页
const page = ref(1)
const total = ref(10)

watch(page, (val) => {
  page.value = val
  console.log('页数更新：' + page.value)
})
</script>

<template>
  <el-container>
    <el-header>
      <el-segmented v-model="activeMenu" :options="options" block />
    </el-header>
    <el-main>
      <div class="order-list">
        <keep-alive>
          <BabysList v-model:page="page" v-modek:total="total" v-model:activeMenu="activeMenu" />
        </keep-alive>
      </div>
    </el-main>
    <el-footer>
      <el-pagination
        background
        layout="prev, pager, next"
        hide-on-single-page
        :total="total"
        v-model:current-page="page"
        @update:current-page="console.log(111)"
        style="margin-inline: auto; margin-top: 2em; width: max-content"
      />
    </el-footer>
  </el-container>
</template>

<style scoped></style>
