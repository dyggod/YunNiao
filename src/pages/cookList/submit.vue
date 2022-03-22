<template>
  <view>
    <view class="back">
      <at-icon
        value="chevron-left"
        size="30"
        color="#ccc"
      />
      <at-button
        type="secondary"
        size="small"
        class="btn"
        @click="back"
      >
        返回
      </at-button>
    </view>
    <at-form>
      <view class="cook-type example-item">
        <picker
          mode="selector"
          :range="cookRange"
          :value="cookData.type"
          @change="typeChange"
          @cancel="typeCancel"
        >
          <view class="demo-list-item">
            <view class="demo-list-item__label">
              烹饪类别
            </view>
            <view class="demo-list-item__value">
              {{ cookRange[cookData.type] }}
            </view>
          </view>
        </picker>
      </view>
      <at-input
        v-model:value="cookData.name"
        title="美食名"
        placeholder="请输入菜名"
        type="text"
      />
      <view class="mainMaterial">
        <text>主要食材</text>
        <at-input
          v-for="(item,index) in cookData.mainMaterial"
          :key="index"
          v-model:value="item.name"
          :title="`食材${index + 1}`"
          placeholder="请输入食材"
          type="text"
        />
        <at-button
          size="small"
          type="primary"
          @click="addMaterial"
        >
          添加食材
        </at-button>
      </view>
      <view class="excipient">
        <text>辅料</text>
        <at-input
          v-for="(item,index) in cookData.excipient"
          :key="index"
          v-model:value="item.name"
          :title="`辅料${index + 1}`"
          placeholder="请输入辅料"
          type="text"
        />
        <at-button
          size="small"
          type="primary"
          @click="addExcipient"
        >
          添加辅料
        </at-button>
      </view>
      <view class="step">
        <text>烹饪步骤</text>
        <at-input
          v-for="(item,index) in cookData.step"
          :key="index"
          v-model:value="item.step"
          :title="`步骤${index + 1}`"
          placeholder="请输入操作内容"
          type="text"
        />
        <at-button
          size="small"
          type="primary"
          @click="addStep"
        >
          添加步骤
        </at-button>
      </view>
      <view class="outcome">
        <text>添加出餐照片</text>
        <at-image-picker
          multiple
          :files="cookData.outcome"
          @change="imgSelectChange"
        />
      </view>
      <at-button
        form-type="submit"
        type="primary"
        @click="submit"
      >
        提交审核
      </at-button>
    </at-form>
  </view>
</template>

<script lang='ts' setup>
import {
  reactive, defineEmits,
} from 'vue';
import Taro from '@tarojs/taro';
import { uploadImgPromise, uploadAllImg } from '../../utils/cloudFiles';
import store, { UserInfo } from '../../utils/store';
import { genFileName } from '../../utils/genId';

const emit = defineEmits(['closeForm']);

const filePrefix: string = 'cook';

interface ImgFile {
  url: string,
  size: number,
}

interface NameValue {
  name: string,
}

interface StepValue {
  step: string,
}

interface CookData {
  type: number,
  name: string,
  mainMaterial: NameValue[],
  excipient: NameValue[],
  step: StepValue[],
  outcome: ImgFile[],
}

const cookRange = ['家常炒菜', '海鲜', '淡水鱼', '汤类'];

const cookData = reactive<CookData>({
  type: 0,
  name: '',
  mainMaterial: [{ name: '' }],
  excipient: [{ name: '' }],
  step: [{ step: '' }],
  outcome: [],
});

function back() {
  emit('closeForm');
}

function typeChange(e) {
  cookData.type = e.detail.value;
}

function typeCancel() {}

function addMaterial() {
  cookData.mainMaterial.push({
    name: '',
  });
}

function addExcipient() {
  cookData.excipient.push({
    name: '',
  });
}

function addStep() {
  cookData.step.push({
    step: '',
  });
}

function imgSelectChange(files) {
  cookData.outcome = files.files;
}

function convertCookData(fileIdList: string[], user: UserInfo) {
  return {
    type: cookRange[cookData.type],
    name: cookData.name,
    mainMaterial: cookData.mainMaterial,
    excipient: cookData.excipient,
    step: cookData.step,
    outcome: fileIdList,
    review: false,
    user: {
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
    },
  };
}

async function submit() {
  const user = store.api.getUser();
  const imgTasks = cookData.outcome.map(
    (i, index) => uploadImgPromise(genFileName(filePrefix, user.nickName, index), i.url),
  );
  const uploadData = await uploadAllImg(imgTasks);
  const fileIdList = uploadData.map((d) => d.fileID);
  const submitData = convertCookData(fileIdList, user);
  Taro.cloud.callFunction({
    name: 'yy_addCook',
    data: submitData,
  }).then(() => {
    Taro.atMessage({
      message: '已提交，等待审核，审核后将出现在食谱列表',
      type: 'success',
    });
    back();
  }).catch((err) => {
    console.error('err: ', err);
  });
}

</script>
<style lang='less'>
.back {
  display: flex;
  justify-content: left;
  margin: 0.5rem 0;

  .btn {
    margin: 0;
  }
}

.picker__page .example-item {
  .at-list__item .item-extra__info {
    max-width: 300px;
  }
}

.demo-list-item {
  position: relative;
  display: flex;
  padding: 24px;

  .demo-list-item__label {
    margin-right: 2rem;
  }
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    transform: scaleY(0.5);
    border-bottom: 1PX solid #d6e4ef;
    transform-origin: center;
    box-sizing: border-box;
    pointer-events: none;
  }

  &::before {
    top: 0;
    bottom: auto;
  }

  &__label,
  &__value {
    color: #333;
    font-size: 32px;
    line-height: 1.5;
  }

  &__value {
    color: #999;
  }
}
</style>
