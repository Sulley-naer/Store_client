<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue', 'custom-update'])

let activeIndexes: any = ref(props.modelValue)

const menuElement = ref({
  Citys: ['全国', '北京', '上海', '广州', '深圳'],
  types: ['全部', '演出', '展览', '本地生活'],
  times: ['任意', '本周', '本月']
})
//用于处理element-plus菜单栏激活状态
activeIndexes.value = {
  Citys: 'Citys0',
  types: 'types0',
  times: 'times0'
}

onMounted(() => {
  activeIndexes.value = {
    Citys: 'Citys0',
    types: 'types0',
    times: 'times0'
  }
  emit('update:modelValue', activeIndexes.value)
})

watch(
  activeIndexes,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)
//返回选中菜单栏字符串格式
const ActiveMenu = ref({
  Citys: '全国',
  types: '全部',
  times: '任意'
})
//菜单栏更新事件
const fn = (index: number, way: string) => {
  activeIndexes.value[way] = way + index.toString()
  ActiveMenu.value[way] = menuElement.value[way][index]
  emit('custom-update', ActiveMenu)
}
</script>

<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    v-for="(items, way) in menuElement"
    :key="way"
    :default-active="activeIndexes[way]"
  >
    <el-menu-item
      v-for="(item, index) in items"
      :key="index + way"
      :index="way + index.toString()"
      @click="fn(index, way)"
    >
      {{ item }}
    </el-menu-item>
  </el-menu>
</template>

<style scoped></style>
