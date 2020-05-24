import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: './docs',
  publicPath: 'https://1024bytelab.com/',
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  // routes: [
  //   { path: '/', component: '@/pages/index' },
  //   { path: '/juejin', component: '@/pages/juejin' },
  //   { path: '/lagou', component: '@/pages/lagou' },
  // ],
});
