<template>
  <view class="index">
    <view class="top">
      <at-tab-bar
        :tab-list="barList"
        :current="currentTab"
        @click="clickTab"
      />
      <at-button @click="clickShowEidt">
        发布光影
      </at-button>
    </view>
    <view class="light-list">
      <at-card
        v-for="(item, index) in lightList"
        :key="index"
        :title="item.text"
      >
        {{ item.text }}
      </at-card>
    </view>
    <at-message />
    <at-floatLayout :is-opened="showEdit">
      <at-button @click="submit">
        发布
      </at-button>
      <at-textarea
        :value="light.text"
        :count="false"
        @change="textChange"
      />
      <at-image-picker
        multiple
        :files="light.imgs"
        @change="imgSelectChange"
      />
    </at-floatLayout>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import Taro from '@tarojs/taro';
import { CloudRes } from '../../type';
import './index.less';

// interface CloudRes {
//   data: any,
// }

interface ImgFile {
  url: string,
  size: number,
}

interface Light {
  text: string,
  imgs: ImgFile[],
}

const showEdit = ref(false);
const currentTab = ref(0);
const light = reactive<Light>({
  text: '',
  imgs: [],
});
const lightList = ref<Light[]>([]);

const barList = [
  { title: '光影' },
  { title: '其他' },
];

function getLightList() {
  Taro.cloud.callFunction({
    name: 'yy_getRecord',
  }).then((res) => {
    const result = res.result as CloudRes;
    const list = result.data as Light[];
    lightList.value = list;
  });
}

function clickTab(v) {
  currentTab.value = v;
}

function clickShowEidt() {
  showEdit.value = true;
}

function textChange(v) {
  light.text = v;
}

function imgToBase64(path): string {
  let res = '';
  try {
    const base64 = Taro.getFileSystemManager().readFileSync(path, 'base64');
    if (base64) {
      res = `data:image/jpeg;base64,${base64}`;
    }
  } catch (error) {
    console.error(`image to base64 error: ${error}`);
    throw error;
  }
  return res;
}

function imgBase64Convert(pathArr: string[]) {
  const out = pathArr.map((item) => imgToBase64(item));
  return out;
}

function imgSelectChange(files) {
  light.imgs = files.files;
}

function clearInput() {
  showEdit.value = false;
  light.text = '';
  light.imgs = [];
}

function submit() {
  const imgUrls = light.imgs.map((i) => i.url);
  const imgs = imgBase64Convert(imgUrls);
  Taro.cloud.callFunction({
    name: 'yy_addRecord',
    data: {
      text: light.text,
      imgs,
    },
  }).then(() => {
    Taro.atMessage({
      message: '发布成功',
      type: 'success',
    });
    clearInput();
  }).catch((err) => {
    console.log('err: ', err);
  });
}

onBeforeMount(() => {
  getLightList();
});

</script>

<style lang="less">
.top {
  display: flex;
}
</style>
