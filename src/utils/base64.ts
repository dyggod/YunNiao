import Taro from '@tarojs/taro';

export function imgToBase64(path): string | ArrayBuffer {
  let res: string | ArrayBuffer = '';
  try {
    const base64 = Taro.getFileSystemManager().readFileSync(path);
    if (base64) {
      res = `data:image/jpeg;base64,${base64}`;
    }
  } catch (error) {
    console.error(`image to base64 error: ${error}`);
    throw error;
  }
  return res;
}

export function imgBase64Convert(pathArr: string[]) {
  const out = pathArr.map((item) => imgToBase64(item));
  return out;
}
