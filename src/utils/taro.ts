import Taro from '@tarojs/taro';

export function previewImg(current: string, urls: string[]) {
  Taro.previewImage({
    current,
    urls,
  });
}

export const a = 'something other';
