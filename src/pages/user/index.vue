<template>
  <view class="user-page">
    <at-button
      type="primary"
      @click="login"
    >
      点击登录
    </at-button>
    <view
      v-if="isLogin"
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
  reactive, toRefs, onBeforeMount, onMounted, ref,
} from 'vue';
import Taro from '@tarojs/taro';
import User from '../../utils/auth';

interface UserInfo {
  avatarUrl: string,
  nickName: string,
}

const isLogin = ref(false);

const userInfoShow = reactive({
  avatarUrl: '',
  nickName: '',
});

const userInfo = User.getInfo();
console.log('userInfo: ', userInfo);

function getStore() {
  try {
    const user = Taro.getStorageSync('user') as UserInfo;
    console.log('user: ', user);
    if (user) {
      userInfoShow.avatarUrl = user.avatarUrl;
      userInfoShow.nickName = user.nickName;
      isLogin.value = true;
    }
  } catch (error) {
    console.error(`getStorage error: ${error}`);
  }
}

function login() {
  // Taro.authorize({
  //   scope: 'scope.userInfo',
  //   success(res) {
  //     console.log('res: ', res);
  //   },
  // });
  Taro.getUserProfile({
    desc: '授权获取用户信息',
    success(res) {
      console.log('res: ', res);
      isLogin.value = true;
      const { userInfo } = res;
      userInfoShow.avatarUrl = userInfo.avatarUrl;
      userInfoShow.nickName = userInfo.nickName;
      Taro.setStorageSync('user', userInfo);
    },
  });
}

// @ts-ignore
// eslint-disable-next-line no-unused-vars
function isAuth() {
  Taro.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo'] === true) {
        getStore();
      }
    },
  });
}
</script>
<script lang="ts">
export default {
  onShow() {
    this.login();
  },
};
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
