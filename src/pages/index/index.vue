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
    <view
      class="light-list"
    >
      <at-card
        v-for="(item, index) in lightList"
        :key="index"
        :title="item.text"
        :icon="{value: 'tags', color: '#77a1fd'}"
      >
        <text>
          {{ item.text }}
        </text>
        <at-flex>
          <at-flex-item
            v-for="(i, ind) in item.imgs"
            :key="ind"
            :size="4"
            class="img-container"
            @tap="previewImg(i, index)"
          >
            <image
              :src="i.replace(/[\r\n]/g,'')"
              class="img"
            />
          </at-flex-item>
        </at-flex>
      </at-card>
      <at-load-more
        v-show="showLoadMore"
        status="loading"
      />
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
import {
  ref, reactive, onBeforeMount,
} from 'vue';
import Taro from '@tarojs/taro';
import { CloudRes } from '../../type';
import genId from '../../utils/genId';
import './index.less';

interface ImgFile {
  url: string,
  size: number,
}

interface Light {
  text: string,
  imgs: ImgFile[],
}

interface LightShow {
  text: string,
  imgs: string[],
}

const showEdit = ref(false);
const showLoadMore = ref(false);
const page = ref(1);
const currentTab = ref(0);
const light = reactive<Light>({
  text: '',
  imgs: [],
});
const lightList = ref<LightShow[]>([]);

const barList = [
  { title: '光影' },
  { title: '其他' },
];

async function getLightList() {
  const res = await Taro.cloud.callFunction({
    name: 'yy_getRecord',
    data: {
      page: page.value,
    },
  });
  const result = res?.result as CloudRes;
  if (result) {
    const list = result.data as LightShow[];
    list.forEach((l) => {
      lightList.value.push(l);
    });
  }
  return result.data;
}

// @ts-ignore
// eslint-disable-next-line no-unused-vars
async function updateList() {
  const data = await getLightList();
  if (data.length > 0) {
    page.value += 1;
  }
  showLoadMore.value = false;
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

// function imgToBase64(path): string | ArrayBuffer {
//   let res: string | ArrayBuffer = '';
//   try {
//     const base64 = Taro.getFileSystemManager().readFileSync(path);
//     if (base64) {
//       res = `data:image/jpeg;base64,${base64}`;
//     }
//   } catch (error) {
//     console.error(`image to base64 error: ${error}`);
//     throw error;
//   }
//   return res;
// }

// function imgBase64Convert(pathArr: string[]) {
//   const out = pathArr.map((item) => imgToBase64(item));
//   return out;
// }

function imgSelectChange(files) {
  light.imgs = files.files;
}

function clearInput() {
  getLightList();
  showEdit.value = false;
  light.text = '';
  light.imgs = [];
}

function uploadImgPromise(fileName: string, filePath: string) {
  return Taro.cloud.uploadFile({
    cloudPath: fileName,
    filePath,
  });
}

async function uploadAll(promiseArr: Promise<Taro.cloud.UploadFileResult>[]) {
  return Promise.all(promiseArr);
}

async function submit() {
  const imgTasks = light.imgs.map((i, index) => uploadImgPromise(`img-${genId()}-${index}.png`, i.url));
  const data = await uploadAll(imgTasks);
  const fileIdList = data.map((d) => d.fileID);
  Taro.cloud.callFunction({
    name: 'yy_addRecord',
    data: {
      text: light.text,
      imgs: fileIdList,
    },
  }).then(() => {
    Taro.atMessage({
      message: '发布成功',
      type: 'success',
    });
    clearInput();
  }).catch((err) => {
    console.error('err: ', err);
  });
}

function previewImg(current: string, index: number) {
  Taro.previewImage({
    current,
    urls: lightList.value[index].imgs,
  });
}

onBeforeMount(() => {
  getLightList();
});

</script>

<script lang="ts">
export default {
  // 对应 onShow
  onShow() {
    // this.getLightList();
  },
  onReachBottom() {
    this.showLoadMore = true;
    this.updateList();
  },
};
</script>

<style lang="less">
.top {
  display: flex;
}

.img-container {
  height: 5rem;
}

.img {
  width: 100%;
  height: 100%;
}
</style>
