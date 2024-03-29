<template>
  <view class="index">
    <at-load-more
      v-show="showLoadMoreTop"
      status="loading"
    />
    <view class="top">
      <at-tab-bar
        :tab-list="barList"
        :current="currentTab"
        class="tab-bar"
        background-color="#fafafa"
        @click="clickTab"
      />
      <at-button
        type="primary"
        class="btn"
        @click="clickShowEidt"
      >
        {{ getBtnText() }}
      </at-button>
    </view>
    <CookList
      v-if="currentTab === 1"
      ref="cook"
    />
    <view
      v-if="currentTab === 0"
      class="light-list"
    >
      <at-card
        v-for="(item, index) in lightList"
        :key="index"
        :title="item?.user?.nickName || '未知用户'"
        :thumb="item?.user?.avatarUrl"
        class="one-light"
        :extra="format(item?.dateTime)"
        :note="item.private ? '仅个人可见' : ''"
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
        <view class="delete-btn">
          <at-button
            v-if="item?.user?.nickName === userName"
            size="small"
            type="secondary"
            @click="deleteRecord(index)"
          >
            删除
          </at-button>
        </view>
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
        placeholder="书写你的光影记录"
        @change="textChange"
      />
      <at-image-picker
        multiple
        :files="light.imgs"
        @change="imgSelectChange"
      />
      <at-checkbox
        v-model:selected-list="privateSelect"
        :options="[{
          value: 'private',
          label: '个人',
          desc: '选择个人后，将只有你自己可见'
        }]"
      />
      <at-button
        type="primary"
        @click="submit"
      >
        记录
      </at-button>
    </at-floatLayout>
  </view>
</template>

<script setup lang="ts">
import {
  ref, reactive, onBeforeMount,
} from 'vue';
import Taro, { useReachBottom, usePullDownRefresh, useDidShow } from '@tarojs/taro';
import CookList from '../cookList/index.vue';
import { CloudRes } from '../../type';
import genId from '../../utils/genId';
import { format } from '../../utils/time';
import store, { UserInfo } from '../../utils/store';
import foodImg from '../../assets/img/top-food.png';
import foodSelectedImg from '../../assets/img/top-food-select.png';
import './index.less';

interface ImgFile {
  url: string,
  size: number,
}

interface Light {
  text: string,
  imgs: ImgFile[],
  private?: boolean,
}

interface LightShow {
  _id: string,
  text: string,
  imgs: string[],
  user: UserInfo,
  dateTime: string,
  private?: boolean,
}

interface CookExspose {
  showForm(): void
}

const userName = ref<string>('');
const cook = ref<null | CookExspose>();

const showEdit = ref(false);
const showLoadMore = ref(false);
const showLoadMoreTop = ref(false);
const page = ref(1);
const currentTab = ref(0);
const light = reactive<Light>({
  text: '',
  imgs: [],
});
const lightList = ref<LightShow[]>([]);
const privateSelect = ref([]);

const barList = [
  { title: '光影', iconType: 'camera' },
  {
    title: '美食',
    image: foodImg,
    selectedImage: foodSelectedImg,
  },
];

function initUser() {
  userName.value = store.api.getUser().nickName;
}

function getBtnText() {
  switch (currentTab.value) {
    case 0:
      return '记录光影';
    case 1:
      return '贡献食谱';
    default:
      return '待开发';
  }
}

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

  if (currentTab.value === 0) {
    showEdit.value = true;
  } else if (currentTab.value === 1) {
    if (cook.value) {
      cook.value.showForm();
    }
  }
}

function closeFloat() {
  showEdit.value = false;
}

function textChange(v) {
  light.text = v;
}

function imgSelectChange(files) {
  light.imgs = files.files;
}

async function refreshList() {
  page.value = 1;
  lightList.value = [];
  await getLightList();
  showLoadMoreTop.value = false;
}

function closeSubmit() {
  refreshList();
  showEdit.value = false;
  light.text = '';
  light.imgs = [];
  privateSelect.value = [];
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
  const username = store.api.getUser().nickName;
  const imgTasks = light.imgs.map((i, index) => uploadImgPromise(`${username}-${genId()}-${index}.png`, i.url));
  const data = await uploadAll(imgTasks);
  const fileIdList = data.map((d) => d.fileID);
  Taro.cloud.callFunction({
    name: 'yy_addRecord',
    data: {
      text: light.text,
      imgs: fileIdList,
      private: privateSelect.value.length > 0,
      user: store.api.getUser(),
    },
  }).then(() => {
    Taro.atMessage({
      message: '记录成功',
      type: 'success',
    });
    closeSubmit();
  }).catch((err) => {
    Taro.atMessage({
      message: `记录失败：${err}`,
      type: 'error',
    });
  });
}

function previewImg(current: string, index: number) {
  Taro.previewImage({
    current,
    urls: lightList.value[index].imgs,
  });
}

function deleteRecord(index: number) {
  const deleteLight = lightList.value[index];
  const { imgs } = deleteLight;
  Taro.cloud.deleteFile({
    fileList: imgs,
    success: async (res) => {
      if (res.fileList.length >= 0) {
        const deleteRes = await Taro.cloud.callFunction({
          name: 'yy_deleteRecord',
          data: deleteLight,
        });
        if (deleteRes.result) {
          lightList.value.splice(index, 1);
          Taro.atMessage({
            message: '删除成功',
            type: 'success',
          });
        }
      } else {
        Taro.atMessage({
          message: '删除失败',
          type: 'error',
        });
      }
    },
    fail(error) {
      Taro.atMessage({
        message: `删除失败：${error}`,
        type: 'error',
      });
    },
  });
}

onBeforeMount(() => {
  getLightList();
});

useDidShow(() => {
  initUser();
});

// 下拉事件
usePullDownRefresh(() => {
  if (currentTab.value === 0) {
    showLoadMoreTop.value = true;
    refreshList();
  }
});

// 触底事件
useReachBottom(() => {
  if (currentTab.value === 0) {
    showLoadMore.value = true;
    updateList();
  }
});

</script>

<style lang="less">
.index {
  position: relative;
  padding-top: 110px;
}

.top {
  display: flex;
  align-items: center;
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  padding: 0 16px;
  background-color: #fafafa;
  z-index: 1000;
  top: 0;

  .tab-bar {
    padding: 0;
    display: flex;
    align-items: center;
    height: 100%;
  }

  .btn {
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.light-list {
  .one-light {
    margin-bottom: 0.2rem;
  }
}

.img-container {
  height: 6rem;
  padding: 0 0.1rem;
  image {
    border-radius: 0.2rem;
  }
}

.img {
  width: 100%;
  height: 100%;
}

.delete-btn {
  margin-top: 0.5rem;
}
</style>
