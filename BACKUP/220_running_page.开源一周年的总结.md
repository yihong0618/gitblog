# [running_page 开源一周年的总结](https://github.com/yihong0618/gitblog/issues/220)

## 前言

[running_page](https://github.com/yihong0618/running_page) 开源一周年了，虽然后面逐渐把精力放到了其他项目上，但还在维护着，无论是 issue 还是新需求也都第一时间去回复，感觉一个项目诞生但发展，像是看自己的孩子一样，喜怒哀乐。
当然，在程序上有一些进步的同时，带给我更大的收获是认识了好多好多跑步的朋友，程序上的朋友，能在帮到大家的同时还能交到一些志同道合的朋友，再把自己的东西回馈给社区，这也是我理解的开源的意义吧。

## 目前的一些数字

截止今天 2021-09-27

![image](https://user-images.githubusercontent.com/15976103/134852549-41b414d5-2bc3-4480-b7fc-9ee9a0689e35.png)

| Stars |  Fork  |  Issues | Contributors |
|  ----  |  ----   |  ----     |     -----          |
|   1391  |      278     |       99     |     30        |

## 诞生

- 我用 Runtastic 记录自己跑步 8 年多，后来 Runtastic 被大陆商店下架，我认识到了个人数据的重要性，把数据尝试导出，后来发现了 nike 也是通过一些手段能导出的，就想着自动化导出，备份自己的数据
- 发现了有人把自己的跑步数据 share 到自己博客上，发现非常漂亮，我参考着他的代码和设计，一边做一边学习 React, 最后把自己的数据也可视化上去了
- 最开始这只是个个人的网页，分享之后不断有人也想搭一个，我又基本都会回答，慢慢的觉得为了效率需要把他变成一个通用些的程序了，在 @geekplux 的鼓励下，就把他从中抽出来了，做的易用和通用了一些，就开源了
- 开源后在 twitter 上宣传，在 twitter 上认识了一些朋友的同时也有更多人加入进来
- 后来看到了 @laike9m 在 v2ex 上宣传他的项目，我也决定试试，没想到取得了大家的认可，项目的 stars 数慢慢增多，也越来越多的人用这个项目，当然后来一边做的同时一边学习逆向，搞定了其他的一些跑步软件，还写了一些心得。-- https://github.com/yihong0618/gitblog/issues/191  https://github.com/yihong0618/gitblog/issues/197 等等
- 再后来就是被阮一峰老师宣传，项目更多的 stars forks, 认识更多朋友，更多人参与进来，形成了良性的循环，也知道了因为这个项目一些人爱上了跑步，真的开心

## 循环

- 因为自己是被鼓励到参与到开源的，我想更多人加入这个项目，无论是初学者还是大牛，后来就想到，只要做出跑步主页的人都可以 share 自己的主页，我就鼓励大家提 pr, 其中有不少人是人生第一个 pr, 也慢慢懂了怎么加入开源。就像跑步的接力棒一样传下去。开心的是现在 share 的人一个屏幕已经放不下了。
- 前阵子看到 @antfu 的 [关于 Yak Shaving](https://antfu.me/posts/about-yak-shaving-zh) 的文章，深以为然。因为想把跑步部分抽出来做了 running_page, 因为 running_page 里的热力图比较受欢迎我又把其中的逻辑抽出来做的通用做了 [GitHubPoster](https://github.com/yihong0618/GitHubPoster) 回馈机核又做了 [gcores_calendar](https://github.com/yihong0618/gcores_calendar)，想到了可以减少 crontab 的消耗去研究配合[捷径自动化](https://github.com/yihong0618/gitblog/issues/198), 因此做了 [iBeats](https://github.com/yihong0618/iBeats) 等项目。。。也算是 yak shaving 了。 


[Runner's Page Show](https://github.com/yihong0618/running_page/issues/12)

| Runner                                          | page                                       | App       |
| ----------------------------------------------- | ------------------------------------------ | --------- |
| [shaonianche](https://github.com/shaonianche)   | https://run.duangfei.org                   | Nike      |
| [yihong0618](https://github.com/yihong0618)     | https://yihong.run/running                 | Nike      |
| [superleeyom](https://github.com/superleeyom)   | https://running.leeyom.top                 | Nike      |
| [geekplux](https://github.com/geekplux)         | https://activities.geekplux.com            | Nike      |
| [guanlan](https://github.com/guanlan)           | https://grun.vercel.app                    | Strava    |
| [tuzimoe](https://github.com/tuzimoe)           | https://run.tuzi.moe                       | Nike      |
| [ben_29](https://github.com/ben-29)             | https://running.ben29.xyz                  | Strava    |
| [kcllf](https://github.com/kcllf)               | https://running-tau.vercel.app             | Garmin-cn |
| [mq](https://github.com/MQ-0707)                | https://running-iota.vercel.app            | Keep      |
| [zhaohongxuan](https://github.com/zhaohongxuan) | https://running-page-psi.vercel.app        | Keep      |
| [yvetterowe](https://github.com/yvetterowe)     | https://run.haoluo.io                      | Strava    |
| [love-exercise](https://github.com/KaiOrange)   | https://run.kai666666.top                  | Keep      |
| [zstone12](https://github.com/zstone12)         | https://running-page.zstone12.vercel.app   | Keep      |
| [Lax](https://github.com/Lax)                   | https://lax.github.io/running              | Keep      |
| [lusuzi](https://github.com/lusuzi)             | https://running.lusuzi.vercel.app          | Nike      |
| [wh1994](https://github.com/wh1994)             | https://run4life.fun                       | Garmin    |
| [liuyihui](https://github.com/YiHui-Liu)        | https://run.foolishfox.cn                  | Keep      |
| [FrankSun](https://github.com/hi-franksun)      | https://hi-franksun.github.io/running_page | Nike      |
| [AhianZhang](https://github.com/AhianZhang)     | https://running.ahianzhang.com             | Keep      |
| [L1cardo](https://github.com/L1cardo)           | https://run.licardo.cn                     | Nike      |
| [luckylele666](https://github.com/luckylele666) | https://0000928.xyz                        | Strava    |
| [MFYDev](https://github.com/MFYDev)             | https://mfydev.run                         | Garmin-cn |
| [Jim Gao](https://github.com/tianheg)             | https://run.yidajiabei.xyz/ | Keep |
| [Eished](https://github.com/eished)             | https://run.iknow.fun                      | Keep      |

## 回忆

当然这一年经历了不少有意思的事儿。

- 因为做这个项目认识了一些自己曾经想都不敢想能有交集的牛人，看到财务自由的人的朋友圈感觉很有趣
- 收到了阿迪达斯的 DCMA....竟然还不是发给我的，是发给其中一个 fork, 我紧急下架了所有的 runtastic 相关的代码，有些遗憾，但没办法
- 其实我是很怕给国人丢人的，特别重视协议，即使很多是 mit 协议因为一些原因我也都会发邮件去询问下，认识了几个朋友的同时，也感叹好多欧洲人好 nice, 很多回复都是 free to do anything, 并且还有说其实是没协议的因为 mit 自由才选的 mit.
- 收到了一些感谢邮件，其中还成了一个同学的毕设项目
- 当然也有一些奇怪的人。。。相信每个开源作者都会遇到吧
- 有几个个朋友想捐款或者打赏捐赠项目，我拒绝了，还在后来加上了句--谢谢就够了。真不是我清高，而是这个项目和帮助我那些人比，和我 sponsor 那些人比真的不值一提，能帮到大家一句感谢我已经非常开心啦
- 因为这个项目回馈了很多项目 python-garmin strava-lib 等等等。

![image](https://user-images.githubusercontent.com/15976103/134856301-4c86e764-3b53-4758-84e5-c455a617a6c3.png)

## 感谢
- 感谢 @laike9m 的鼓励，@geekplux 的帮助和代码优化
- 感谢 @shaonianche 你帮忙的文档帮助到了我和大家
- Thank you very much for @flopp Without your encouragement and such a great project I would not be able to continue to participate in open source

## 特别感谢

所有贡献者和使用这个项目的人，希望大家一直跑下去，这个项目也一直 running 下去，也是 running_page 的意义

![image](https://user-images.githubusercontent.com/15976103/134856985-6dc150fa-d703-4e3c-b1b5-c910aa46cfa0.png)
