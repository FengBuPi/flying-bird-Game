export default class Utils {

  // 返回一个在 [min, max] 之间的随机整数
  static getRandomNumber(min: number, max: number) {
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new Error('Both min and max must be numbers.');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static isElementOutOfViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    // 判断元素是否完全在视口外
    return (
      rect.bottom < 0 || // 元素底部在视口上方
      rect.top > window.innerHeight || // 元素顶部在视口下方
      rect.right < 0 || // 元素右侧在视口左边
      rect.left > window.innerWidth // 元素左侧在视口右边
    );
  }

  static throttle<T>(fn: (this: T, ...args: any[]) => void, delay: number): (this: T, ...args: any[]) => void {
    let timer: number | null = null;
    return function (...args: any[]) {
      if (!timer) {
        fn.apply(this, args);
        timer = setTimeout(() => {
          timer = null;
        }, delay);
      }
    };
  }
}