import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: './docs',
  base: '/',
  publicPath: '/',
  nodeModulesTransform: {
    type: 'none',
  },
});
