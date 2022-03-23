import Taro from '@tarojs/taro';
import { CloudRes } from '../type';

export function previewImg(current: string, urls: string[] | undefined) {
  Taro.previewImage({
    current,
    urls: urls || [],
  });
}

export function callClound(name: string, data?: any): Promise<CloudRes> {
  return new Promise((resolve, reject) => {
    Taro.cloud.callFunction({
      name,
      data,
    }).then((res) => {
      const result = res.result as CloudRes;
      resolve(result);
    }).catch((err) => {
      console.error('call cloud function error: ', err);
      reject(err);
    });
  });
}

export const a = 'something other';
