const genId = () => (Math.random()).toString(36).substring(0, 11);

export function genFileName(prefix: string, nickName: string, index: number) {
  return `${prefix}-${nickName}-${genId()}-${index}.png`;
}

export default genId;
