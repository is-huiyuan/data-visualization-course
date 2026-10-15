# 数据可视化课程：原创练习资源包

本资源含10章练习与4个实验，共14份Notebook及小规模教学模拟数据。全部内容为本课程原创练习材料，非真实业务数据、个人资料或学生作业。Notebook提供最小起始示例，保留明确TODO，不是全套参考答案。

## 使用方法

1. 下载并完整解压 **练习资源包.zip**，不要只移动某一个Notebook。
2. 保持目录：`notebooks/`、`datasets/`、`README.md`、`requirements.txt` 同处于解压根目录。
3. 用本机Jupyter、VS Code等支持Notebook的工具打开文件，**运行工作目录设为notebooks文件夹**，使`../datasets/`指向共享数据。
4. 从上到下运行示例，再完成任务、TODO、解释与独立核验。Notebook不包含预先执行输出。

基础数据单元使用pandas；图表使用matplotlib。未安装matplotlib时，数据读取和表格任务仍可运行，起始代码会跳过绘图。collection可选beautifulsoup4，提供标准库预览作为离线起点。Plotly和JupyterLab为可选，不要求安装Dash或复杂服务。此包不会自动安装软件、启动服务器、联网或上传数据；依赖准备由使用者在自己的环境完成。

## 章节

| 顺序 | 章节 | Notebook |
|---|---|---|
| 1 | 数据可视化导论 | `notebooks/intro.ipynb` |
| 2 | 数据收集与本地网页解析 | `notebooks/collection.ipynb` |
| 3 | 数据处理与质量检查 | `notebooks/processing.ipynb` |
| 4 | Python可视化基础 | `notebooks/python.ipynb` |
| 5 | 类别比较与转化指标 | `notebooks/categorical.ipynb` |
| 6 | 数值关系与趋势表达 | `notebooks/numerical.ipynb` |
| 7 | 流媒体作品的层级与构成分析 | `notebooks/hierarchy.ipynb` |
| 8 | 电子游戏销量的分布探索 | `notebooks/distribution.ipynb` |
| 9 | 多变量、关系与文本视图 | `notebooks/multivariate.ipynb` |
| 10 | 零售时序与综合仪表板 | `notebooks/dashboard.ipynb` |

## 四个实验

| 实验 | Notebook |
|---|---|
| 实验1：模拟租房信息采集与处理 | `notebooks/lab-1.ipynb` |
| 实验2：模拟电子游戏数据比较 | `notebooks/lab-2.ipynb` |
| 实验3：模拟流媒体作品层次与构成 | `notebooks/lab-3.ipynb` |
| 实验4：模拟零售时序与综合Dashboard | `notebooks/lab-4.ipynb` |

实验1接数据处理章，实验2接数值关系章，实验3接层次结构章，实验4接仪表板章。主题依次为本地模拟租房采集处理、模拟电子游戏比较、模拟流媒体层次构成和模拟零售综合Dashboard。

## 数据与指标

字段、统计粒度、金额单位、分母、故意设置的问题见`datasets/README.md`。租房、电子游戏、流媒体、零售为实验主题；模拟经营活动和服务工单是入门/拓展主题，各文件没有可用于跨业务关联的共同主键，不应强行按行拼接。

特别注意：聚合组不能被当作单个订单或工单；访问次数不是去重人数；退款金额率不是退款订单率；简化贡献额不等于完整利润。合组和筛选后重算比率，保留来源和模拟数据标记。

## AI协作与提交

可选择AI辅助任务理解、代码解释、方案比较和修改；学生应独立核对数值、图表、字段和结论。记录采纳、修改或舍弃AI建议的理由。无法使用AI时可自主完成同一任务，不影响基础学习目标。

提交完成的Notebook、图表或对照表及短结论；综合章补充筛选测试、个人贡献与AI核验记录。请勿向资源包添加真实个人信息、学生成绩或未经许可的真实业务资料。

## 资源结构

```text
notebooks/                 14份.ipynb（无执行输出）
datasets/                  8份CSV、模拟文本、2份本地HTML与字段说明
README.md                  使用说明
requirements.txt           基础依赖与可选包说明
```
