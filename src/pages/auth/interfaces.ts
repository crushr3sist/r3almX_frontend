export interface IGoogleLoginReq {
  code: string;
}

export interface IGoogleLoginRes {
  access_token: string;
  token_type: string;
  expire_time: Date;
  username_set: string;
}
