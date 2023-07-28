# [将友情链接生成的markdown表格处理成html](https://github.com/yihong0618/gitblog/pull/271)

GitHub pages默认仓库根目录下index.html为入口，因该仓库没有index文件，默认解析readme.md。
但是Jekyll不能很好的渲染markdown表格，导致通过{user}.github.io访问主页时友情链接部分会打乱排版。

通过引入markdown库，提前把mardown表格渲染后成html后再写入readme.md，保证了主页排版的展示效果。

---

thanks will take a look tomorrow