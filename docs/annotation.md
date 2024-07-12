### 代码说明

1. **导入依赖模块**：
   - `yaml` 用于解析 YAML 配置。
   - `cheerio` 用于解析 HTML。

2. **动态选择 fetch 实现**：
   - 根据运行环境选择合适的 `fetch` 实现。

3. **NIAL 类**：
   - `constructor`：初始化 `configs` 数组。
   - `push(yamlConfig)`：解析 YAML 配置并将项目添加到 `configs` 数组中。
   - `async get()`：根据配置获取和解析页面数据。

4. **get 方法**：
   - 初始化 `statusCode`、`allSuccessful` 和 `allFailed` 变量。
   - 遍历 `configs` 数组，根据配置抓取数据。
   - 根据抓取结果设置 `integrity` 字段为 `full`、`part` 或 `mistake`。
   - 返回包含版本、完整性状态、状态码和数据的对象。