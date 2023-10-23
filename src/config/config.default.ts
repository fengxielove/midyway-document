import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1697686668827_7446',
  koa: {
    port: 7001,
  },
  cors: {
    credentials: false,
  },
} as MidwayConfig;
