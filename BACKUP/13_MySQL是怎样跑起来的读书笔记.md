# [MySQL是怎样跑起来的读书笔记](https://github.com/yihong0618/gitblog/issues/13)

## 第一份读书笔记每天学到的写在评论里吧

- 2019年8月1日开始
- 准备每天看30分钟左右
- 把自己的理解都总结在评论里
- 开头标上日期
---

---

## 2019.08.01
### MySQL大致查询过程
![image](https://user-images.githubusercontent.com/15976103/62258796-74ad5780-b43e-11e9-9dcf-3b8e5fe8b0da.png)
### 储蓄引擎
```SQL
SHOW ENGINES;
CREATE TABLE 表名(
    建表语句;
) ENGINE = 存储引擎名称;
```

---

## 2019.08.02
### 启动选项和配置文件
```mysql
mysql> SHOW VARIABLES LIKE 'default_storage_engine';
+------------------------+--------+
| Variable_name          | Value  |
+------------------------+--------+
| default_storage_engine | InnoDB |
+------------------------+--------+
1 row in set (0.01 sec)

mysql> SHOW VARIABLES like 'max_connections';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_connections | 151   |
+-----------------+-------+
1 row in set (0.00 sec)
```




---

## 2019.08.06

> 小贴士： 其实准确的说，utf8只是Unicode字符集的一种编码方案，Unicode字符集可以采用utf8、utf16、utf32这几种编码方案，utf8使用1～4个字节编码一个字符，utf16使用2个或4个字节编码一个字符，utf32使用4个字节编码一个字符。更详细的Unicode和其编码方案的知识不是本书的重点，大家上网查查哈～ MySQL中并不区分字符集和编码方案的概念，所以后边唠叨的时候把utf8、utf16、utf32都当作一种字符集对待。

### MySQL中的utf8和utf8mb4
我们上边说utf8字符集表示一个字符需要使用1～4个字节，但是我们常用的一些字符使用1～3个字节就可以表示了。而在MySQL中字符集表示一个字符所用最大字节长度在某些方面会影响系统的存储和性能，所以设计MySQL的大叔偷偷的定义了两个概念：

utf8mb3：阉割过的utf8字符集，只使用1～3个字节表示字符。
utf8mb4：正宗的utf8字符集，使用1～4个字节表示字符。

有一点需要大家十分的注意，在MySQL中utf8是utf8mb3的别名，所以之后在MySQL中提到utf8就意味着使用1~3个字节来表示一个字符，如果大家有使用4字节编码一个字符的情况，比如存储一些emoji表情啥的，那请使用utf8mb4。

### 字符发送过程
![image](https://user-images.githubusercontent.com/15976103/62525494-1af7c380-b86a-11e9-957f-e4aff92c48fe.png)




---

## 2019.08.07
### InnoDB记录存储结构
InnoDB存储引擎需要一条一条的把记录从磁盘上读出来么？不，那样会慢死，InnoDB采取的方式是：将数据划分为若干个页，以页作为磁盘和内存之间交互的基本单位，InnoDB中页的大小一般为 16 KB。也就是在一般情况下，一次最少从磁盘中读取16KB的内容到内存中，一次最少把内存中的16KB内容刷新到磁盘中。
![image](https://user-images.githubusercontent.com/15976103/62586823-d0ba2500-b8f1-11e9-9673-ce2e8e0757b1.png)
这里需要提一下InnoDB表对主键的生成策略：优先使用用户自定义主键作为主键，如果用户没有定义主键，则选取一个Unique键作为主键，如果表中连Unique键都没有定义的话，则InnoDB会为表默认添加一个名为row_id的隐藏列作为主键。所以我们从上表中可以看出：InnoDB存储引擎会为每条记录都添加 transaction_id 和 roll_pointer 这两个列，但是 row_id 是可选的（在没有自定义主键以及Unique键的情况下才会添加该列）。这些隐藏列的值不用我们操心，InnoDB存储引擎会自己帮我们生成的。



---

## 2019.08.08
### InnoDB数据页结构
![image](https://user-images.githubusercontent.com/15976103/62680217-4bb23700-b9e9-11e9-9c4c-d6cfd9c213b9.png)
InnoDB为了不同的目的而设计了不同类型的页，我们把用于存放记录的页叫做数据页。

3. 一个数据页可以被大致划分为7个部分，分别是

File Header，表示页的一些通用信息，占固定的38字节。
Page Header，表示数据页专有的一些信息，占固定的56个字节。
Infimum + Supremum，两个虚拟的伪记录，分别表示页中的最小和最大记录，占固定的26个字节。
User Records：真实存储我们插入的记录的部分，大小不固定。
Free Space：页中尚未使用的部分，大小不确定。
Page Directory：页中的某些记录相对位置，也就是各个槽在页面中的地址偏移量，大小不固定，插入的记录越多，这个部分占用的空间越多。
File Trailer：用于检验页是否完整的部分，占用固定的8个字节。
每个记录的头信息中都有一个next_record属性，从而使页中的所有记录串联成一个单链表。

4. InnoDB会为把页中的记录划分为若干个组，每个组的最后一个记录的地址偏移量作为一个槽，存放在Page Directory中，所以在一个页中根据主键查找记录是非常快的，分为两步：

通过二分法确定该记录所在的槽。

通过记录的next_record属性遍历该槽所在的组中的各个记录。

5. 每个数据页的File Header部分都有上一个和下一个页的编号，所以所有的数据页会组成一个双链表。

6. 为保证从内存中同步到磁盘的页的完整性，在页的首部和尾部都会存储页中数据的校验和和页面最后修改时对应的LSN值，如果首部和尾部的校验和和LSN值校验不成功的话，就说明同步过程出现了问题。



---

## 2019.08.09
### B+树索引
![image](https://user-images.githubusercontent.com/15976103/62752200-0b11f680-ba99-11e9-8be1-5798ba15b806.png)
![image](https://user-images.githubusercontent.com/15976103/62752284-6f34ba80-ba99-11e9-945a-d25ff584b8b2.png)


---

## 2019.08.12
### B+树索引的使用
1. 索引的代价
- 空间的代价（每建立一个索引都要为它建立一棵B+树，每一棵B+树的每一个节点都是一个数据页，一个页默认会占用16KB的存储空间）
- 时间的代价（每次对表中的数据进行增、删、改操作时，都需要去修改各个B+树索引。而且我们讲过，B+树每层节点都是按照索引列的值从小到大的顺序排序而组成了双向链表。不论是叶子节点中的记录，还是内节点中的记录（也就是不论是用户记录还是目录项记录）都是按照索引列的值从小到大的顺序而形成了一个单向链表。而增、删、改操作可能会对节点和记录的排序造成破坏，所以存储引擎需要额外的时间进行一些记录移位，页面分裂、页面回收啥的操作来维护好节点和记录的排序。）
2. B+树索引适用的条件
```mysql
CREATE TABLE person_info(
    id INT NOT NULL auto_increment,
    name VARCHAR(100) NOT NULL,
    birthday DATE NOT NULL,
    phone_number CHAR(11) NOT NULL,
    country varchar(100) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_name_birthday_phone_number (name, birthday, phone_number)
);
```
![image](https://user-images.githubusercontent.com/15976103/62847388-a3fa7900-bd08-11e9-9f61-a8ba2f3e8914.png)
3. 回表的代价
```mysql
SELECT * FROM person_info WHERE name > 'Asa' AND name < 'Barlow';
```
在使用idx_name_birthday_phone_number索引进行查询时大致可以分为这两个步骤：

- 从索引idx_name_birthday_phone_number对应的B+树中取出name值在Asa～Barlow之间的用户记录。

- 由于索引idx_name_birthday_phone_number对应的B+树用户记录中只包含name、birthday、phone_number、id这4个字段，而查询列表是*，意味着要查询表中所有字段，也就是还要包括country字段。这时需要把从上一步中获取到的每一条记录的id字段都到聚簇索引对应的B+树中找到完整的用户记录，也就是我们通常所说的回表，然后把完整的用户记录返回给查询用户。
4. 如何挑选索引
- 只为用于搜索、排序或分组的列创建索引
- 考虑列的基数（出现次数，阅读越好）
- 索引列的类型尽量小
- 索引字符串值的前缀（我们前边儿说过索引列的字符串前缀其实也是排好序的，所以索引的设计者提出了个方案 --- 只对字符串的前几个字符进行索引也就是说在二级索引的记录中只保留字符串前几个字符。这样在查找记录时虽然不能精确的定位到记录的位置，但是能定位到相应前缀所在的位置，然后根据前缀相同的记录的主键值回表查询完整的字符串值，再对比就好了。）
```mysql
CREATE TABLE person_info(
    name VARCHAR(100) NOT NULL,
    birthday DATE NOT NULL,
    phone_number CHAR(11) NOT NULL,
    country varchar(100) NOT NULL,
    KEY idx_name_birthday_phone_number (name(10), birthday, phone_number)
);  
```
- 让索引列在比较表达式中单独出现(表达式用不到索引)
- 冗余和重复索引

---

## 2019.08.13
### MySQL 的数据目录
1. 如何确定MySQL中的数据目录（数据目录和安装目录是两个概念）
```mysql
mysql> SHOW VARIABLES LIKE 'datadir';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| datadir       | /usr/local/var/mysql/ |
+---------------+-----------------------+
1 row in set (0.00 sec)
```
2. MySQL系统数据库简介
- mysql (这个数据库贼核心，它存储了MySQL的用户账户和权限信息，一些存储过程、事件的定义信息，一些运行过程中产生的日志信息，一些帮助信息以及时区信息等。)
- information_schema (这个数据库保存着MySQL服务器维护的所有其他数据库的信息，比如有哪些表、哪些视图、哪些触发器、哪些列、哪些索引吧啦吧啦。这些信息并不是真实的用户数据，而是一些描述性信息，有时候也称之为元数据。)
- performance_schema(这个数据库里主要保存MySQL服务器运行过程中的一些状态信息，算是对MySQL服务器的一个性能监控。包括统计最近执行了哪些语句，在执行过程的每个阶段都花费了多长时间，内存的使用情况等等信息。)
- sys (这个数据库主要是通过视图的形式把information_schema和performance_schema结合起来，让程序员可以更方便的了解MySQL服务器的一些性能信息。)


---

## 2019.08.14
![image](https://user-images.githubusercontent.com/15976103/62989813-1fc90280-be7c-11e9-893c-98a60ad67420.png)
