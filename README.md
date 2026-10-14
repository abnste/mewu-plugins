# Mewu 插件市场

这个仓库收录 Mewu API 2 JavaScript 插件的真实 GitHub 发行。插件代码和版本包由作者在自己的仓库维护；本仓库保存每插件一个目录条目，经审核及 ZIP 下载核验后生成公开索引。

向市场贡献插件请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。Mewu 宿主、SDK、打包和发行工具在 [abnste/mewu_ai](https://github.com/abnste/mewu_ai/tree/next)，无需向宿主核心提交 PR 才能新增普通插件逻辑。

- `entries/<plugin-id>.json`：社区提交的发行记录。
- `mewu-catalog.json`：Mewu 实际读取的 API 2 索引。
- `host-source.json`：维护者固定的可信宿主解析器源码完整 SHA。
- `.github/workflows`：只把作者 PR 当数据的核验及合并后索引生成。

初始化目录可以为空。没有验证的示例、内置功能或占位仓库不会冒充社区插件。

本仓库采用 MPL-2.0；各插件遵循其自身声明的许可。

## 可安装的示例

- 区域操作 Agent：在用户框选的真实应用区域观察、操作并重新截图。当前输入适配器支持 Windows。
- 日志记忆：独立的 Agent 记忆提供方，逐条存储、分页检索与 CAS 并发写入。
- 交互尺子：通过独立插件生成可交互的透明 HTML/SVG 对象。

源码在 `plugins/`。安装使用 GitHub Release 的 ZIP，不会运行这个仓库的任意其他文件。示例均采用 MPL-2.0。

开发 SDK：[mewu-sdk-0.1.0.tgz](https://github.com/abnste/mewu-plugins/releases/download/v0.1.0/mewu-sdk-0.1.0.tgz)。宿主内置运行时模块；这个包提供开发类型与 ESM SDK，不要求用户安装 Node.js。