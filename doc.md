
#### !文档并不完善，仅作参考

# 登录模块

登录流程：

  * 前端请求RSA公钥:/login.do?q=0
  * 后端初始化RSA，发送公钥，并保存私钥到session
  * 前端拿到公钥，encrypt(accoount+'&'+password)，再发送加密后字符串
  * 后端从session中拿出私钥，解密字符串，匹配数据库。验证成功，获取时间hash值作为cookie token，并设置response。再返回200，失败返回201（密码错误），202（账号不存在）。

# 计划模块

一条计划结构：

+ title:计划名
+ overview:描述
+ state:状态（已完成、未完成、正在进行、挂起）
+ stages:
+ + timestamp:预期达成时间
+ + content:阶段目标描述
+ + stage:状态（已完成、未完成、正在进行）
+ + comments:
+ + + aid:注释者数据表id
+ + + content:注释内容
+ + + timestamp:注释时间

# 项目模块

+ title:计划名
+ overview:描述
+ state:状态（已完成、未完成、正在进行、挂起）
+ stages:
+ + timestamp:预期达成时间
+ + content:阶段目标描述
+ + stage:状态（已完成、未完成、正在进行）
+ + comments:
+ + + aid:注释者数据表id
+ + + content:注释内容
+ + + timestamp:注释时间
---
* 每个成员同一时间可参与一个项目。
* 项目申请需要：队长，成员，title，简介，项目文案（可选）
* 项目审核后，需要队长建立总体规划（时间戳列表），再跟随项目进度不定时更新项目状态。（这一条要求成员严格执行，可反映成员状态，对老师和负责人很有价值）
* 已完成项目也将保留在数据库。

# 博客模块

一条博客结构：

+ title:博客名
+ overview:正文前xx字截取
+ content:正文
+ comments:
+ + aid:评论人id
+ + timestamp:评论时间
+ + content:评论内容
+ + responses:
+ + + aid:回复者id:
+ + + target:被回复者id
+ + + content:回复内容
+ + + timestamp:回复时间

---

* 主页留一个链接，定向到写博客的页面。
* 添加博客的数据表。

# 成员社交模块

PS:主页chat模块的即时通讯，使用websocket实现，我做了大半了，你们有空也可以自己实现。

* 实现成员在线状态查询
* 实现成员私信留言
* 实现主页弹幕（所有人可见）
* 实现管理员给成员发送通知

# 工作室资料库模块

* 实现在线阅读pdf、ppt、doc
* 实现image阅览
* 实现文件下载上传
* 工作根目录为/home/Doc，以此进行路径访问控制


# 工作室服务器控制台

* 难度比较大，二期再做
