import Taro from '@tarojs/taro';

export function uploadImgPromise(fileName: string, filePath: string) {
  return Taro.cloud.uploadFile({
    cloudPath: fileName,
    filePath,
  });
}

export async function uploadAllImg(promiseArr: Promise<Taro.cloud.UploadFileResult>[]) {
  return Promise.all(promiseArr);
}
