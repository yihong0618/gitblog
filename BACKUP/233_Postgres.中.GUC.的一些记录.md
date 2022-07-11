# [Postgres 中 GUC 的一些记录](https://github.com/yihong0618/gitblog/issues/233)

## 什么是 GUC

在数据库中运行需要的各种参数 --> GUC: Grand Unified Configuration. 当我们需要写 postgres 中相关的插件时，离不开 GUC 的处理，这篇文章对 GUC 做一些简单的记录。

## Postgres 中的不同 GUC
而这些参数的可以有各种各样的来源，postgres 对每种来源的处理也不完全相同， 这些来源中有 pg 默认的，系统环境的，来自 user 的，来自 session 的等等等。。。一些基于 pg 的分布式数据库还会额外的增加 GUC 来源。

`postgres 9.4 guc file src/backend/utils/misc/guc.c`
```c
const char *const GucSource_Names[] =
{
	 /* PGC_S_DEFAULT */ "default",
	 /* PGC_S_DYNAMIC_DEFAULT */ "default",
	 /* PGC_S_ENV_VAR */ "environment variable",
	 /* PGC_S_FILE */ "configuration file",
	 /* PGC_S_ARGV */ "command line",
	 /* PGC_S_GLOBAL */ "global",
	 /* PGC_S_DATABASE */ "database",
	 /* PGC_S_USER */ "user",
	 /* PGC_S_DATABASE_USER */ "database user",
	 /* PGC_S_CLIENT */ "client",
	 /* PGC_S_OVERRIDE */ "override",
	 /* PGC_S_INTERACTIVE */ "interactive",
	 /* PGC_S_TEST */ "test",
	 /* PGC_S_SESSION */ "session"
};
```
我们可以用命令查这些相关的 GUC 和来源
```sql
select name, setting, source from pg_settings;
```
![image](https://user-images.githubusercontent.com/15976103/164360614-f21c1ec4-4a19-47da-b35e-d6bdadb24edd.png)

不同的 GUC 也会有不同的权限。
```c
/*
 * Displayable names for context types (enum GucContext)
 *
 * Note: these strings are deliberately not localized.
 */
const char *const GucContext_Names[] =
{
	 /* PGC_INTERNAL */ "internal",
	 /* PGC_POSTMASTER */ "postmaster",
	 /* PGC_SIGHUP */ "sighup",
	 /* PGC_BACKEND */ "backend",
	 /* PGC_SUSET */ "superuser",
	 /* PGC_USERSET */ "user"
};
```
## GUC 的类型
```c
const char *const config_type_names[] =
{
	 /* PGC_BOOL */ "bool",
	 /* PGC_INT */ "integer",
	 /* PGC_REAL */ "real",
	 /* PGC_STRING */ "string",
	 /* PGC_ENUM */ "enum"
};
```
不同类型的 GUC 有对应相对的 GUC 函数，都用 DefineCustomXXXVariable 命名 srting 类型为例：
```c
void
DefineCustomStringVariable(const char *name,
						   const char *short_desc,
						   const char *long_desc,
						   char **valueAddr,
						   const char *bootValue,
						   GucContext context,
						   int flags,
						   GucStringCheckHook check_hook,
						   GucStringAssignHook assign_hook,
						   GucShowHook show_hook)
{
	struct config_string *var;

	var = (struct config_string *)
		init_custom_variable(name, short_desc, long_desc, context, flags,
							 PGC_STRING, sizeof(struct config_string));
	var->variable = valueAddr;
	var->boot_val = bootValue;
	var->check_hook = check_hook;
	var->assign_hook = assign_hook;
	var->show_hook = show_hook;
	define_custom_variable(&var->gen);
}
```

## GUC 中的 hook

如上 DefineCustomStringVariable 可以容易看出，每种类型的 GUC 可以添加 3 个不同的 hook, 这 3 个 hook 在 set 时候触发，分别是

- bool check_hook: 验证数据有效性，返回 false or true, 如果 true 则设置成功， 此函数可以提供额外信息，比如弹出错误消息
- void assign_hook: 设置值时触发
- const char *show_hook: 设置完 guc 后 show 命令时候展示用


## 如果要写一个 pg 插件，怎么添加一个 GUC 呢？

1. 确认 GUC 类型，权限，触发条件。用 guc 中的 DefineCustomXXXVariable 设置新的 guc。
2. 将新的 GUC 添加到插件的 `_PG_init` 中
3. 设置好 hook 函数
4. 测试

## GUC 中有趣的细节

1. 在第一次初始化时也会调用 3 个 hook
2. guc-file.c 是有 guc-file.l 生成的是 flex, 大家如果关注有趣的细节可以参考[这篇文章](http://blog.chinaunix.net/uid-30132132-id-4826450.html)
3. 在基于 pg 的分布式数据库中如 [gpdb](https://github.com/greenplum-db/gpdb) 还需要考虑 guc 的主从同步问题，有额外的参数控制
