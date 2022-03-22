import Taro from '@tarojs/taro';

const LOGIN_STATUS = 'loginStatus';
const USER = 'userInfo';
const ADMIN = 'adminAuth';

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

  setAdmin() {
    Taro.setStorageSync(ADMIN, true);
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

  getAdmin(): boolean | string {
    return Taro.getStorageSync(ADMIN) as boolean;
  },

  deleteAll() {
    Taro.clearStorageSync();
  },

};

export default {
  api,
};
