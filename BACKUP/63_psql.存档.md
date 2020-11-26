# [psql 存档](https://github.com/yihong0618/gitblog/issues/63)

2019.10.11
```sql
创建用户
postgres=# CREATE USER dbuser WITH PASSWORD '*****'
创建database
could not flush dirty data: Function not implemented
```

---

pg_dump -h 10.48.69.108 -U matrix_bgp etis_db --data-only > /var/lib/postgresql/data/tmp/sql.sql