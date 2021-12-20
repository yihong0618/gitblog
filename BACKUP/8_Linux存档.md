# [Linux存档](https://github.com/yihong0618/gitblog/issues/8)

停止多个相同images的docker 
```shell
docker stop $(docker ps | grep python | awk 'NR > 1 {print $1}'|xargs)
```
Find命令用法
```powershell
- 列出当前目录以及子目录下的所有文件
  find .
- 找到当前目录下名字为11.png的文件
  find . -name "11.png"
- 找到当前目录下所有的jpg文件
  find . -name "*.jpg"
- 找到当前目录下的jpg文件和png文件
  find . -name "*.jpg" -o -name "*.png"
- 找到当前目录下，文件名都是数字的png文件。
  find . -regex "\./*[0-9]+\.png" 
- 举例，找出1天内被修改过的文件
  find . -type f -mtime -1
- 看下实际例子。删除当前目录下所有的js文件。用-ok的效果如下，删除前有二次确认
  find . -type f -name "*.js" -ok rm {} "rm ./1.js"? 
```
mv配合grep移动
```shell
On OS X:
ls file_* | xargs -J {} mv {} temp/
On Linux:
ls file_* | xargs -i {} mv {} temp/
```
mkdir 同时创建子目录
```shell
mkdir -p letter/important
```

---

```shell
# 字符串中数字排序
sort -V
# 倒序
sort -Vr
```

---

```shell
# 显示全部已定义的别名
alias
alias -p
# 显示已定义的别名（假设当前环境存在以下别名）
alias ls
alias ls grep

# 定义或修改别名的值
alias ls='ls --color=auto'
alias ls='ls --color=never' grep='grep --color=never'
```
直接在shell里设定的命令别名，在终端关闭或者系统重新启动后都会失效，如何才能永久有效呢？

使用编辑器打开~/.bashrc，在文件中加入别名设置，如：alias rm='rm -i'，保存后执行source ~/.bashrc，这样就可以永久保存命令的别名了。

因为修改的是当前用户目录下的~/.bashrc文件，所以这样的方式只对当前用户有用。如果要对所有用户都有效，修改/etc/bashrc文件就可以了。


---

## 如何加入开机自启动脚本
1. Create a script and place in /etc/init.d (e.g /etc/init.d/myscript). The script should have the following format:
```shell
#!/bin/bash
# chkconfig: 2345 20 80
# description: Description comes here....

# Source function library.
. /etc/init.d/functions

start() {
    # code to start app comes here 
    # example: daemon program_name &
}

stop() {
    # code to stop app comes here 
    # example: killproc program_name
}

case "$1" in 
    start)
       start
       ;;
    stop)
       stop
       ;;
    restart)
       stop
       start
       ;;
    status)
       # code to check status of app comes here 
       # example: status program_name
       ;;
    *)
       echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 
```
2. Enable the script
```
$ chkconfig --add myscript 
$ chkconfig --level 2345 myscript on 
```
3. Check the script is indeed enabled - you should see "on" for the levels you selected.
```
$ chkconfig --list | grep myscript
```

---

docker开启自动启动

systemctl enable docker

---

Linux查看开机启动项
systemctl list-unit-files

---

tar 使用
```shell
压缩
tar -zcvf test.tar.gz test
解压缩
tar -zxvf file.tar.gz
```

---

[An Introduction To Data Science On The Linux Command Line](https://blog.robertelder.org/data-science-linux-command-line/)
- grep
- sed
- awk
- sort
- comm
- uniq
- tr
- cat
- head
- tail
- wc
- find
- tsort
- tee

---

### 查看系统启动时间
```shell
who -b
```

---

Ctrl+a跳到本行的行首，
Ctrl+e则跳到页尾。
Ctrl+u删除当前光标前面的文字
ctrl+k-删除当前光标后面的文字
Ctrl+w和Alt+d-对于当前的单词进行删除操作，w删除光标前面的单词的字符，d则删除后面的字符
Alt+Backsapce-删除当前光标后面的单词，
如果删除错误，使用Ctrl+y进行恢复Ctrl+L进行清屏操作

ctrl+a:光标移到行首。
ctrl+b:光标左移一个字母
ctrl+c:杀死当前进程。
ctrl+d:退出当前 Shell。
ctrl+e:光标移到行尾。
ctrl+h:删除光标前一个字符，同 backspace 键相同。
ctrl+k:清除光标后至行尾的内容。
ctrl+l:清屏，相当于clear。
ctrl+r:搜索之前打过的命令。会有一个提示，根据你输入的关键字进行搜索bash的history
ctrl+u: 清除光标前至行首间的所有内容。
ctrl+w: 移除光标前的一个单词
ctrl+t: 交换光标位置前的两个字符
ctrl+y: 粘贴或者恢复上次的删除
ctrl+d: 删除光标所在字母;注意和backspace以及ctrl+h的区别，这2个是删除光标前的字符
ctrl+f: 光标右移
ctrl+z : 把当前进程转到后台运行，使用’ fg ‘命令恢复。比如top -d1 然后ctrl+z ，到后台，然后fg,重新恢复
esc组合
esc+d: 删除光标后的一个词
esc+f: 往右跳一个词
esc+b: 往左跳一个词
esc+t: 交换光标位置前的两个单词。

---

[open port centos](https://stackoverflow.com/questions/19034542/how-to-open-port-in-centos)

---


step 1

firewall-cmd --zone=public --permanent --add-port=8080/tcp
Step 2

firewall-cmd --reload

---

重命名技巧
mv foo-bar-{baz,quux}.txt
cat 写文件

cat > a.txt


---

3步骤增加免密登录
https://www.thegeekstuff.com/2008/11/3-steps-to-perform-ssh-login-without-password-using-ssh-keygen-ssh-copy-id/

---

按行安装直接忽略错误
cat requirements.txt | while read PACKAGE; do pip install "$PACKAGE"; done

---

文件夹内查找
grep -R "test" ./data

---

给所有文件夹添加文件
```sh
find . -type d -exec touch {}/__init__.py  \;
```

---

批量更改
```sh
grep -rl '#049fd9' django/ | xargs sed -i 's/#049fd9/rgba\(13, 39, 77, 1\)/g'
```

---

wsl的一些相关命令

wsl --set-version Ubuntu 2
网络
netsh interface portproxy add v4tov4 listenport=4000 listenaddress=0.0.0.0 connectport=4000 connectaddress=192.168.101.100

https://docs.microsoft.com/en-us/windows/wsl/compare-versions

https://www.sitepoint.com/wsl2/

---

fucking wsl2
https://github.com/microsoft/WSL/issues/5068

---

用户

https://www.digitalocean.com/community/questions/nothing-working-for-non-root-user

sudo problem
usermod -a -G sudo user
or
usermod -a -G wheel user 