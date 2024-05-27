export const setToken = async (token: string) => {
  await localStorage.setItem("token", token);
};

export const setTokenExpire = async (expireTime: string) => {
  await localStorage.setItem("token-expire", expireTime);
};

export const fetchToken = async () => {
  return await localStorage.getItem("token");
};

export const expTime = () => {
  const date = Date.now();
  const timeDiff = 60 * 60 * 24 * 30;
  return date / 1000 + timeDiff;
};
