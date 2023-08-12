
import themeColor  from "./src/assets/css/theme"

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 一级文字 主文本色
        first: themeColor.textFirst,
        // 二级文字 主文本色
        second: themeColor.textSecond,
        // 比例颜色
        ratio: themeColor.textRatio,
        // 成功
        success:themeColor.successColor,
        // 警用
        disabled: 'rgba(0, 0, 0, 0.25)',
        // 禁用背景
        'disabled-bg': 'rgba(0, 0, 0, 0.15)',
        // 边框颜色
        border: themeColor.borderColor,
        'border-second': themeColor.borderSecondColor,
        // body背景
        body: themeColor.bodyBg,
      },  
      borderRadius: {
        /**
         * 0px
         */
        0: '0',
        /**
         * 4px
         */
        xxs: '4px',
        /**
         * 8px
         */
        xs: '8px',
        /**
         * 12px
         */
        sm: '12px',
        /**
         * 16px
         */
        md: '16px',
        /**
         * 24px
         */
        lg: '24px',
      },
      boxShadow: {
        DEFAULT:themeColor.boxShadowDefault,
        hover:themeColor.boxShadowHover,
        'shadow-second':themeColor.boxShadowSecond,
        'second-hover':themeColor.boxShadowSecondHover,
      },
      // font-family: Maven Pro, Julius Sans One, Inter !important;
      fontFamily:{
        julius:'Julius Sans One',
        inter:'Inter',
        maven:'Maven Pro'
      }
    },
  },
  corePlugins:{
    preflight:false,
  },
};
