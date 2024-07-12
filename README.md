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
import NIAL from "@floatsheep/nial-package"；

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

## Configuration resolver

在当前的 **NIAL** 版本中，基本配置如下：

```yaml
projects:
  - subproject:
    type:
    url:
    linkElement:
    titleElement:
    elementArgs:
    elementAttr:
```

`subproject` 代表一个配置，多个 `subproject` 可以支持多个配置

`type` 代表类型，目前的版本中提供 `HTML-Get` 和 `API-Get`

`url` 代表要抓取的地址，**注意！ NIAL 不会拼接地址，因此你必须手动拼接后传递给 NIAL**

`linkElement` 和 `titleElement` 为 `type` 设置为 `HTML-Get` 后的特有选项，遵循 `cheerio` 的选择器。`linkElement` 用于定位超链接，`titleElement` 用于定位标题

`elementArgs` 为 `type` 设置为 `HTML-Get` 后的特有选项，用于更好的定位标题，类型为 `Boolean`。设置为 `true` 后将会根据 `elementAttr` 的设置来抓取标题，设置为 `false` 后就会直接读取标题选择器的文本

`elementAttr` 为 `type` 设置为 `HTML-Get` 后的特有选项，用于更好的定位标题，对于如下的 `HTML` 具有更好的抓取能力

```html
<a class="text-green" href="/iNewsId/7302.html" title="一念永恒第3季"
  >一念永恒第3季</a
>
```

在这种情况下，只需要设置 `elementAttr` 为 `title`，就会抓取 a 标签的 `title` 属性

同理，标题的 `Attr` 不为 `title` 时，也可以按需更改

`Node.js` 环境下配置一样

## Demonstration

```yaml
projects:
  - subproject: 樱花动漫 1
    type: HTML-Get
    url: http://www.iyinghua.io/search/工作细胞/
    linkElement: div.lpic > ul > li > a
    titleElement: div.lpic > ul > li > h2 > a
    elementArgs: true
    elementAttr: title
  - subproject: 叮咚动漫 2
    type: HTML-Get
    url: https://dingdongdm.fun/search/一念永恒/
    linkElement: div.ff-row > div > ul > li > h3 > a
    titleElement: div.ff-row > div > ul > li > h3 > a
    elementArgs: true
    elementAttr: title
```

正确返回

```json
{
  "version": "1",
  "integrity": "full",
  "status": 200,
  "data": [
    {
      "title": "工作细胞！！最强之敌再临，体内肠道大骚动！",
      "link": "/show/5293.html",
      "provider": "樱花动漫"
    },
    {
      "title": "工作细胞black",
      "link": "/show/5016.html",
      "provider": "樱花动漫"
    },
    {
      "title": "工作细胞 第二季",
      "link": "/show/4930.html",
      "provider": "樱花动漫"
    },
    { "title": "工作细胞", "link": "/show/4227.html", "provider": "樱花动漫" },
    {
      "title": "一念永恒第3季",
      "link": "/iNewsId/7302.html",
      "provider": "叮咚动漫"
    },
    {
      "title": "一念永恒",
      "link": "/iNewsId/4242.html",
      "provider": "叮咚动漫"
    }
  ]
}
```

错误返回

```json
{ "version": "1", "integrity": "mistake", "status": 0, "data": [] }
```

> 需要注意的是，**NIAL** 只有当 `yaml` 中的所有配置均无法抓取时才会返回 `status: 0`，因此，你不能够根据 `status` 判断

## Exporter

在正常情况下，输出应该如下：

```json
{
  "version": "1",
  "integrity": "full",
  "status": 200,
  "data": [
    ...
  ]
}
```

如果给定的 `yaml` 配置中有部分抓取失败，输出如下：

```json
{
  "version": "1",
  "integrity": "part",
  "status": 200,
  "data": [
    ...
  ]
}
```

如果给定的 `yaml` 配置全部抓取失败，输出如下：

```json
{
  "version": "1",
  "integrity": "mistake",
  "status": 0,
  "data": []
}
```

你可以通过获取 `integrity` 的值来判断 `yaml` 的抓取情况

## Precautions

在网页 / Electron 等中，需要**修改内容安全策略**或构建 `HTTP-Proxy-Server` 来处理潜在的问题

对于 Electron 来说，另一个方法是使用 **IPC 通信**，让 **Anime-EveryWhere-NIAL** 的请求在 `Node.js` 中处理
