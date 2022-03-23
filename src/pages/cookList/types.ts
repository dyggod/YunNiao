export interface ImgFile {
  url: string,
  size: number,
}

export interface NameValue {
  name: string,
}

export interface StepValue {
  step: string,
}

export interface CookData {
  type: number,
  name: string,
  mainMaterial: NameValue[],
  excipient: NameValue[],
  step: StepValue[],
  outcome: ImgFile[],
}

export interface CookReview {
  _id: string,
  type: string,
  name: string,
  mainMaterial: NameValue[],
  excipient: NameValue[],
  step: StepValue[],
  outcome: string[],
  review: boolean,
  pass: boolean,
  user: {
    nickName: string,
    avatarUrl: string,
  },
  dateTime: string,
}
