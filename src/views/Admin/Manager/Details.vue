<!-- eslint-disable vue/valid-v-for -->
<script setup lang="ts">
import { onActivated, onDeactivated, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { Controller, FreeMode, Mousewheel, Pagination, Scrollbar } from 'swiper/modules'
import { Delete, Shop, UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'
import { useMyDefaultStore } from '@/stores/counter'
const store = useMyDefaultStore()
import axios from 'axios'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import { ElMessage } from 'element-plus'

//图床
const servers = import.meta.env

const photoPath = ref(servers.VITE_photo_path)

console.log('图片地址', photoPath.value)

//商品ID
const id = defineModel('id')

console.log('当前商品: ' + id.value)

const firstSwiper = ref(null)
const secondSwiper = ref(null)

//获取swiper实例
const setFirstSwiper = (swiper) => {
  firstSwiper.value = swiper
}
const setSecondSwiper = (swiper) => {
  secondSwiper.value = swiper
}

// 点击切换事件
const handleSlideClick = (index) => {
  if (firstSwiper.value) {
    firstSwiper.value.slideTo(index)
  }
}

//商品信息
const type = ref('')
const defaultPrice = ref(0)
const price = ref(0)
const total = ref(0)

watch(type, (val) => {
  type.value = val
  if (typeof type.value == "number") {
    price.value = Data.value.res[val].price
    total.value = Data.value.res[val].total
  } else {
    price.value = Data.value.defaultPrice
    total.value = Data.value.defaultTotal
  }
  console.log(type.value)
})

//菜单相关
const toggleMenu = (index) => {
  activeMenu.value = index
}

const menuItem = [
  { key: 1, value: '商品信息' },
  { key: 2, value: '店家留言' },
  { key: 3, value: '推荐商品' }
]
const activeMenu = ref(0)

//获取数据
const Data = ref({})

const Getdate = () => {
  newType.value = ''
  photoList.value = []
  axios
    .post('/GetDetail', {
      id: id.value
    })
    .then((res) => {
      console.log(res.data)
      ElMessage.success("加载完成")
      Data.value = res.data
      defaultPrice.value = Data.value.defaultPrice
      price.value = Data.value.defaultPrice
      total.value = Data.value.defaultTotal
      res.data.res.forEach((item) => {
        console.log(item.banner)
        photoList.value = photoList.value.concat(item.banner)
      })
    })
    .catch((err) => {
      ElMessage.error(err.response.data.Message)
    })
}

//展示图

const shows = ref([])

onActivated(() => {
  Getdate()
})

//修改

//?图片上传
const fileList = ref();
const submitUpload = async () => {
  const form = new FormData();

  // 添加文件到表单
  fileList.value?.forEach(file => {
    form.append("file", file.raw); // raw 是文件对象
  });

  form.append("type", typeof type.value=="number" ? Data.value.res[type.value].type : '');
  form.append("position","banner")
  form.append("belong",store.getAdmin)
  form.append("Baby",id.value)

  try {
    const response = await axios.post("/DetailsPhoto", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data)
    response.data?
    ElMessage({
      message: "上传成功",
      type: "success",
      plain: true,
    }):
      ElMessage({
        message: "上传失败",
        type: "error",
        plain: true,
      });
  } catch (error) {}
  Getdate()
};

const DelPhoto = (photo : string,key: number)=>{
  const temp = ref([])
  axios.post("DeletePhoto",{
    Photo:photo
  }).then(res=>{
    ElMessage({
      message: res.data?"移除成功":"移除失败",
      type: "info",
    })
    if (res.data) {
      Getdate()
    }
  })
}

watch(Data, (val) => {
  Data.value = val
  console.log(val)
})
const PriceChange = (val: number) => {
  if (typeof type.value == "number") {
    Data.value.res[type.value].price = val
  } else {
    Data.value.defaultPrice = val
  }
}
const totalChange = (val: number) => {
  if (typeof type.value == "number") {
    Data.value.res[type.value].total = val
  } else {
    Data.value.defaultTotal = val
  }
}

//提交修改
const merchantUpdate = ()=>{
  console.log(Data.value)
  axios.post("/merchantInfo",{
    brand:Data.value.brand,
    name:Data.value.title,
    dress:Data.value.address,
    message:Data.value.message,
    belongs:store.getAdmin,
    id:Data.value.key,
  }).then(res=>{
    console.log(res.data)
    res.data?
    ElMessage({
      message: '修改成功',
      type: 'success',
      plain: true
    }):ElMessage({
        message: '无修改请勿点击',
        type: 'error',
        plain: true
      })
  })
}

const save = ()=>{
  submitUpload()
  addType()

  if (typeof type.value == "number") {
    let type = [];
    let price = []
    let total = []

    Data.value.res.forEach((item) => {
      type.push(item.type)
      price.push(item.price)
      total.push(item.total)

      type = [...new Set(type)]
      price = [...new Set(price)]
      total = [...new Set(total)]
    })

    axios.post("/UpdateDetail",{
      id:Data.value.key,
      belongs:store.getAdmin,
      prices:price,
      totals:total,
      types:type,
      defaultPrice:Data.value.defaultPrice,
      defaultTotal:Data.value.defaultTotal,
    }).then(res=>{
      console.log(res.data)
      res.data?
        ElMessage({
          message: '修改成功',
          type: 'success',
          plain: true
        }):ElMessage({
          message: '无修改请勿点击',
          type: 'error',
          plain: true
        })
    })
  } else {
    axios.post("/UpdateDetail",{
      id:Data.value.key,
      belongs:store.getAdmin,
      defaultPrice:Data.value.defaultPrice,
      defaultTotal:Data.value.defaultTotal,
    }).then(res=>{
      console.log(res.data)
      res.data?
        ElMessage({
          message: '修改成功',
          type: 'success',
          plain: true
        }):ElMessage({
          message: '无修改请勿点击',
          type: 'error',
          plain: true
        })
    })
  }
}

//新增款式

const newType = ref('')

const addType = async ()=>{
  if (newType.value!=''){
    axios.post("/addType",{
      id:id.value,
      type:newType.value,
      belongs:store.getAdmin,
    }).then(res=>{
      console.log(res.data)
      ElMessage({
        message: '添加款式成功',
        type: 'success',
        plain: true
      })
      Getdate()
    })
  }
}

//删除款式
const DelType = (type)=>{
  axios.post("/DeleteType",{
    Baby:id.value,
    Types:type,
    belong:store.getAdmin,
  }).then(res=>{
    console.log(res.data)
    ElMessage({
      message: '删除款式成功',
      type: 'success',
      plain: true
    })
    Getdate()
  })
}
//切换商品

const photoList = ref([])

onDeactivated(() => {
  photoList.value = []
  newType.value='';
})

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-main class="el-main">
        <el-scrollbar height="80vh">
          <h1 style="text-align: center; margin-bottom: 1em">
            <el-text style="font-size: 22px; font-weight: 340; max-width: 15em" truncated>
              <el-input v-model="Data.title" input-style='text-align:center' size='large'></el-input>
            </el-text>

          </h1>

          <div style="user-select: none">
            <Swiper
              @swiper="setFirstSwiper"
              :controller="{ control: secondSwiper }"
              :scrollbar="{ hide: true }"
              :mousewheel="false"
              :modules="[Pagination, Scrollbar, FreeMode, Mousewheel, Controller]"
              class="banner"
            >
              <el-empty description="description" v-if="photoList.length == 0" />
              <SwiperSlide
                class="swiper-slide"
                v-else
                v-for="(path, key) in photoList"
                :ID="key"
              >
                <img :src='photoPath + path' width='100%' height='475px' />
              </SwiperSlide>
            </Swiper>

            <Swiper
              @swiper="setSecondSwiper"
              watch-slides-progress
              :spaceBetween="10"
              :slidesPerView="4"
              :freemode="true"
              :modules="[Pagination, Scrollbar, FreeMode, Mousewheel, Controller]"
              style="margin-top: 2em"
            >
                <el-empty description="description" v-if="photoList.length == 0" />
                <SwiperSlide
                  v-for="(path, key) in photoList"
                  :ID="key"
                  style="height: 150px; min-height: unset;display: flex;align-items: center;width: 25%;align-items: flex-end;"
                  v-else >
                  <div>
                    <img :src='photoPath + path' width='100%' @click="handleSlideClick(key)">
                    <el-button
                      circle
                      style="position: absolute; right: 0; top: 0"
                      size="small"
                      type="danger"
                      :icon="Delete"
                      @click='DelPhoto(path,key)'
                    />
                  </div>
                </SwiperSlide>
            </Swiper>

            <div>
              <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                action="/api/DetailsPhoto"
                :auto-upload="false"
                list-type="picture"
                multiple
                drag
              >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                  <template #tip>
                    <div class="el-upload__tip" style='text-align: center'>jpg/png files with a size less than 3000kb</div>
                  </template>
                </el-upload>
            </div>
          </div>

          <div class="Ifm">
            <div>
              <el-card
                shadow="Hover"
                style="width: 18em"
                body-style="padding-block:0.5em;padding-inline: 0.9em;"
              >
                <el-text>价格：</el-text>
                <el-text type="danger">￥ </el-text>
                <el-input-number
                  type="danger"
                  style="font-size: 21px"
                  v-model="price"
                  controls-position="right"
                  :min="1"
                  :step="10"
                  @change="PriceChange"
                />
              </el-card>
            </div>
            <div style="margin-top: 1em">
              <el-text size="large" style="margin-right: 1em">款式：</el-text>
              <el-radio-group v-model="type">

                <el-radio size='large' border :key='0' style='margin-right: 0;' :value="''">
                  预览
                </el-radio>
                <div v-for="(item, index) in Data.res" :key="index" style='position:relative;'>
                  <el-radio
                    size="large"
                    border
                    :value="index"
                    style='margin-right: 0;margin-left: 1em;'
                  >
                    {{ item.type }}款式
                  </el-radio>
                  <el-button :icon='Delete' type='danger' circle size='small' @click='DelType(item.type)'
                             style='width: 18px;height: 18px;border: none;position:absolute;right: 0'/>
                </div>

                <el-radio size='large' border style='margin-right: 0;margin-left: 1em;' :value="''" disabled>
                  <el-input maxlength="5" v-model='newType' style="max-width: 6em;" input-style='box-shadow: none' placeholder='添加款式'></el-input>
                </el-radio>

              </el-radio-group>

              <div style="margin-top: 2em">宣传图、价格、数量，会与款式绑定</div>
            </div>
            <el-divider border-style="dashed" />
            <div>
              <el-space>
                <el-input-number v-model="total" controls-position="right" size="large" :step='100' :min="1" @change='totalChange'>
                  <template #prefix>
                    <span>数量</span>
                  </template>
                </el-input-number>
                <el-button type="success" plain size="large" style="margin-left: 1.5em" @click='save'
                  >保存修改</el-button
                >
              </el-space>
            </div>
            <!--商品类型-->
            <div style="margin-top: 1em; margin-bottom: 3em">
              <el-text size="large" v-if="Data.attribute == 'really'"
                >温馨提示 · 支持七天无理由退货 | 商品管理 > 类型
              </el-text>
              <el-text size="large" v-else>温馨提示 · 虚拟商品不支持退换 | 商品管理 > 类型</el-text>
            </div>

            <!--菜单-->
            <el-container style="width: 100%; margin-top: 1em">
              <el-aside style="width: 20%; margin-right: 1em">
                <el-card style="max-width: 100%; background: transparent; margin-top: 1em">
                  <template #header>
                    <div class="card-header" style="display: flex; align-items: center">
                      <span>{{ Data.merchants }}</span>
                      <el-icon size="large"><Shop /></el-icon>
                    </div>
                  </template>

                  <el-input v-model="Data.message"></el-input>

                  <el-divider border-style="dashed" />

                  <div style='display: flex; align-items: center;justify-content: space-between">'>
                    <el-button>进入店铺</el-button>
                    <el-button>关注店铺</el-button>
                  </div>
                </el-card>
              </el-aside>
              <el-main style="width: 70%; padding: 0; position: relative">
                <el-menu
                  mode="horizontal"
                  @select="toggleMenu"
                  :default-active="0"
                  :ellipsis="false"
                >
                  <el-menu-item v-for="(item, index) in menuItem" :index="index" :key="index"
                    >{{ item.value }}
                  </el-menu-item>
                  <el-button
                    type="danger"
                    plain
                    size="default"
                    style="margin-left: auto; margin-right: 0.5em; margin-top: 1.3em" @click='merchantUpdate'
                    >保存修改</el-button
                  >
                </el-menu>
                <!--商品信息-->
                <el-container v-show="activeMenu == 0">
                  <el-descriptions title=" " :column="4" size="large" direction="vertical">
                    <el-descriptions-item label="品牌" span="4">
                      <el-input v-model="Data.brand"></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item label="商品名称" min-width="150">
                      <el-input v-model="Data.title"></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item label="商品编号" :span="2" min-width="150">
                      <el-input v-model="Data.key" disabled></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item label="店铺" min-width="150">
                      <el-tag size="small">{{ Data.merchants }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="地址" min-width="300">
                      <el-input v-model="Data.address"></el-input>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-container>
                <!--店家留言-->
                <el-container v-show="activeMenu == 1">
                  <el-descriptions title=" " :column="4" size="large" direction="vertical">
                    <el-descriptions-item label="留言" span="4">
                      <el-input v-model="Data.message"></el-input>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-container>
                <!--推荐商品-->
                <el-container v-show="activeMenu == 2"> </el-container>
              </el-main>
            </el-container>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.banner {
  width: 75%;
  max-height: 550px;
  align-self: center;
}

.el-main {
  padding-inline: 5vw;
}

.swiper-slide {
  min-height: 30vh;
  max-height: 50vh;
  text-align: center;

  > * {
    margin-inline: auto;
  }
}

.Ifm {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
