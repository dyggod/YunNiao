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
  </view>
</template>
<script lang="ts" setup>
import {
  reactive, ref,
} from 'vue';
import Taro, { useDidShow } from '@tarojs/taro';
import store from '../../utils/store';

const loginStatus = ref(false);

const userInfoShow = reactive({
  avatarUrl: '',
  nickName: '',
});

function getStore() {
  try {
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

function login() {
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

function isAuth() {
  Taro.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo'] === true) {
        getStore();
      }
    },
  });
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

</style>
