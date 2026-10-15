# 教学模拟数据说明

所有CSV、文本、HTML均为原创教学模拟材料，非真实企业、真实公共服务、真实个人或学生作业数据。月份仅为模拟分析时间轴，交易编号与商品编号不对应任何自然人。数据刻意保持小规模，供课堂练习；不能据此作真实业务或人群判断。

CSV使用UTF-8 BOM编码，可由pandas或常见表格软件读取。原始数据请保留；清洗结果使用新文件或内存副本。缺失不应未经说明填0。

## service_tickets.csv（72行）

一行＝月份×时段×业务的聚合组，共12月×2时段×3业务；没有单个工单或个人记录。

| 字段 | 口径/单位 |
|---|---|
| period | 模拟月份，YYYY-MM |
| shift | 上午/下午 |
| business | 咨询服务/业务办理/技术支持 |
| ticket_count | 本组全部工单数，件 |
| work_hours_total | 本组工单处理工时总和，小时 |
| first_response_minutes_total | 本组全部工单首次响应时间总和，分钟 |
| first_contact_resolved_count | 一次联系即解决的工单数，件，属于ticket_count子集 |

平均处理工时＝work_hours_total/ticket_count；平均首次响应时间＝first_response_minutes_total/ticket_count；一次解决率＝first_contact_resolved_count/ticket_count。合组后以分子合计/分母合计重算，不能直接平均各组比率。聚合记录不能代表单个工单等待时间分布。

## campaigns.csv（48行）

一行＝月份×渠道×活动，共6月×4渠道×2活动；同一组合唯一。

| 字段 | 口径/单位 |
|---|---|
| period | 模拟月份，YYYY-MM |
| channel | 搜索推广/社交内容/邮件触达/平台推荐 |
| campaign | 新品体验/复购活动，两个活动可出现在不同渠道 |
| spend_cny | 本期本组投放投入，人民币元；不含商品成本 |
| visits | 本期访问会话次数，不是去重访客人数 |
| conversions | 本期已支付订单数；模拟设定每次转化对应一笔已支付订单 |
| sales_gross_cny | 已支付订单销售总额，退款前，人民币元 |
| refund_cny | 上述订单归属的退款金额，人民币元，按同组同月回记；不跨期 |
| goods_cost_cny | 上述净销售对应商品成本，人民币元，已扣除退货回收成本 |

净销售额＝sales_gross_cny－refund_cny。转化率＝conversions/visits，是访问会话层面的聚合指标，不是独立访客转化率。退款金额率＝refund_cny/sales_gross_cny，不能称为退款订单率。平均订单销售总额＝sales_gross_cny/conversions；不能用聚合组均值分布代替单笔订单分布。

简化贡献额＝sales_gross_cny－refund_cny－goods_cost_cny－spend_cny。本模拟不包含税费、人力、仓储、履约等其他成本，因此简化贡献额不是完整利润，贡献额/投入也不应被冒称为完整财务投资回报率。筛选或合组后须重新计算比率。

## orders_dirty.csv（24行）

一行是待检查的模拟订单记录，故意含质量问题。字段：order_id模拟订单编号、order_date日期文本、channel渠道、quantity数量（件）、unit_price_cny单价（元）、refund_cny退款金额（元）、status状态。

包含空值、完全重复、同编号但数量冲突、日期格式混用、无效日期、币种与千分位格式、数量带单位、文本空格、负数量、退款超额、取消状态等。目的是练习发现并解释规则，不提供唯一清洗答案。无法确定的记录应隔离并说明，不能擅自改成“合理值”。有效已支付记录的销售总额可用quantity×unit_price_cny计算，净额扣退款；已取消记录的统计范围应另行明确。

## network_edges.csv（11行）

source/target为教学概念或流程节点，relation为关系名称，weight为人为设定的0—10示意强度；不是频次、概率或真实社交联系。同名节点的合并必须有清楚规则。适合练习有向关系图、边列表和节点度数。

## feedback.txt（10条模拟句子）

完全原创的模拟表达，非真实用户或学生反馈。可练习关键词计数与文本整理；不含真实人员或机构调查结果。子字符串计数并非中文分词、情感分析或满意度测量。

## sample_catalog.html（6条）

完全本地的静态模拟商品目录，无外部资源或脚本。article.product包含data-id、h2、span.category、span.price、span.stock；价格为人民币元，库存为件。用于BeautifulSoup或标准库HTMLParser练习，不需要也不应访问外部网站。

## rentals_sample.csv / rentals_sample.html（24条）

本地HTML与CSV是同一组原创模拟房源，不是真实房源或租房建议；没有真实地址、人员或外部链接。CSV保留带单位的原始文本，供提取/清洗练习。字段：listing_id模拟编号、district虚构地区、bedrooms居室文本、area_sqm面积文本（平方米）、rent_cny_month月租文本（元/月）、subway_walk_min步行分钟文本、has_elevator电梯文本。两条“未提供”步行时间表示缺失，不能当成0。HTML的article.rental包含data-id与district/bedrooms/area/rent/subway/elevator选择器。每平方米月租＝月租/面积；请先转换单位和类型。

## games_sample.csv（36条）

每行一部原创模拟游戏作品，game_id唯一，title为虚构名称，platform为虚构平台，genre为模拟类型；release_year是作品发行年份，不是销量发生年份。na_sales_million/eu_sales_million/jp_sales_million/other_sales_million为四个示意地区销量（百万份），其和为模拟全球销量。地区名称只是字段结构，不是实际市场数据。销量不是收入，不能用发行年推算真实年度销售发生额或市场份额。

## streaming_sample.csv（40条）

每行一部原创模拟流媒体作品，content_id唯一，title虚构；content_type为电影/剧集；release_year发行年、added_year模拟收录年；countries为地区标签，genres为类型标签，多个标签以分号分隔；age_rating为示意分级。duration_min仅适用于电影（分钟），seasons仅适用于剧集（季），不适用字段留空而不是0。文件不是Netflix或其他平台的真实目录。

拆分多地区、多类型会增加行数，标签出现次数之和可能大于唯一作品数。可选完整计数或分摊权重，但须写明规则；若跨两种多标签展开，应说明每部作品贡献是否被重复累计。层级树/旭日图需区分完整路径；Sankey在这里表示标签关联，不是真实人员流动、内容迁移或观看顺序。

## retail_sales.csv（144条）

每行是一个虚构订单且在本模拟中只有一条商品行，order_id唯一；order_date为模拟订单日期，覆盖12个月。region为虚构地区，store为虚构分店，category为食品/日用/文具；quantity为件数，unit_price_cny为元/件；sales_gross_cny＝quantity×unit_price_cny；refund_cny为同订单归属退款，goods_cost_cny为该净销售对应的商品净成本（已扣退货回收部分）。所有金额单位人民币元。

净销售额＝销售总额－退款；扣商品净成本可得本练习中的简化贡献额，尚未扣税费、人力、履约、租金等成本，因此不等于利润。订单数按order_id去重，销量按quantity求和；订单金额分布和日/月总额分布观察单位不同。store可用于分店筛选，各指标和图表应使用同一筛选结果；没有订单记录的日期不等同于已知停业或无需求。
