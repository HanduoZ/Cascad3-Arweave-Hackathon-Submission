import md5 from 'blueimp-md5';
import tinycolor from 'tinycolor2';

export const md5Pwd = (pwd: string) => md5(md5(pwd) + 'babel-admin');

/**
 * Format time to twitter style ones
 * @param time timestamp in seconds
 * @param ago the 'ago' suffix
 * @returns the time formatted test
 */
export function formatTimestamp(time: number, ago?: boolean) {
  const m = new Map([
    [1, 'Jan'],
    [2, 'Feb'],
    [3, 'Mar'],
    [4, 'Apr'],
    [5, 'May'],
    [6, 'Jun'],
    [7, 'Jul'],
    [8, 'Aug'],
    [9, 'Sep'],
    [10, 'Oct'],
    [11, 'Nov'],
    [12, 'Dec'],
  ]);

  let now = Math.floor(new Date().getTime() / 1000);
  let diff = now - time;

  const days = Math.floor(diff / (60 * 60 * 24));
  const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((diff % (60 * 60)) / 60);

  if (days > 0) {
    const date = new Date(time * 1000);

    if (days > 365) {
      return date.toLocaleString();
    } else {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return m.get(month) + ' ' + day;
    }
  }

  if (hours > 0) {
    let t = hours + ' hours';
    if (ago) t += ' ago';
    return t;
  }

  if (minutes > 0) {
    let t = minutes + ' mins';
    if (ago) t += ' ago';
    return t;
  }

  return 'just now';
}

export const validateEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

export function getUUID(len: number, radix: number) {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

/**
 * Gets the time value of now in milliseconds.
 * @returns the time value in milliseconds
 */
export function msOfNow() {
  return new Date().getTime();
}

/** nextjs/image loader function */
export const imageLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?width=${width}`;
};

/** 颜色转换 */
export const colorConvert = (hsx?: string, opacity?: number) => {
  if (!hsx) return `rgba(35,31,32,1)`;
  const data = tinycolor(hsx);
  return `rgba(${data._r},${data._g},${data._b},${opacity || 1})`;
};

/** 保留小数 不四舍五入 */
export const floorFixedNumber = (num: number, length: number) => {
  return Math.floor(num * 10 ** length) / 10 ** length;
};
