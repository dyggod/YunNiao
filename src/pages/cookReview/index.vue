<template>
  <view>
    <view class="review-list">
      <text v-if="reviewList.length === 0">
        暂无待审核食谱
      </text>
      <at-card
        v-for="(item, index) in reviewList"
        :key="index"
        :title="`发起人：${item.user?.nickName}`"
      >
        <view>
          {{ item.type }}
        </view>
        <view>
          {{ item.name }}
        </view>
        <at-divider height="10" />
        <view>
          <view
            v-for="(it, ind) in item.mainMaterial"
            :key="ind"
          >
            {{ it.name }}
          </view>
        </view>
        <at-divider height="10" />
        <view>
          <view
            v-for="(it, ind) in item.excipient"
            :key="ind"
          >
            {{ it.name }}
          </view>
        </view>
        <at-divider height="10" />
        <view>
          <view
            v-for="(it, ind) in item.step"
            :key="ind"
          >
            {{ it.step }}
          </view>
        </view>
        <view>
          <at-flex>
            <at-flex-item
              v-for="(it, ind) in item.outcome"
              :key="ind"
              :size="4"
              class="img-container"
              @tap="previewImg(it, item.outcome)"
            >
              <image
                :src="it.replace(/[\r\n]/g,'')"
                class="img"
              />
            </at-flex-item>
          </at-flex>
        </view>
        <view class="review-option">
          <at-button
            size="small"
            class="btn"
            type="primary"
            @click="reviewCook(item, true)"
          >
            通过
          </at-button>
          <at-button
            size="small"
            class="btn"
            @click="reviewCook(item, false)"
          >
            不通过
          </at-button>
        </view>
      </at-card>
    </view>
    <view class="bottom-option">
      <at-button
        type="primary"
        size="small"
        class="btn"
        @click="refresh"
      >
        刷新列表
      </at-button>
      <at-button
        type="primary"
        size="small"
        class="btn"
        @click="closeReview"
      >
        关闭审核
      </at-button>
    </view>
  </view>
</template>

<script lang='ts' setup>
import {
  ref, defineEmits, onMounted,
} from 'vue';
import Taro from '@tarojs/taro';
import { previewImg } from '../../utils/taro';
import { CookReview } from '../cookList/types';
import { CloudRes } from '../../type';

const reviewList = ref<CookReview[]>([]);

const emits = defineEmits(['close']);

function getNotReview() {
  Taro.cloud.callFunction({
    name: 'yy_getCookForReview',
  }).then((res) => {
    const result = res.result as CloudRes;
    const reviewData = result?.data as CookReview[];
    reviewList.value = reviewData;
  });
}

function refresh() {
  getNotReview();
}

function reviewCook(cook: CookReview, pass: boolean) {
  Taro.cloud.callFunction({
    name: 'yy_reviewCook',
    data: {
      _id: cook._id,
      pass,
    },
  }).then(() => {
    refresh();
  }).catch((error) => {
    console.log('审核食谱云函数错误: ', error);
  });
}

function closeReview() {
  emits('close');
}

onMounted(() => {
  getNotReview();
});

</script>
<style lang='less'>

.review-list {
  height: 28rem;
  overflow-y: scroll;

  .review-option {
    display: flex;
    justify-content: left;
    margin-top: 00.5rem;
    .btn {
      margin: 0;
    }
  }
}

.bottom-option {
  .btn:first-child {
    margin-bottom: 0.5rem;
  }
}

.img-container {
  height: 6rem;
  padding: 0 0.1rem;

  image {
    border-radius: 0.2rem;
  }

  .img {
  width: 100%;
  height: 100%;
}
}

</style>
