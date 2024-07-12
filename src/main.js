import * as yaml from "js-yaml";
import cheerio from "cheerio";

// 动态选择 fetch 实现
const fetchFunction = async () => {
  if (typeof window !== 'undefined' && typeof window.fetch !== 'undefined') {
    return window.fetch;
  } else {
    const nodeFetch = await import('node-fetch');
    return nodeFetch.default;
  }
};

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
    let statusCode = "";

    const allData = [];
    const fetch = await fetchFunction();

    for (const config of this.configs) {
      const { type, url, linkElement, titleElement, elementArgs, elementAttr } = config;

      try {
        const response = await fetch(url);
        const status = response.status;
        if (!response.ok) {
          statusCode = status;
        }

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
            statusCode = status;
          });
        } else if (type === "API-Get") {
          const json = await response.json();
          allData.push(...json.map((item) => ({ title: item.title, link: item.link })));
        }
      } catch (error) {
        console.error(`Error fetching data for ${url}: ${error.message}`);
        statusCode = 0;
      }
    }

    // 返回指定格式的数据
    return {
      version: "1",
      status: statusCode,
      data: allData,
    };
  }
}

export default NIAL;
