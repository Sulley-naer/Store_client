import { defineStore } from 'pinia'
//本地存储
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

export const useMyDefaultStore = defineStore({
  id: 'myDefaultStore',
  state: () => ({
    //本地存储
    user: useStorage('user', ''),
    pwd: useStorage('pwd', ''),
    Id: useStorage('Id', ''),
    Actives: useStorage('Active', -1),
    Admin: useStorage('Admin', ''),
    AdChunk: useStorage('AdminPwd', 0),
    Order:useStorage('order',ref({}))
  }),
  getters: {
    getUsername: (state) => state.user,
    getPwd: (state) => state.pwd,
    getId: (state) => state.Id,
    getActives: (state) => state.Actives,
    getAdmin: (state) => state.Admin,
    getAdChunk: (state) => state.AdChunk,
    getOrder: (state) => state.Order,
  },
  actions: {
    setUsername(newUsername: any) {
      this.user = newUsername
    },
    setPwd(newPwd: any) {
      this.pwd = newPwd
    },
    setId(NewId: any) {
      this.Id = NewId
    },
    setActives(newActives: any) {
      this.Actives = newActives
    },
    setAdmin(newAdmin: any) {
      this.Admin = newAdmin
    },
    setAdChunk(newPwd: number) {
      this.AdChunk = newPwd as number
    },
    setOrder(newOrder:any ) {
      this.Order = newOrder
    },
    async fetchUsername() {
      // 异步获取数据的示例方法
      // const response = await fetch('/api/username')
      // this.username = await response.json()
    }
  }
})
