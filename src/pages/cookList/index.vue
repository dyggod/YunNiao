<template>
  <view>
    <view
      v-if="!formVisible && nowPage === Step.TypeSelect"
      class="cook-types"
    >
      <at-grid
        :data="CookRange"
        @click="clickType"
      />
    </view>
    <view v-if="!formVisible && nowPage !== Step.TypeSelect ">
      <at-button
        type="secondary"
        @click="back"
      >
        返回
      </at-button>
    </view>
    <view
      v-if="!formVisible && nowPage === Step.CookList"
      class="one-type-list"
    >
      <at-list>
        <at-list-item
          v-for="(item, index) in cookList"
          :key="index"
          :title="item.name"
          :note="`贡献者：${item.user?.nickName}`"
          arrow="right"
          @click="clickShowDetail(item)"
        />
        <at-list-item
          v-if="cookList.length === 0"
          title="暂无相关食谱"
        />
      </at-list>
    </view>
    <view
      v-if="!formVisible && nowPage === Step.CookDetail && nowDetail !== undefined"
      class="cook-detail"
    >
      <at-list>
        <view class="item">
          <view class="label">
            美食名
          </view>
          <at-list-item
            :title="nowDetail.name"
            class="content"
          />
        </view>
        <view class="item">
          <view class="label">
            贡献者
          </view>
          <view class="user">
            <at-avatar
              :image="nowDetail.user.avatarUrl"
              :circle="true"
              size="small"
            />
            <at-list-item
              :title="nowDetail.user.nickName"
              class="content"
            />
          </view>
        </view>
        <view class="item">
          <view class="label">
            主要材料
          </view>
          <at-list-item
            v-for="(item, index) in nowDetail.mainMaterial"
            :key="index"
            :title="item.name"
            class="content"
          />
        </view>
        <view class="item">
          <view class="label">
            辅料
          </view>
          <at-list-item
            v-for="(item, index) in nowDetail.excipient"
            :key="index"
            :title="item.name"
            class="content"
          />
        </view>
        <view class="item">
          <view class="label">
            步骤
          </view>
          <at-timeline
            :items="genTimeline(nowDetail.step)"
            class="content"
          />
        </view>
        <view class="item">
          <view class="label">
            出餐
          </view>
          <at-flex>
            <at-flex-item
              v-for="(i, ind) in nowDetail.outcome"
              :key="ind"
              :size="4"
              class="img-container"
              @tap="previewImg(i, nowDetail?.outcome)"
            >
              <image
                :src="i.replace(/[\r\n]/g,'')"
                class="img"
              />
            </at-flex-item>
          </at-flex>
        </view>
      </at-list>
    </view>
    <view v-if="formVisible">
      <SubimitForm @close-form="closeForm" />
    </view>
  </view>
</template>

<script lang='ts' setup>
import {
  defineExpose, ref,
} from 'vue';
import Taro from '@tarojs/taro';
import SubimitForm from './submit.vue';
import { previewImg } from '../../utils/taro';
import { CookReview } from './types';
import { CloudRes } from '../../type';
import { CookRange } from '../../config/cook';

const formVisible = ref<boolean>(false);

const cookList = ref<CookReview[]>([]);
const nowDetail = ref<CookReview>();

// eslint-disable-next-line
enum Step {
  // eslint-disable-next-line
  TypeSelect = 1,
  // eslint-disable-next-line
  CookList,
  // eslint-disable-next-line
  CookDetail,
}

const nowPage = ref(Step.TypeSelect);

function getCookList(type: string) {
  Taro.cloud.callFunction({
    name: 'yy_cook_list',
    data: {
      type,
    },
  }).then((res) => {
    const result = res.result as CloudRes;
    cookList.value = result?.data;
    nowPage.value = Step.CookList;
  });
}

function clickType(item: {image: string, value: string}) {
  getCookList(item.value);
}

function clickShowDetail(detail: CookReview) {
  nowDetail.value = detail;
  nowPage.value = Step.CookDetail;
}

function back() {
  if (nowPage.value === Step.CookDetail) {
    nowPage.value = Step.CookList;
  } else if (nowPage.value === Step.CookList) {
    nowPage.value = Step.TypeSelect;
  }
}

function genTimeline(step: CookReview['step'] | undefined) {
  if (step !== undefined) {
    return step.map((i) => ({
      title: i.step,
    }));
  }
  return [];
}

function showForm() {
  formVisible.value = true;
}

function closeForm() {
  formVisible.value = false;
}

defineExpose({
  showForm,
});
</script>
<style lang='less'>
.cook-detail {
  .item {
    padding-left: 0.5rem;

    .user {
      display: flex;
    }

    .label::before {
      content: '*';
    }

    .content {
      font-size: 0.8rem;
    }
  }
}
</style>
