# [决定把gitblog和kb结合起来](https://github.com/yihong0618/gitblog/issues/189)

最近trending上发现一个[小知识管理系统](https://github.com/gnebbia/kb)，深得我心。还贡献了下代码想了一下方案，貌似可行。

1. 增加kb标签（可以加上其它标签）
2. 给issue打kb标签
3. 写评论，利用GitHub Actions触发，自动同步到kb中
4. 导出
5. commit

---

目前有的问题。

1. 需要增加直接写的功能
2. 本地的怎么合并
3. 是否需要提pr
4. 能否快速导出
5. 每次评论都触发有必要么？是结合之前的action还是新写一个

---

搞定了！！
开心，剩下的完善就可以了。

---

测试

第一个测试内容。看看能成功添加么

---

Split bash string by newline characters

```shell
IFS=$'\n' read -rd '' -a y <<<"$x"
```

---

say yes with shell script

echo yes | ./test.sh

---

yihong

Let us have a try.

---

Split bash string by newline characters

```shell
IFS=$'\n' read -rd '' -a y <<<"$x"
```

---

试试成功了没有
这一行很重要
花费了我好久这个坑。

---

Split bash string by newline characters

```shell
IFS=$'\r\n' read -rd '' -a y <<<"$x"
```

---

不用这个了，发现了更好的。