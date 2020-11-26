# [MongoDB存档](https://github.com/yihong0618/gitblog/issues/20)

### 为什么使用MongoDB

1. 宽松的数据形式非常灵活，易于拓展
2. MongoDB的数据是用JSON(Javascript Object Notation)存储的(就是上面的这种key-value的形式)，而几乎所有的web应用都是基于Javascript的。因此，存储的数据和应用的数据的格式是高度一致的，不需经过转换。
### 创建集合和删除集合（集合类似与table）
1. use database 直接创建（如果没有）
2. db.createCollection('author') 创建集合
3. show collections
4. db.author.drop()
### 插入
1. db.createCollection('movie')
```
2. db.movie.insert(
 {
   title: 'Forrest Gump', 
   directed_by: 'Robert Zemeckis',
   stars: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
   tags: ['drama', 'romance'],
   debut: new Date(1994,7,6,0,0),
   likes: 864367,
   dislikes: 30127,
   comments: [	
      {
         user:'user1',
         message: 'My first comment',
         dateCreated: new Date(2013,11,10,2,35),
         like: 0 
      },
      {
         user:'user2',
         message: 'My first comment too!',
         dateCreated: new Date(2013,11,11,6,20),
         like: 0 
      }
   ]
}
)
``` 
3. 可以同时插入多个数据（list）
### 查询
1. db.movie.find({'directed_by':'David Fincher'}).pretty()
2. db.movie.find({'directed_by':'David Fincher', 'stars':'Morgan Freeman'}).pretty()
```
3. db.movie.find(
{
  $or: 
     [  {'stars':'Robin Wright'}, 
        {'stars':'Morgan Freeman'}
     ]
}).pretty()
```
4. db.movie.find({'likes':{$gt:500000}}).pretty()
5. db.movie.findOne({'title':'Forrest Gump'})（一个结果）
6. db.movie.find().limit(2).skip(1).pretty()
### 局部查询（find的第二个参数）
1. db.movie.find({'tags':'drama'},{'debut':1,'title':1}).pretty()
### 更新
1. db.movie.update({title:'Seven'}, {$set:{likes:134371}})（第一个参数选择，第二个参数设置）
2. db.movie.update({title:'Seven'}, {$inc:{likes:2}})
3. db.movie.update({}, {$inc:{likes:10}},{multi:true})（默认只更新第一个，多个更新加个参数）
4. db.movie.update({'title':'Seven'}, {$push:{'tags':'popular'}})（在原来的基础上增加值）
### 删除
1. db.movie.remove({'tags':'romance'})
2. db.movie.remove({'tags':'romance'},1)（只想删除第一个）
3. db.movie.remove({})
4. db.movie.deleteOne() ,b.movie.deleteMany()(目前官方推荐)
### 索引和排序
1. db.movie.ensureIndex({directed_by:1})
2. db.movie.find().sort({'title':1}).pretty()
3. db.movie.dropIndex('index_name')
### 聚合
1. db.movie.aggregate([{$group:{_id:'$grade'}}])
2. db.movie.aggregate([{$group:{_id:'$directed_by',num_movie:{$sum:1}}}])
3. db.movie.aggregate([{$group:{_id:'$directed_by',num_likes:{$sum:'$likes'}}}])
4. db.movie.aggregate([{$group:{_id:'$directed_by',num_movie:{$avg:'$likes'}}}])
5. db.movie.aggregate([{$group:{_id:'$directed_by',num_movie:{$first:'$likes'}}}])
### 原子话
```
1. db.movie.findAndModify(
			{
			query:{'title':'Forrest Gump'},
			update:{$inc:{likes:10}}
			}
		      )
```
### 文本搜索
1. db.movie.ensureIndex({title:'text'}) （创建）
2. db.movie.find({$text:{$search:"Gump"}}).pretty() （搜索）
### 正则表达式
1. db.movie.find({title:{$regex:'.*b$'}}).pretty()

---

## 2019.08.12
---
花两块钱买的文章。。。
![image](https://user-images.githubusercontent.com/15976103/62844452-0dbc5800-bcf4-11e9-906b-6900c733bad6.png)

### ObjectId
ObjectId 具有生成快、占用小、可排序和值唯一等特点，它的值由 12 个字节组成，其中前 4 个 字节描述的是创建的时间戳。ObjectId 的组成如下：
```
[Unix 纪元以来的秒数 4字节][随机值 5字节][计数器 3字节]
```

