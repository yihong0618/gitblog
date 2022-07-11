# [LeetCode 是如何运行的--测试篇](https://github.com/yihong0618/gitblog/issues/237)

## 初

有段日子没写博客了。
一般情况，四张图加上 140 字能表达的内容我就直接发推了，想到这个可能会超过这个长度，就写在这里吧。
当然有个前情提要，感恩 GitHub Issues 的双向链接，
- 我只需要 #205 大家就可以直接看到上一篇的相关文章了 --《力扣的程序是如何运行的》，我昨天自己也看了一遍哈哈。所以这篇的格式也会跟上一篇一样。

## 起因

最近心血来潮决定去刷[几道题](https://github.com/yihong0618/edocteel001)，上一次也是第一次刷题还是 3 年前了。
![image](https://user-images.githubusercontent.com/15976103/176813075-5d2495c1-08fa-4bc4-be3f-a51edb0fb189.png)

刷题的过程中感觉到了自己的不足。写完代码就直接提交了，结果很多时候是错的。也发现了 LeetCode 有先测试功能，需要自己写测试用例。
编了几个之后突然想，为什么我不能用官方的测试用例呢？那样不是更方便。搜了一下发现是没有的，并且这个需求还是有人提过的

1. https://leetcode.com/discuss/general-discussion/635684/option-to-view-all-the-testcases
2. https://www.quora.com/How-do-I-get-all-the-test-cases-of-problems-posted-on-LeetCode/answer/Vipin-Sharma-83

那么我能不能用我之前那篇文章的方法拿到 test case 呢？

## 探索

- 把上一篇流程跑了一遍，发现 LeetCode 改了一些东西，增加了一点安全措施，但上文的方法依然可用
- 观察 /mnt dir 下面的文件，`data.in` 最奇怪了，那么我们能不能打开呢？
![image](https://user-images.githubusercontent.com/15976103/176811631-355a0a01-85eb-4396-b35d-2a65b3559e24.png)
- 完全没问题，里面的内容呢就是 test case...得到的好容易，在接口里也能看到，我们可以直接 print 那样就可以在 stdout 里看到了
![image](https://user-images.githubusercontent.com/15976103/176811708-8aa6c19a-0e15-48c0-86c4-79dea105dee4.png)
![image](https://user-images.githubusercontent.com/15976103/176811844-315b73d9-5980-4b6f-bf17-b228a9f03139.png)
![image](https://user-images.githubusercontent.com/15976103/176812095-0bbc54e2-5edb-4bf2-96c8-7f3799f8fdcc.png)

## 继续探索

- 那么我能不能写个脚本把这些测试都拿下来直接生成所有测试用例呢？看起来很简单，但其实栽了
- 因为 LeetCode 的测试非常严谨，到后面的测试，比如字符串，它会用一个非常长的字符串，len(s) > 500000 `print` 根本是打不下的，LeetCode 也只会截取前面的，后面用 `...` 代替
- 如果整个测试太长，最后面的也会被截掉，用还剩多少个字符代替，如图
![image](https://user-images.githubusercontent.com/15976103/176812464-ff00f9dd-8f41-4838-a4ac-4bd15897befb.png)
- 尝试用 `zlib compress + base64` 给字符串压缩，同样失败，有一点点效果
- 继续尝试用 `urllib.request.urlopen` 能不能把 `data.in` 发出去？不行，这个 docker 内部网是不通的
- 有其它方法么？有的，把长的字符串收集到  --> 分 n 次拿到 --> 最后保存。但是对普通刷题的朋友太麻烦了没有意义，感兴趣的同学可以自己尝试

## 意义呢

1. 不想多次提交，我可以建一个小号，第一次去拿测试，然后复制粘贴到测试用例里，这样能保证大部分测试是可以的。
2. 本地测试通过了再提交就 OK 了，也不用自己写符合 LeetCode 的测试了
3. 今天我就用这个方式搞定了**每日一题**哈哈哈
![image](https://user-images.githubusercontent.com/15976103/176813569-391e9652-47b5-4591-9da3-68fb25fbb46e.png)
4. 周赛貌似会很有用


## 启示呢

- 做类似业务的朋友大多数也是 docker 起一个的方案，一定要小心，如果用户好奇会拿到你们许多信息的，连逆向都不用的。还有一定要小心 docker 逃逸的问题，LeetCode 能做到安全不代表所有公司能做到
- 以后自己也要多写测试
- 写代码，研究背后的原理，探索未知可比刷题有意思多了，我每次刷题最后都走偏。。。
- LeetCode 不去公布所有测试也是有原因的，通过这次我明白了
- 其实通过这个方式还能拿到一些 LeetCode setting 的限制，大家自己探索～
- 其它语言其实同理，我跑通了 go 的，大家可以用自己习惯的编程语言测试


---

> 链接其他 issue/pr 的时候可以放到 markdown list 里面，这样 GitHub 会 render 出标题来，比如
> 
> * 测试 [力扣的程序是如何运行的 #205](https://github.com/yihong0618/gitblog/issues/205)

学到了，已经更改，感谢哈哈。

---

> 大学时代在做oj核心的时候也碰到过这个问题，怎么防止用户作弊。但是当时实力有限，就不做了，直接摆烂

拿到所有测试，感觉可以自动生成 if a: return b 的程序。。。