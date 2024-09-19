export interface RouterOption {
  name: string;
  url: string;
  template: HTMLTemplateElement;
  otherTemplates: HTMLTemplateElement[];
}

export default class Router {
  app: HTMLElement;
  routes: { [key: string]: RouterOption };
  constructor(router: RouterOption[] = [], app: HTMLElement) {
    this.routes = router.reduce((acc: { [key: string]: RouterOption }, curr: RouterOption) => {
      acc[curr.url] = curr;
      return acc;
    }, {});
    this.app = app;
    this.popState()
  }

  popState() {
    window.addEventListener('hashchange', () => {
      const urlHash = window.location.hash.slice(1);
      console.log('hash', urlHash)
      this.render(this.routes[urlHash]);
    });
  }
  push(url: string, callback: () => void) {
    window.history.pushState({}, '', `index.html#${url}`);
    this.render(this.routes[url])
    callback()
  }

  render(page: RouterOption) {
    if (!page) return
    this.app.innerHTML = ''; // 移除旧的模板(移除旧的模板时,没有对所有dom元素监听解除,导致无法释放内存,是否有通用的解法获得当前模板所有的事件监听)
    const fragment = document.createDocumentFragment(); // 创建片段
    const clone = page.template.content.cloneNode(true); // 克隆模板
    fragment.appendChild(clone);
    page.otherTemplates.forEach(template => {
      fragment.appendChild(template.content.cloneNode(true)); // 挂载子模板
    });
    this.app.appendChild(fragment);
  }
}