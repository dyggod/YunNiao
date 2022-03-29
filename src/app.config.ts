export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/user/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#666',
    selectedColor: '#b4282d',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [{
      pagePath: 'pages/index/index',
      text: '影•食',
      iconPath: './assets/img/bar-index.png',
      selectedIconPath: './assets/img/bar-index-select.png',
    }, {
      pagePath: 'pages/user/index',
      text: 'MY',
      iconPath: './assets/img/bar-my.png',
      selectedIconPath: './assets/img/bar-my-select.png',
    }],
  },
});
