<template>
  <view class="index">
    <view class="top">
      <at-tab-bar
        :tab-list="barList"
        :current="currentTab"
        @click="clickTab"
      />
      <at-button
        type="primary"
        size="small"
        @click="clickShowEidt"
      >
        发布光影
      </at-button>
    </view>
    <view
      class="light-list"
    >
      <at-card
        v-for="(item, index) in lightList"
        :key="index"
        :title="item?.user?.nickName || '未知用户'"
        :thumb="item?.user?.avatarUrl"
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
    <at-floatLayout
      :is-opened="showEdit"
      @close="closeFloat"
    >
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
      <at-button
        type="primary"
        @click="submit"
      >
        发布
      </at-button>
    </at-floatLayout>
  </view>
</template>

<script setup lang="ts">
import {
  ref, reactive, onBeforeMount,
} from 'vue';
import Taro, { useReachBottom } from '@tarojs/taro';
import { CloudRes } from '../../type';
import genId from '../../utils/genId';
import store, { UserInfo } from '../../utils/store';
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
  user: UserInfo,
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
    if (list.length > 0) {
      page.value += 1;
    }
    list.forEach((l) => {
      lightList.value.push(l);
    });
  }
  return result.data;
}

async function updateList() {
  await getLightList();
  showLoadMore.value = false;
}

function clickTab(v) {
  currentTab.value = v;
}

function clickShowEidt() {
  const login = store.api.getLogin();
  if (login !== true) {
    Taro.atMessage({
      message: '请先登录',
      type: 'warning',
    });
    return;
  }
  showEdit.value = true;
}

function closeFloat() {
  showEdit.value = false;
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

function refreshList() {
  page.value = 1;
  lightList.value = [];
  getLightList();
}

function closeSubmit() {
  refreshList();
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
      user: store.api.getUser(),
    },
  }).then(() => {
    Taro.atMessage({
      message: '发布成功',
      type: 'success',
    });
    closeSubmit();
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

// 触底事件
useReachBottom(() => {
  showLoadMore.value = true;
  updateList();
});

</script>

<style lang="less">
.top {
  display: flex;
  align-items: center;
}

.img-container {
  height: 5rem;
}

.img {
  width: 100%;
  height: 100%;
}
</style>
