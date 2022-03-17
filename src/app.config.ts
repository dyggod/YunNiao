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
      text: '首页',
    }, {
      pagePath: 'pages/user/index',
      text: '个人',
    }],
  },
});
