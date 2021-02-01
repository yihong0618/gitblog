# [LeetCode 的 Python 程序是如何运行的。](https://github.com/yihong0618/gitblog/issues/205)

### 初：
一般刚大家刷 LeetCode 难免好奇为什么会自动生成个 class Solution: 点击提交后台就能直接运行。虽然我们不能拿到 LeetCode 的源码，但是经过初步尝试，我发现，我们是能通过一定手段搞清楚 LeetCode 是如何提交运行的。

![image](https://user-images.githubusercontent.com/15976103/106418054-60617500-6490-11eb-92c8-b940b56ce531.png)

### 起因：

某天一位群友发了个问题，他有个地方 typo 把小写的 l 写成大写的 L, LeetCode 竟然能编译通过，代码如下:
```python
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        res = []
        if (not nums or n <3):
            return []
        for i in range(n):
            if nums[i] > 0:
                return res
            if i > 0 and nums[i] == [i-1]:
                continue
            l = i + 1
            r = n - 1
            while l < r:
                if (nums[i] + nums[l] + nums[r]) == 0:
                    res.append([nums[i], nums[l], nums[r]])
                    while L < r and nums[l] == nums[l+1]:  # 此处写成了大写的 L
                        l = l + 1
                    while L < r and nums[r] = nums[r-1]:
                        r = r-1
                    l = l + 1
                    r = r - 1
                elif (nums[i] + nums[l] + nums[r]) > 0:
                    r = r - 1
                else:
                    l = l + 1
        return res
```
接下来有人回复，是因为 LeetCode 从 re 中 import * 导致了 L 是个全局变量，这个 L 的值是 4. 证明如下图:
![image](https://user-images.githubusercontent.com/15976103/106418536-88050d00-6491-11eb-9393-67745a910821.png)

可见，这个 L 是 re 里的 re.LOCALE
![image](https://user-images.githubusercontent.com/15976103/106418616-bedb2300-6491-11eb-9e3c-87ecf979d234.png)

### 探索

那么我们就可以好奇下，LeetCode 都导入了哪些默认的包呢。有哪些是 import * 呢 ?

直接 print globals() 发现是 copyright, 至于为啥是这个 copyright, 好奇的同学可以查一下，挺有趣的。
![image](https://user-images.githubusercontent.com/15976103/106419165-d23abe00-6492-11eb-8f4d-4355f250fc65.png)
于是尝试下 print globals().keys(), 嗯，LeetCode 默认导入了相当多的模块，很多是 import *, Python 解析速度慢，也不奇怪了。
![image](https://user-images.githubusercontent.com/15976103/106419271-15952c80-6493-11eb-9192-7618b7769d65.png)
再尝试下用 sys 模块打印 import
![image](https://user-images.githubusercontent.com/15976103/106419347-44130780-6493-11eb-9838-a123d07b8dd1.png)

**知道这个之后，大家刷题可以不用在 collections 里导入包了**

### 继续探索

那么，既然他们好多模块是默认导入的，比如比较危险的 sys 和 os 模块，那么我们是否能做点什么呢？
1. 尝试看源码，简单粗暴直接 listdir, 发现当前文件夹里有三个文件，而 / 中有 `leetcode` 和 `dockerenv` 和猜想的一样，LeetCode 是用 docker 运行程序的
![image](https://user-images.githubusercontent.com/15976103/106419541-a5d37180-6493-11eb-92f1-fd29d4402e16.png)
2. 那么我们看看这个 precompiled 有什么呢，发现了一些 .pyc 文件，这个后续再用
3. 继续 listdir 找我们需要的，最后在 `/mnt` 找到了 `.py` 文件，我们看看是啥。

很好，破案了。
![image](https://user-images.githubusercontent.com/15976103/106420010-b89a7600-6494-11eb-88f6-e67510a25176.png)

具体代码如下: 原来 LeetCode 看似神秘的程序运行构造也并不复杂。
```python
# coding: utf-8
from string import *
from re import *
from datetime import *
from collections import *
from heapq import *
from bisect import *
from copy import *
from math import *
from random import *
from statistics import *
from itertools import *
from functools import *
from operator import *
from io import *
from sys import *
from json import *
from builtins import *

import string
import re
import datetime
import collections
import heapq
import bisect
import copy
import math
import random
import statistics
import itertools
import functools
import operator
import io
import sys
import json

import precompiled.__settings__
from precompiled.__deserializer__ import __Deserializer__
from precompiled.__deserializer__ import DeserializeError
from precompiled.__serializer__ import __Serializer__
from precompiled.__utils__ import __Utils__
from precompiled.listnode import ListNode
from precompiled.nestedinteger import NestedInteger
from precompiled.treenode import TreeNode

from typing import *

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# user submitted code insert below
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        print(os.listdir("/mnt"))
        with open("/mnt/prog_joined.py") as f:
            print(f.read())
import sys
import os
import ujson as json

def _driver():

    des = __Deserializer__()
    ser = __Serializer__()
    SEPARATOR = "\x1b\x09\x1d"
    f = open("user.out", "wb", 0)
    lines = __Utils__().read_lines()

    while True:
        line = next(lines, None)
        if line == None:
            break
        param_1 = des._deserialize(line, 'ListNode')
        
        line = next(lines, None)
        if line == None:
            raise Exception("Testcase does not have enough input arguments. Expected argument 'l2'")
        param_2 = des._deserialize(line, 'ListNode')
        
        ret = Solution().addTwoNumbers(param_1, param_2)
        try:
            out = ser._serialize(ret, 'ListNode')
        except:
            raise TypeError(str(ret) + " is not valid value for the expected return type ListNode");
        out = str.encode(out + '\n')
        f.write(out)
        sys.stdout.write(SEPARATOR)


if __name__ == '__main__':
    _driver()
```
至于下图中的这些是什么？LeetCode 其实在里面放的是 pyc 文件，但是大部分 pyc 是能转换回来的，通过一些手段，这个留给大家感兴趣自己研究哈哈。
![image](https://user-images.githubusercontent.com/15976103/106420161-044d1f80-6495-11eb-82d7-1e1346cf5510.png)

### 后续

理论上其它语言可以用同样的思路。至于其它好玩的事情，大家可以自行发掘（笑）。












