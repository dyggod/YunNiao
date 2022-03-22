import Taro from '@tarojs/taro';

export function previewImg(current: string, urls: string[] | undefined) {
  Taro.previewImage({
    current,
    urls: urls || [],
  });
}

export const a = 'something other';
