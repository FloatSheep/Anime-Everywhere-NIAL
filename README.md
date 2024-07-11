# Anime-EveryWhere-NIAL

## Being about it

本项目是 Anime Everywhere 的 **NIAL**(**N**etwork **I**nterface **A**bstraction **L**ayer)

> 值得一提，受限于本人技术水平，本项目中~~大~~部分代码使用 AI 编写

## Usefulness

方便的通过 **YAML** 对一些网站进行爬取和数据返回

## Usage

```bash
pnpm install @floatsheep/nial-package
```

在你的代码中添加

```javascript
import NIAL from "nial-package"；

const nial = new NIAL();

const yamlConfig = `
projects:
  - subproject: 樱花动漫
    type: HTML-Get
    url: http://www.iyinghua.io/search/0/
    linkElement: div.lpic > ul > li > a
    titleElement: div.lpic > ul > li > h2 > a
    elementArgs: true
    elementAttr: title
`;

nial.push(yamlConfig);

nial.get().then((result) => console.log(result)).catch((error) => console.error(error));
```

`Node.js` 环境下同理

## Precautions

在网页 / Electron 等中，需要**修改内容安全策略**或构建 `HTTP-Proxy-Server` 来处理潜在的问题

对于 Electron 来说，另一个方法是使用 **IPC 通信**，让 **Anime-EveryWhere-NIAL** 的请求在 `Node.js` 中处理