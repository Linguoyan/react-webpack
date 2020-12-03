/** 对axios做一些配置 **/

import axios from 'axios';

const env = process.env.NODE_ENV; // 当前模式（dev开发环境，production生产环境）
const baseUrl = `${location.protocol}//${location.host}`; // 默认请求前缀

function setBaseUrl() {
  switch (env) {
    case 'development':
      return '/api';
    case 'production':
      return baseUrl;
    default:
      return baseUrl;
  }
}

// 创建axios实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  baseURL: setBaseUrl(), //请求前缀,代理前缀
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    const tokenId = undefined;
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: tokenId,
    };
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 对返回的结果做处理
service.interceptors.response.use(
  (response) => {
    // const code = response?.data?.code ?? 200;
    // 没有权限，登录超时，登出，跳转登录
    // if (code === 3) {
    //   message.error("登录超时，请重新登录");
    //   sessionStorage.removeItem("userinfo");
    //   setTimeout(() => {
    //     window.location.href = "/";
    //   }, 1500);
    // } else {
    //   return response.data;
    // }
    return response.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default service;
