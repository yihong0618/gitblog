# [docker存档](https://github.com/yihong0618/gitblog/issues/81)

docker 拷贝文件

{host} docker run -v /path/to/hostdir:/mnt --name my_container my_image
{host} docker exec -it my_container bash
{container} cp /mnt/sourcefile /path/to/destfile
---
docker cp foo.txt mycontainer:/foo.txt

---

# Backup
docker exec CONTAINER /usr/bin/mysqldump -u root --password=root DATABASE > backup.sql

# Restore
cat backup.sql | docker exec -i CONTAINER /usr/bin/mysql -u root --password=root DATABASE

---

1. docker 可以update
https://docs.docker.com/engine/reference/commandline/update/
2. docker update端口
```docker
docker stop test01
docker commit test01 test02
docker run -p 8080:8080 -td test02
```

---

更改全部为restart-always
```shell
docker container update --restart=always $(docker inspect -f "{{print .Config.Hostname ' ' .HostConfig.RestartPolicy }}" $(docker ps | awk '{print $1}' | xargs) | awk '/no/ {print substr($1,0,10)}' )
```

---

https://stackoverflow.com/questions/19335444/how-do-i-assign-a-port-mapping-to-an-existing-docker-container 
给已存在的container 增加一个端口映射