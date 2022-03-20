import Taro from '@tarojs/taro';

const LOGIN_STATUS = 'loginStatus';
const USER = 'userInfo';

export interface UserInfo {
  avatarUrl: string,
  nickName: string,
}

const api = {
  setUser(userInfo: UserInfo) {
    Taro.setStorageSync(USER, userInfo);
  },

  setLogin() {
    Taro.setStorageSync(LOGIN_STATUS, true);
  },

  outLogin() {
    Taro.setStorageSync(LOGIN_STATUS, false);
  },

  getUser(): UserInfo {
    const info = Taro.getStorageSync(USER) as UserInfo;
    return info;
  },

  getLogin(): boolean {
    return Taro.getStorageSync(LOGIN_STATUS) as boolean;
  },
};

export default {
  api,
};
