import Taro from '@tarojs/taro';

interface UserInfo {
  avatarUrl: string,
  nickName: string,
}

class User {
  isLogin: boolean;

  info: UserInfo;

  constructor() {
    this.isLogin = false;
    this.info = {
      avatarUrl: '',
      nickName: '',
    };
    this.init();
  }

  init() {
    Taro.getUserProfile({
      desc: '授权获取用户信息',
      success: this.success,
    });
  }

  private success(res) {
    const { userInfo } = res;
    this.info.avatarUrl = userInfo.avatarUrl;
    this.info.nickName = userInfo.nickName;
    this.isLogin = true;
    // Taro.setStorageSync('user', userInfo);
  }

  getInfo() {
    return this.info;
  }
}

const singleton = new User();

export default singleton;
