<template>
  <view>
    <text>
      {{ text }}
    </text>
  </view>
</template>
<script lang="ts">
import {
  reactive, toRefs, onBeforeMount, onMounted, ref,
} from 'vue';
</script>
<script lang='ts' setup>
const text = ref('你好');
</script>
<style lang='less' scoped>
</style>
