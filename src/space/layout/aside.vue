<script setup lang = 'ts' >
import { computed } from 'vue'

const lang = useLang()
</script >

<template >
  <div>
    <el-affix :offset="60">
    <el-anchor :offset="70" style="width: 300px">
      <el-anchor-link :href="`#`">
        个人信息
        <template #sub-link>
          <el-anchor-link :href="`#telephone`">
            电话
          </el-anchor-link>
          <el-anchor-link :href="`#email`">
            邮箱
          </el-anchor-link>
          <el-anchor-link :href="`#birthday`">
            生日
          </el-anchor-link>
          <el-anchor-link :href="`#hobbies`">
            兴趣爱好
          </el-anchor-link>
          <el-anchor-link :href="`#income`">
            收入
          </el-anchor-link>
          <el-anchor-link :href="`#`">
            个人头像
          </el-anchor-link>
        </template>
      </el-anchor-link>
      <el-anchor-link :href="`#DeliveryAddress`">
        收货地址
      </el-anchor-link>
      <el-anchor-link :href="`#`">
        个人订单
        <template #sub-link>
          <el-anchor-link :href="`#`">
            待收货
          </el-anchor-link>
          <el-anchor-link :href="`#`">
            待付款
          </el-anchor-link>
        </template>
      </el-anchor-link>
    </el-anchor>
  </el-affix>
  </div>
</template >

<style scoped >

</style >