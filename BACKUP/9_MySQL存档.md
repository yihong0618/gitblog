# [MySQL存档](https://github.com/yihong0618/gitblog/issues/9)

1. 更改字段类型
``` MySQL
ALTER  TABLE 表名 MODIFY COLUMN 字段名 新数据类型 新类型长度  新默认值  新注释;
```
2. 修改字段名
```MySQL
ALTER  TABLE 表名 CHANGE 旧字段名 新字段名 新数据类型;
```
3. 添加字段
```MySQL
ALTER TABLE 表名 ADD 字段 类型 其他;
```

---

看到了一张图，记录一下
![image](https://user-images.githubusercontent.com/15976103/62431444-31aef500-b75a-11e9-8ea8-ab3a6c3d26d6.png)
