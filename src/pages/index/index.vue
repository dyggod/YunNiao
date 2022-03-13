<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import './index.less';

const msg = ref('Hello world');

</script>
