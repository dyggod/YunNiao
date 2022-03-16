<template>
  <view>
    <text>
      {{ text }}
    </text>
    <at-button
      type="primary"
      @click="addRecord"
    >
      点击上传动态
    </at-button>
    <at-button
      type="primary"
      @click="chooseImg"
    >
      点击选择照片
    </at-button>
  </view>
</template>
<script lang="ts">
import {
  reactive, toRefs, onBeforeMount, onMounted, ref,
} from 'vue';
import Taro from '@tarojs/taro';

function addRecord() {
  Taro.cloud.callFunction({
    name: 'yy_addRecord',
  }).then((res) => {
    console.log('res: ', res);
  }).catch((err) => {
    console.log('err: ', err);
  });
}

function chooseImg() {
  Taro.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
    success(res) {
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const { tempFilePaths } = res;
      console.log('tempFilePaths: ', tempFilePaths);
    },
  });
}
</script>
<script lang='ts' setup>
const text = ref('你好');
</script>
<style lang='less' scoped>
</style>
