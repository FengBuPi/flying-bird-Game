import Utils from "../../Utils/Utils.js";

export interface ObstacleOptions {
  speed: number; // 柱子移动速度
  yPosition?: number; // 柱子初始位置
}

export default class Obstacle {
  static obstacleBox: HTMLElement; // 柱子父元素
  static cloneObstacleBox: HTMLElement; // 柱子父元素深拷贝版(基于柱子的父元素克隆新柱子)
  // static obstacle: HTMLElement; // 实例柱子
  static obstacleOptions: ObstacleOptions;
  // animation: Animation | undefined = undefined; // 柱子动画实例

  constructor(obstacleBox: HTMLElement, obstacleOptions: ObstacleOptions) {
    Obstacle.obstacleBox ??= obstacleBox; // dom树上的父元素实例
    Obstacle.obstacleOptions = obstacleOptions;
    Obstacle.cloneObstacleBox ??= Obstacle.obstacleBox.cloneNode(true) as HTMLElement;// 深拷贝一份柱子父元素实例,用于创建新的柱子
  }

  static createObstacle() {
    const obstacle = Obstacle.cloneObstacleBox?.firstElementChild?.cloneNode(true) as (HTMLElement & { checkObstacleOutOfViewport: () => boolean })
    // 判断柱子是否离开视口
    obstacle['checkObstacleOutOfViewport'] = function () {
      const rect = this.getBoundingClientRect();
      console.log('离开左边视口', rect.left < -rect.width)
      if (rect.left < -rect.width) {
        Obstacle.onOutofViewport()
        Obstacle.obstacleBox.removeChild(obstacle)
        return true
      } else {
        return false
      }
    };
    Obstacle.setStyle(obstacle);
    Obstacle.setAnimation(obstacle);
    Obstacle.obstacleBox.appendChild(obstacle) // 挂载到dom树
    return obstacle
  }

  private static setStyle(element: HTMLElement) {
    element.style.display = "flex"
    Obstacle.obstacleOptions.yPosition ??= Utils.getRandomNumber(-438, -200); // 当未指定柱子初始位置时,随机生成柱子的初始位置
    element.style.transform = `translate(375px,${this.obstacleOptions.yPosition}px)`
    element.style.gap = `${Utils.getRandomNumber(100, 300)}px`
  }

  private static setAnimation(element: HTMLElement) {
    const initialYPosition = this.obstacleOptions.yPosition;
    const animation: Animation = element.animate(
      [
        { transform: `translate(375px,${initialYPosition}px)` },
        { transform: `translate(-100vw,${initialYPosition}px)` },
      ],
      {
        duration: (375 / this.obstacleOptions.speed) * 1000, // 整个动画大约4s
        fill: 'forwards', // 障碍物保持在最后一个关键帧的位置
      }
    );
  }

  static unMounted() {
    Obstacle.obstacleBox.innerHTML = '';
  }

  // 当有任意一个柱子离开视口时触发该事件
  static onOutofViewport() { }
}
