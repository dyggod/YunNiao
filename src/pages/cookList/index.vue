<template>
  <view>
    cookList

    <view>
      <SubimitForm />
    </view>
  </view>
</template>

<script lang='ts' setup>
import {
  reactive, toRefs, onBeforeMount, onMounted,
} from 'vue';
import Taro from '@tarojs/taro';
import SubimitForm from './submit.vue';
</script>
<style lang='scss' scoped>
</style>
