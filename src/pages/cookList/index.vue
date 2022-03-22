<template>
  <view>
    <view v-if="!formVisible">
      cook list
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
import SubimitForm from './submit.vue';

const formVisible = ref<boolean>(false);

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
<style lang='scss' scoped>
</style>
