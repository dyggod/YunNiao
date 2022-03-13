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
</script>
<script lang='ts' setup>
const text = ref('你好');
</script>
<style lang='less' scoped>
</style>
