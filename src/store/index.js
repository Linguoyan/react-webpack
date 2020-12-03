/** 全局唯一数据中心 **/

import { init } from '@rematch/core';
import app from '@/models/app';

const rootModel = { app };

const store = init({
  models: rootModel,
});

export default store;
