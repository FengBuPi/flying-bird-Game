export interface BirdOptions {
  y: number; // 鸟的初始高度
  angle: number; // 鸟的初始角度
  gravity: number; // 重力加速度
  speed: number; // 鸟的初始速度
  jumpUp: number; // 鸟一次跳跃的高度
}

export default class Bird {
  bird: HTMLElement;
  y!: number; // 纵向位置
  angle!: number; // 当前角度
  speed!: number; // 当前速度 
  gravity!: number; // 重力
  jumpUp!: number; // 跳跃速度
  birdOptions: BirdOptions = {
    y: 0,
    angle: 0,
    gravity: 0.1,
    speed: 0,
    jumpUp: 1
  }
  constructor(bird: HTMLElement, birdOptions: BirdOptions) {
    this.bird = bird;
    this.birdOptions = birdOptions || this.birdOptions;
    this.init()
  }

  init() {
    const {
      y,
      angle,
      gravity,
      speed,
      jumpUp
    } = this.birdOptions;
    this.y = y;
    this.angle = angle;
    this.gravity = gravity;
    this.speed = speed;
    this.jumpUp = jumpUp;
    this.bird.style.transform = `translate(0,${this.y}px) rotate(${this.angle}deg)`;
  }

  jump() {
    this.angle -= 30; // 抬头
    this.speed -= this.jumpUp;
  }

  private falling() {
    if (this.speed < 100) {
      this.speed += this.gravity;
    }
    this.y += this.speed;
  }

  private rotate() {
    if (this.angle < -33) this.angle = -33;
    if (this.angle > 36) this.angle = 36;
    if (this.speed > 0) this.angle += 0.5; // 低头    
  }

  render() {
    this.rotate();
    this.falling();
    // 防止触顶过多
    if (this.y < -10) {
      this.y = 1;
      this.speed = 0;
    }
    // 离开视口触发事件
    if (this.y > window.innerHeight) {
      this.onOutOfViewport()
    }
    this.bird.style.transform = `translate(0,${this.y}px) rotate(${this.angle}deg)`;
  }

  // 检查鸟是否离开屏幕
  isbirdOutOfView() {
    return Number(window.innerHeight) < Number(this.y)
  }
  // 离开视口事件
  onOutOfViewport() { }

  unMounted() {
    this.init()
  }
}