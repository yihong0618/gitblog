# [Login failed！](https://github.com/yihong0618/gitblog/issues/263)

你好，这个问题是小米开发者平台账号问题吗？
我使用的小米账号登录的开发者平台 没有申请 注册企业组 。
运行方式 docker  hardware=MDZ-25-DA 

Exception on login 13********2: 'userId'
Traceback (most recent call last):
  File "/app/.venv/lib/python3.10/site-packages/miservice/miaccount.py", line 71, in login
    self.token["userId"] = resp["userId"]
KeyError: 'userId'
Exception on login 13********2: 'userId'
Traceback (most recent call last):
  File "/app/.venv/lib/python3.10/site-packages/miservice/miaccount.py", line 71, in login
    self.token["userId"] = resp["userId"]
KeyError: 'userId'
Traceback (most recent call last):
  File "/app/xiaogpt.py", line 5, in <module>
    main()
  File "/app/xiaogpt/cli.py", line 136, in main
    loop.run_until_complete(miboy.run_forever())
  File "/usr/local/lib/python3.10/asyncio/base_events.py", line 649, in run_until_complete
    return future.result()
  File "/app/xiaogpt/xiaogpt.py", line 422, in run_forever
    await self.init_all_data(session)
  File "/app/xiaogpt/xiaogpt.py", line 109, in init_all_data
    await self._init_data_hardware()
  File "/app/xiaogpt/xiaogpt.py", line 131, in _init_data_hardware
    hardware_data = await self.mina_service.device_list()
  File "/app/.venv/lib/python3.10/site-packages/miservice/minaservice.py", line 27, in device_list
    result = await self.mina_request("/admin/v2/device_list?master=" + str(master))
  File "/app/.venv/lib/python3.10/site-packages/miservice/minaservice.py", line 22, in mina_request
    return await self.account.mi_request(
  File "/app/.venv/lib/python3.10/site-packages/miservice/miaccount.py", line 150, in mi_request
    raise Exception(f"Error {url}: {resp}")
Exception: Error https://api2.mina.mi.com/admin/v2/device_list?master=0&requestId=app_ios_qc8k61XlhJYdirN4jOGD2xPzQn3oby: Login failed

---

不好意思 请去该项目下留 issue