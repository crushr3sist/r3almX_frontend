export const setToken = async (token: string) => {
  await localStorage.setItem("token", token);
};

export const setTokenExpire = async (expireTime: string) => {
  await localStorage.setItem("token-expire", expireTime);
};
export const getTokenExpire = async () => {
  await localStorage.getItem("token-expire");
};

export const fetchToken = async () => {
  return await localStorage.getItem("token");
};
