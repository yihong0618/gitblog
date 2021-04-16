# [Python存档](https://github.com/yihong0618/gitblog/issues/43)

## 竟然才加上Python--2019.9.30
1. lstrip
2. partition 返回元祖（3个成员）

---

Python 打开一个不存在的文件往里写用
```python
with open("abaaa.txt", "w+") as f:
    f.write("aaaaaaaaaaaaaaa")
```

---

django celery && celery 启动命令
```python
python manage.py celery -A matrix_bgp worker --settings=
python manage.py celery beat --settings=
```

---

```python
>>>str = 'runoob'
>>> str.center(20, '*')
'*******runoob*******'
>>> str.center(20)
'       runoob       '
```

---

pip version 
19.2.3

---

字符串报错
https://www.cnblogs.com/lsdb/p/12470739.html

---

如何发布一个package到PyPI
https://haofly.net/how-to-publish-python-package-md/

---

nametuple尽量小写否则有坑。

---

python 打包上传pypi

首先安装上传工具
pip3 install -U pip setuptools twine

打包
python3 setup.py sdist	# 会将项目打包到当前目录下面并生成相应的egg

上传
twine upload dist/*		# 其实就是上传的dist目录下的zip包

---

python -c "import site; print(site.getsitepackages())"