<template>
  <view class="user-page">
    <at-button
      v-if="!loginStatus"
      type="primary"
      @click="login"
    >
      点击登录
    </at-button>
    <view
      v-if="loginStatus"
      class="user-info"
    >
      <view class="avatar">
        <at-avatar
          :image="userInfoShow.avatarUrl"
          circle
        />
      </view>
      <at-button>{{ userInfoShow.nickName }}</at-button>
    </view>
    <view v-if="store.api.getAdmin() && !reviewVisible">
      <at-button
        type="primary"
        @click="toReview"
      >
        审核食谱
      </at-button>
    </view>
    <view v-if="!reviewVisible && !myCookVisible">
      <at-button
        type="primary"
        class="btn"
        @click="toMyCook"
      >
        我的食谱
      </at-button>
    </view>
    <view v-if="reviewVisible">
      <CookReview @close="closeReview" />
    </view>
    <view>
      <MyCook
        v-if="myCookVisible"
        @close="closeMyCook"
      />
    </view>
  </view>
</template>
<script lang="ts" setup>
import {
  reactive, ref,
} from 'vue';
import Taro, { useDidShow } from '@tarojs/taro';
import CookReview from '../cookReview/index.vue';
import MyCook from './MyCook.vue';
import store from '../../utils/store';

interface AuthRes {
  isAdmin: boolean,
  appid: string,
  openid: string,
}

const loginStatus = ref(false);
const reviewVisible = ref<boolean>(false);
const myCookVisible = ref<boolean>(false);

const userInfoShow = reactive({
  avatarUrl: '',
  nickName: '',
});

function getOpenId() {
  Taro.cloud.callFunction({
    name: 'yy_getOpenid',
  }).then((res) => {
    const result = res.result as AuthRes;
    if (result.isAdmin) {
      store.api.setAdmin();
    }
  }).catch((err) => {
    console.error('getOpenid error', err);
  });
}

function login() {
  getOpenId();
  Taro.getUserProfile({
    desc: '授权获取用户信息',
    success(res) {
      loginStatus.value = true;
      const { userInfo } = res;
      userInfoShow.avatarUrl = userInfo.avatarUrl;
      userInfoShow.nickName = userInfo.nickName;
      store.api.setLogin();
      store.api.setUser(userInfo);
    },
  });
}

function getStore() {
  try {
    const auth = store.api.getAdmin();
    if (auth === '') {
      store.api.deleteAll();
    }
    loginStatus.value = store.api.getLogin();
    const user = store.api.getUser();
    if (user) {
      userInfoShow.avatarUrl = user.avatarUrl;
      userInfoShow.nickName = user.nickName;
      loginStatus.value = true;
    }
  } catch (error) {
    console.error(`getStorage error: ${error}`);
  }
}

function isAuth() {
  Taro.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo'] === true) {
        getStore();
      }
    },
  });
}

function toReview() {
  myCookVisible.value = false;
  reviewVisible.value = true;
}

function toMyCook() {
  reviewVisible.value = false;
  myCookVisible.value = true;
}

function closeReview() {
  reviewVisible.value = false;
}

function closeMyCook() {
  myCookVisible.value = false;
}

useDidShow(() => {
  isAuth();
});
</script>
<style lang='less'>
.user-page, .user-info {
  width: 100%;
}

.avatar {
  display: flex;
  justify-content: center;
}

.btn {
  margin: 0.5rem 0;
}

</style>
