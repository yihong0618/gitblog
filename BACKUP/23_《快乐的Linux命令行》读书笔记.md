# [《快乐的Linux命令行》读书笔记](https://github.com/yihong0618/gitblog/issues/23)

新坑 2019.08.12开始
地址：[快乐的Linux命令行](http://billie66.github.io/TLCL/book/)

- [ ] 读完
- [ ] 顺便记录一些英语单词
- [ ] 编写一些脚本程序 

---

## 2019.08.12
### 常用命令的英语
- pwd - Print name of current working directory
- cd - Change directory
- ls - List directory 
- file – Determine file type
- less – View file contents
```shell
-rw-r--r-- 1 root root 3576296 2007-04-03 11:05 Experience ubuntu.ogg
-rw-r--r-- 1 root root 1186219 2007-04-03 11:05 kubuntu-leaflet.png
-rw-r--r-- 1 root root   47584 2007-04-03 11:05 logo-Edubuntu.png
-rw-r--r-- 1 root root   44355 2007-04-03 11:05 logo-Kubuntu.png
-rw-r--r-- 1 root root   34391 2007-04-03 11:05 logo-Ubuntu.png
-rw-r--r-- 1 root root   32059 2007-04-03 11:05 oo-cd-cover.odf
-rw-r--r-- 1 root root  159744 2007-04-03 11:05 oo-derivatives.doc
-rw-r--r-- 1 root root   27837 2007-04-03 11:05 oo-maxwell.odt
-rw-r--r-- 1 root root   98816 2007-04-03 11:05 oo-trig.xls
-rw-r--r-- 1 root root  453764 2007-04-03 11:05 oo-welcome.odt
-rw-r--r-- 1 root root  358374 2007-04-03 11:05 ubuntu Sax.ogg
```

Field | Meaning
-- | --
-rw-r--r-- | Access rights to the file. The first character indicates the type of file. Among the different types, a leading dash means a regular file, while a “d” indicates a directory. The next three characters are the access rights for the file's owner, the next three are for members of the file's group, and the final three are for everyone else. The full meaning of this is discussed in Chapter 10 – Permissions.
1 | File's number of hard links. See the discussion of links later in this chapter.
root | The user name of the file's owner.
root | The name of the group which owns the file.
32059 | Size of the file in bytes.
2007-04-03 11:05 | Date and time of the file's last modification.
oo-cd-cover.odf | Name of the file.
### 常用目录
Drectory | Comments
-- | --
/ | The root directory.Where everything begins.
/bin | Contains binaries (programs) that must be present for the system to boot and run.
/boot | Contains the linux kernel, intial RAM disk image (for drivers needed at boot time), and the boot loader.Interesting files:/boot/grub/grub.conf or menu.lst, which are used to configure the boot loader./boot/vmlinuz,the linux kernel.
/dev | This is a special directory which contains device nodes. "Everything is a file" also applies to devices. Here is where the kernel maintains a list of all the devices it understands.
/etc | The /etc directory contains all of the system-wide configuration files. It also contains a collection of shell scripts which start each of the system services at boot time. Everything in this directory should be readable text.Interesting files:While everything in /etc is interesting, here are some of my all-time favorites:/etc/crontab, a file that defines when automated jobs will run./etc/fstab, a table of storage devices and their associated mount points./etc/passwd, a list of the user accounts.
/home | In normal configurations, each user is given a directory in /home. Ordinary users can only write files in their home directories. This limitation protects the system from errant user activity.
/lib | Contains shared library files used by the core system programs. These are similar to DLLs in Windows.
/lost+found | Each formatted partition or device using a Linux file system, such as ext3, will have this directory. It is used in the case of a partial recovery from a file system corruption event. Unless something really bad has happened to your system, this directory will remain empty.
/media | On modern Linux systems the /media directory will contain the mount points for removable media such USB drives, CD-ROMs, etc. that are mounted automatically at insertion.
/mnt | On older Linux systems, the /mnt directory contains mount points for removable devices that have been mounted manually.
/opt | The /opt directory is used to install “optional” software. This is mainly used to hold commercial software products that may be installed on your system.
/proc | The /proc directory is special. It's not a real file system in the sense of files stored on your hard drive. Rather, it is a virtual file system maintained by the Linux kernel. The “files” it contains are peepholes into the kernel itself. The files are readable and will give you a picture of how the kernel sees your computer.
/root | This is the home directory for the root account.
/sbin | This directory contains “system” binaries. These are programs that perform vital system tasks that are generally reserved for the superuser.
/tmp | The /tmp directory is intended for storage of temporary, transient files created by various programs. Some configurations cause this directory to be emptied each time the system is rebooted.
/usr | The /usr directory tree is likely the largest one on a Linux system. It contains all the programs and support files used by regular users.
/usr/bin | /usr/bin contains the executable programs installed by your Linux distribution. It is not uncommon for this directory to hold thousands of programs.
/usr/lib | The shared libraries for the programs in /usr/bin.
/usr/local | The /usr/local tree is where programs that are not included with your distribution but are intended for system- wide use are installed. Programs compiled from source code are normally installed in /usr/local/bin. On a newly installed Linux system, this tree exists, but it will be empty until the system administrator puts something in it.
/usr/sbin | Contains more system administration programs.
/usr/share | /usr/share contains all the shared data used by programs in /usr/bin. This includes things like default configuration files, icons, screen backgrounds, sound files, etc.
/usr/share/doc | Most packages installed on the system will include some kind of documentation. In /usr/share/doc, we will find documentation files organized by package.
/var | With the exception of /tmp and /home, the directories we have looked at so far remain relatively static, that is, their contents don't change. The /var directory tree is where data that is likely to change is stored. Various databases, spool files, user mail, etc. are located here.
/var/log | /var/log contains log files, records of various system activity. These are very important and should be monitored from time to time. The most useful one is /var/log/messages. Note that for security reasons on some systems, you must be the superuser to view log files.



---

## 2019.08.13
### 到底什么是命令--命令可以是下面4种形式(用type判断类型)
1. An executable program like all those files we saw in /usr/bin. Within this category, programs can be compiled binaries such as programs written in C and C++, or programs written in scripting languages such as the shell, perl, python, ruby, etc.

2. A command built into the shell itself. bash supports a number of commands internally called shell builtins. The cd command, for example, is a shell builtin.

3. A shell function. These are miniature shell scripts incorporated into the environment. We will cover configuring the environment and writing shell functions in later chapters, but for now, just be aware that they exist.

4. An alias. Commands that we can define ourselves, built from other commands.

### IO命令
- cat - Concatenate files
- sort - Sort lines of text
- uniq - Report or omit repeated lines
- grep - Print lines matching a pattern
- wc - Print newline, word, and byte counts for each file
- head - Output the first part of a file
- tail - Output the last part of a file
- tee - Read from standard input and write to standard output and files

### 标准输出重定向
- I/O 重定向允许我们来重定义标准输出的地点。我们使用 “>” 重定向符后接文件名将标准输出重定向到除屏幕 以外的另一个文件。为什么我们要这样做呢？因为有时候把一个命令的运行结果存储到 一个文件很有用处。例如，我们可以告诉 shell 把 ls 命令的运行结果输送到文件 ls-output.txt 中去， 由文件代替屏幕。 （ > ls-output.txt 清空文件）
-  追加用“>>”**ls -l /usr/bin >> ls-output.txt**
- 标准错误重定向没有专用的重定向操作符。为了重定向标准错误，我们必须参考其文件描述符。 一个程序可以在几个编号的文件流中的任一个上产生输出。虽然我们已经将这些文件流的前 三个称作标准输入、输出和错误，shell 内部分别将其称为文件描述符0、1和2。shell 使用文件描述符提供 了一种表示法来重定向文件。因为标准错误和文件描述符2一样，我们用这种 表示法来重定向标准错误：**ls -l /bin/usr 2> ls-error.txt** 
- 重定向标准和错误 **ls -l /bin/usr &> ls-output.txt**
- cat输入 **cat > lazy_dog.txt**

---

## 2019.08.14
1. echo [[:upper:]]*
2. echo $((2 + 2)) --(表达式)--((expression))
3. echo $(($((5**2)) * 3)) （嵌套）
4. echo Front-{A,B,C}-Back （花括号展开）
5. echo a{A{1,2},B{3,4}}b （花括号展开嵌套）
6. mkdir {2007..2009}-0{1..9} {2007..2009}-{10..12} （创建目录）
7. printenv | less （变量列表）
8. 双引号  （echo "$USER $((2+2)) $(cal)" 展开依然有效 echo "this is a    test"）
9. 单引号 （禁止所有的展开，我们要使用单引号）
10. 转义字符




---

2019.10.2
好久没看了，下一步把这个看完顺便试试github hook