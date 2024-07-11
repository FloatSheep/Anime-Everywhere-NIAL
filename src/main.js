import fetch from "node-fetch";
import * as yaml from "js-yaml";
import cheerio from "cheerio";

class NIAL {
  constructor() {
    this.configs = [];
  }

  // 解析 YAML 配置并添加到 configs 数组中
  push(yamlConfig) {
    const parsedConfig = yaml.load(yamlConfig);
    this.configs.push(...parsedConfig.projects);
  }

  // 异步函数用于根据配置获取和解析页面数据
  async get() {
    const allData = [];

    for (const config of this.configs) {
      const { type, url, linkElement, titleElement, elementArgs, elementAttr } = config;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        if (type === "HTML-Get") {
          const body = await response.text();
          const $ = cheerio.load(body);

          // 使用 linkElement 和 titleElement 解析 HTML 获取链接和标题
          $(linkElement).each(function (index) {
            const link = $(this).attr("href");
            let title;

            // 获取对应的标题
            if (!elementArgs) {
              title = $(titleElement).eq(index).text().trim();
            } else {
              title = $(titleElement).eq(index).attr(elementAttr);
            }

            // 将数据添加到 allData 数组中
            allData.push({
              title,
              link,
            });
          });
        } else if (type === "API-Get") {
          const json = await response.json();
          allData.push(...json.map((item) => ({ title: item.title, link: item.link })));
        }
      } catch (error) {
        console.error(`Error fetching data for ${url}: ${error.message}`);
      }
    }

    // 返回指定格式的数据
    return {
      version: "1",
      status: "ok",
      data: allData,
    };
  }
}

export default NIAL;
