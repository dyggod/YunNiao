<template>
  <view class="my-cook">
    <view>
      <at-list>
        <at-list-item
          v-for="(item, index) in myCookList"
          :key="index"
          class="item"
          :title="item.name || '未命名'"
          :note="genReviewStr(item.review, item.pass)"
          :extra-text="format(item.dateTime)"
        >
          44
        </at-list-item>
      </at-list>
    </view>
  </view>
</template>

<script lang='ts' setup>
import {
  ref, onMounted,
} from 'vue';
import { CookReview } from '../cookList/types';
import { callClound } from '../../utils/taro';
import { format } from '../../utils/time';

const myCookList = ref<CookReview[]>([]);

async function getMyCookList() {
  const res = await callClound('yy_myCook');
  const { data } = res;
  myCookList.value = data;
}

function genReviewStr(review: boolean, pass: boolean) {
  if (review === true && pass === true) {
    return '审核通过，已发布';
  } if (review === true && pass === false) {
    return '审核未通过';
  } if (review === false) {
    return '审核中...';
  }
  return '审核中...';
}

onMounted(() => {
  getMyCookList();
});
</script>
<style lang='less'>

.my-cook {
  .item {
    border-bottom: 1px solid #eee;
  }
}
</style>
