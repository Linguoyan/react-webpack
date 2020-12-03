/**
 * 功能描述
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import service from '@/utils/axios'; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from 'antd';

const defaultState = {};

export default {
  state: defaultState,
  reducers: {},

  effects: (dispatch) => ({
    /**
     * 模板
     * @param { params }
     * **/
    async getTest(params) {
      try {
        const res = await service.get('/fuse/cluster/clugraphcluster/initpara');
        return res;
      } catch (err) {
        message.error('网络错误，请重试');
      }
      return;
    },
  }),
};
