# [将友情链接生成的 markdown 表格处理成 html](https://github.com/yihong0618/gitblog/pull/271)

GitHub pages 默认仓库根目录下 index.html 为入口，因该仓库没有 index 文件，默认解析 readme.md。
但是 Jekyll 不能很好的渲染 markdown 表格，导致通过{user}.github.io 访问主页时友情链接部分会打乱排版。

通过引入 markdown 库，提前把 mardown 表格渲染后成 html 后再写入 readme.md，保证了主页排版的展示效果。

---

thanks will take a look tomorrow