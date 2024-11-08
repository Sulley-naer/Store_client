<script setup lang="ts">
import { Menu, Message, Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'

import { useMyDefaultStore } from '@/stores/counter'

const store = useMyDefaultStore()

const isCollapse = ref(false)

const activeMenu = defineModel('active')
// 处理菜单项点击事件
const handleSelect = (index: string) => {
  activeMenu.value = index
  // console.log('当前被点击的菜单项:', index)
}
</script>

<template>
  <el-scrollbar>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">expand</el-radio-button>
      <el-radio-button :value="true">collapse</el-radio-button>
    </el-radio-group>
    <el-menu :default-openeds="['1', '3']" :collapse="isCollapse" @select="handleSelect">
      <el-sub-menu index="1">
        <template #title>
          <el-icon><message /></el-icon>后台管理
        </template>
        <el-menu-item-group v-if="store.getAdChunk == 3">
          <template #title>
            <span class="custom-title">商家</span>
          </template>
<!--          <el-menu-item index="1">商品详情</el-menu-item>-->
          <el-menu-item index="1-X">查看订单</el-menu-item>
          <el-menu-item index="1-1">商品管理</el-menu-item>
          <el-menu-item index="1-2">新增商品</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group v-if="store.getAdChunk < 3">
          <template #title>
            <span class="custom-title">客服</span>
          </template>
          <el-menu-item index="1-3">账户相关</el-menu-item>
          <el-menu-item index="1-4">商品相关</el-menu-item>
          <el-menu-item index="1-5">订单相关</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Menu /></el-icon>站点导航
        </template>
        <el-menu-item-group>
          <template #title>
            <span class="custom-title">1</span>
          </template>
          <el-menu-item index="2-1">Option 1</el-menu-item>
          <el-menu-item index="2-2">Option 2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template #title>
            <span class="custom-title">2</span>
          </template>
          <el-menu-item index="2-3">Option 3</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="2-4">
          <template #title>
            <span class="custom-title">3</span>
          </template>
          <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
      <el-sub-menu index="3" v-if="store.getAdChunk == 1">
        <template #title>
          <el-icon><setting /></el-icon>管理员系统
        </template>
        <el-menu-item-group>
          <template #title>
            <span class="custom-title" style="font-size: 14px">数据库</span>
          </template>
          <el-menu-item index="3-1">数据管理</el-menu-item>
          <el-menu-item index="3-2">服务器状态</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template #title>
            <span class="custom-title" style="font-size: 14px">服务器</span>
          </template>
          <el-menu-item index="3-3">服务器状态</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu--collapse {
  width: 150px; /* 修改折叠时的宽度 */
}

.el-menu--collapse .el-sub-menu__title,
.el-menu--collapse .el-menu-item {
  padding-left: 20px; /* 增加内边距，确保图标和文字不挤在一起 */
}

.el-menu-item-group:not(.el-menu--collapse) .el-menu-item,
.el-sub-menu:not(.el-menu--collapse) .el-sub-menu__title {
  font-size: 16px; /* 设置菜单项的字体大小 */
}

.el-menu-item-group:not(.el-menu--collapse) .el-menu-item-group__title {
  font-size: 16px; /* 设置菜单组标题的字体大小 */
}

.custom-title {
  font-size: 16px;
}
</style>
