<template>
  <view class="my-cook">
    <view class="list">
      <at-list>
        <at-list-item
          v-for="(item, index) in myCookList"
          :key="index"
          class="item"
          :title="item.name || '未命名'"
          :note="genReviewStr(item)"
          :extra-text="format(item.dateTime)"
        />
      </at-list>
    </view>
    <view>
      <at-load-more
        :status="loadStatus"
        @click="loadMore"
      />
      <at-button
        type="primary"
        @click="closeList"
      >
        关闭
      </at-button>
    </view>
  </view>
</template>

<script lang='ts' setup>
import {
  ref, onMounted, defineEmits,
} from 'vue';
import { CookReview } from '../cookList/types';
import { callClound } from '../../utils/taro';
import { format } from '../../utils/time';

const myCookList = ref<CookReview[]>([]);
const page = ref(1);
const loadStatus = ref('more');
const emits = defineEmits(['close']);

async function getMyCookList() {
  const res = await callClound('yy_myCook', {
    page: page.value,
  });
  const { data } = res;
  if (data.length > 0) {
    page.value += 1;
    loadStatus.value = 'more';
  } else {
    loadStatus.value = 'noMore';
  }
  myCookList.value = myCookList.value.concat(data);
}

function genReviewStr(item: CookReview) {
  const { review, pass, reason } = item;
  if (review === true && pass === true) {
    return '审核通过，已发布';
  } if (review === true && pass === false) {
    return `审核未通过，原因：${reason || '未给出描述'}`;
  } if (review === false) {
    return '审核中...';
  }
  return '审核中...';
}

function loadMore() {
  loadStatus.value = 'loading';
  getMyCookList();
}

function closeList() {
  emits('close');
}

onMounted(() => {
  getMyCookList();
});
</script>
<style lang='less'>

.my-cook {
  .list {
    max-height: 20rem;
    overflow-y: scroll;
  }
  .item {
    border-bottom: 1px solid #eee;
  }
}
</style>
