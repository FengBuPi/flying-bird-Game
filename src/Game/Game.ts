import Bird, { BirdOptions } from './Bird/Bird.js';
import Obstacle, { ObstacleOptions } from './Obstacle/Obstacle.js';
import Utils from '../Utils/Utils.js';

export interface GameOptions {
  bird: HTMLElement; // 鸟盒子
  obstacle: HTMLElement; // 障碍物盒子
  height: number; // 屏幕高度
  width: number; // 屏幕宽度
  obstacleSpace: number; // 两柱子之间出现的间距(px)
  interval?: number; // 创建新柱子的时间间隔(ms)
  obstacleOptions: ObstacleOptions;
  birdOption: BirdOptions;
}

export default class Game {
  bird: Bird;
  obstacle: Obstacle | undefined = undefined;
  gameOptions: GameOptions; // 游戏配置项(设置原子化)
  obstacleList: Array<HTMLElement & { checkObstacleOutOfViewport: () => boolean }> = []; // 障碍物列表,只有第一个柱子(即与小鸟最近的柱子)会跟小鸟的位置进行计算
  lastPrintTime: number | undefined = undefined; // 动画上一次时间戳

  constructor(gameOptions: GameOptions) {
    this.gameOptions = gameOptions
    this.bird = new Bird(gameOptions.bird, gameOptions.birdOption);
    this.obstacle = new Obstacle(this.gameOptions.obstacle, this.gameOptions.obstacleOptions);
    this.gameOptions.interval ??= (this.gameOptions.obstacleSpace / this.gameOptions.obstacleOptions.speed) * 1000 // (柱子间距 / 柱子移动速度) * 1000 = 创建新柱子的时间间隔(ms)
    this.mounted()
  }
  private mounted() {
    // 禁止滚动
    document.body.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    document.body.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    document.body.addEventListener('keydown', e => {
      if (e.key === ' ') {
        e.preventDefault(); // 阻止默认滚动行为
      }
    });
    // 任意一个柱子离开视口时触发该事件
    Obstacle.onOutofViewport = () => {
      this.obstacleList.shift()
    }
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        this.bird.jump();
      }
    });
  }

  public start() {
    this.bird.init()
    this.frame();
  }

  private frame(timestamp = 0) {
    this.bird.render()
    this.lastPrintTime ??= timestamp; // 初始化 lastPrintTime, 不存在lastPrintTime时赋值最新时间戳
    if (timestamp - this.lastPrintTime >= this.gameOptions.interval!) {
      this.createObstacle() // 创建柱子
      this.lastPrintTime = timestamp; // 更新 lastPrintTime
    }
    this.checkObstacleOutOfViewport()
    // 判断是否结束游戏
    if (!this.isGameOver()) {
      requestAnimationFrame(this.frame.bind(this)); // 使用 bind 确保 this 正确
    } else {
      this.end();
      return
    }
  }

  // 创建柱子
  private createObstacle() {
    console.log("创建一个柱子")
    this.obstacleList.push(Obstacle.createObstacle())// 记录游戏中正在进行的柱子
  }

  // 检测柱子是否离开视口
  private checkObstacleOutOfViewport = Utils.throttle(() => {
    // 遍历所有柱子检测柱子是否离开视口
    for (const obstacle of this.obstacleList) {
      obstacle.checkObstacleOutOfViewport()
    }
  }, 2 * 1000)
  // 判断游戏是否结束
  private isGameOver() {
    return this.bird.isbirdOutOfView() || this.isUpCollision() || this.isDownCollision()
  }

  // 观察鸟和最近的一个柱子的上半部分是否交叉
  private isUpCollision() {
    if (this.obstacleList.length === 0) return false;
    const rect1 = this.bird.bird.getBoundingClientRect();
    const rect2 = this.obstacleList[0].children[0].getBoundingClientRect();
    return !(rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom);
  }
  // 观察鸟和最近的一个柱子的下半部分是否交叉
  private isDownCollision() {
    if (this.obstacleList.length === 0) return false;
    const rect1 = this.bird.bird.getBoundingClientRect();
    const rect2 = this.obstacleList[0].children[1].getBoundingClientRect();
    return !(rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom);
  }

  private unMounted() {
    document.removeEventListener('keyup', () => { });
    this.obstacleList = [];
    this.bird.unMounted();
    Obstacle.unMounted();
  }
  private end() {
    this.unMounted()
    this.onEnd()
  }
  onEnd() { }
}