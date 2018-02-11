# Administrator表（管理员）
---
id | 英文名 | 中文释义 | 类型| 其他说明
---|---|---|---|---
1|account|账号|varchar|主键
2|password|密码|varchar|非空

# Member（成员）
---
id | 英文名 | 中文释义 | 类型| 其他说明
---|---|---|---|---
1|id|编号|int|代理键
2|realname|真实姓名|varchar|
3|nickname|昵称|varchar|
4|isOnline|在线状态|varchar|true 在线/false 离线
5|pertag|备注|varchar|
6|account|账号|varchar
7|password|密码|varchar
8|canBeused|能否被分配任务|varchar|有任务即不可被分配其他任务
9|achievements|已完成项目|varchar

# plan（（小写p）计划）
id | 英文名 | 中文释义 | 类型| 其他说明
---|---|---|---|---
1|id|编号|int|代理键
2|content|简介|varchar|非空

# Plan（（大写P）项目）
id | 英文名 | 中文释义 | 类型| 其他说明
---|---|---|---|---
1|id|编号|int|代理键
2|state|状态|varchar
3|releaseTime|发布时间|varchar
4|updateTime|更新时间|varchar
5|title|标题|varchar
6|content|简介|varchar
7|captain|队长|varchar
8|member|成员|varchar
9|document|文件地址|varchar





