# LI.FI Public Demo Plan

> 这不是一份“想法草稿”，而是一份可以直接指导实现、写 README、录屏和面试讲解的 master plan。
>
> 当前已确认的关键决策：
>
> - 底层方案：`SDK 为主，API 作为 README / 教程补充`
> - MVP 暂不强依赖真实执行交易，先完成 `quote / routes / status / error handling`
> - 主演示路线：`Arbitrum USDC -> Optimism USDC`
> - 备用路线：`Arbitrum USDC -> Polygon USDC`

---

## 1. 项目定位

这个 demo 的目标不是做一个漂亮的跨链页面，而是做一个**开发者体验导向**的 `LI.FI` 集成作品，用来同时满足 4 个场景：

- `LI.FI` DevRel / DevRel-like 岗位投递材料
- 面试中的 live demo
- 公开 GitHub 作品集
- 后续中文技术文章和短视频素材来源

这个 demo 要证明的不是“我会 React”，而是下面 4 件事：

- 我能在很短时间内完成真实第三方协议集成
- 我理解 `Widget / SDK / API` 三种接入方式的边界
- 我知道开发者在真实接入时最容易卡在哪
- 我能把复杂产品讲清楚，而不是只会贴代码

一句话版本：

`我做了一个面向开发者的 LI.FI 集成 demo，同时演示最快落地的 Widget 接入方式，以及更高控制力的 SDK 集成方式，帮助开发者理解什么时候该用 Widget，什么时候该用 SDK/API。`

---

## 2. 已确认的产品与技术决策

| 决策项 | 结论 | 这样做的原因 |
| --- | --- | --- |
| Demo 技术路线 | `Next.js + TypeScript + Tailwind CSS` | 适合快速搭建公开 demo，也符合你自己的主力栈 |
| 底层集成方式 | `SDK 为主，API 为补充说明` | SDK 更适合作为“更高控制力”的演示对象，同时保留工程抽象；API 可放进 README/教程做补充 |
| 是否做真实执行 | `MVP 不强依赖真实执行` | 先把可讲、可展示、可部署的查询链路做稳，避免被钱包执行、RPC、余额、测试资金拖慢主线 |
| 是否做状态查询 | `做` | 状态查询是“懂真实跨链流程”的关键证据 |
| 状态查询输入方式 | `手动输入 txHash，支持 fromChain / toChain / bridge 辅助参数` | 不做真实执行时，这是最稳、最清晰、最容易讲解的方案 |
| 主演示路径 | `Arbitrum USDC -> Optimism USDC` | EVM + 稳定币路径更稳、更好讲，减少 demo 失败率 |
| 备用路径 | `Arbitrum USDC -> Polygon USDC` | 用于主路径临时无 route / liquidity 时切换 |
| Widget 页面定位 | `最快接入、最低工程成本` | 对应产品判断和 DevRel 讲述主线 |
| SDK 页面定位 | `可控、可观测、可扩展` | 用来证明你理解更底层的工程集成 |
| API key 策略 | `默认不依赖 API key，若后续需要仅放服务端` | 官方明确不应把 `x-lifi-api-key` 暴露在浏览器端 |
| SDK 调用位置 | `优先放在 Next.js Route Handlers` | 这样更接近生产实践，也为后续加 API key / 日志 / 限流预留空间 |

---

## 3. 项目成功标准

### 3.1 最终交付物

必须全部具备：

- 一个公开 GitHub 仓库
- 一个可访问的线上部署链接
- 一个 `Next.js + TypeScript` demo
- 一个 `LI.FI Widget` 集成页面
- 一个 `LI.FI SDK` 集成页面
- 一个清晰、完整、可复现的 `README`
- 一篇中文技术教程
- 一个 `2-3` 分钟录屏

### 3.2 成功的判断标准

如果一个陌生开发者打开你的仓库后，能在很短时间内理解下面 4 件事，这个 demo 就算合格：

- `LI.FI` 是什么
- `Widget` 和 `SDK/API` 分别怎么接
- 什么时候该选哪种方案
- 遇到 route、状态、参数、限流等问题时怎么排查

### 3.3 面试视角下的验收标准

如果你要拿这个 demo 去面试，至少要满足：

- 你能在 `30 秒` 内讲清楚项目是什么
- 你能在 `3 分钟` 内讲清楚项目价值
- 你能在 `5 分钟` 内讲清楚 `Widget vs SDK/API`
- 你能解释 `2-3` 个真实错误场景
- 你能说明这是“开发者体验作品”，而不是普通前端页面
- 你的仓库、文档、线上地址都能直接打开

---

## 4. 核心叙事

这份 demo 的核心讲法必须统一，不要今天讲“跨链产品”，明天讲“前端炫技”，后天又讲“Web3 数据展示”。

### 4.1 统一故事线

你要讲的是：

`LI.FI 给开发者提供了从最快落地到更高控制力的一整套集成路径。我用一个公开 demo，把 Widget 和 SDK 两条路径放在同一个项目里展示清楚，并额外补上状态跟踪、错误处理和接入判断，帮助开发者更快做技术决策。`

### 4.2 30 秒版本

`这是一个 Next.js + TypeScript 的 LI.FI 集成 demo。它分成两个核心页面：Widget 页面展示最快的 drop-in 集成方式，SDK 页面展示更高控制力的查询和状态跟踪能力。我的重点不是做复杂 UI，而是把开发者最关心的接入路径、错误处理和技术边界讲清楚。`

### 4.3 3 分钟版本

可以按这个顺序讲：

1. `为什么做`
   不是为了做一个 swap UI，而是为了说明自己能把第三方基础设施产品做成开发者可理解、可接入、可复用的 demo。
2. `为什么分成两页`
   因为 `Widget` 和 `SDK/API` 解决的其实不是同一个问题。前者追求最快接入，后者追求控制力和自定义能力。
3. `Widget 页展示什么`
   展示最小接入成本、配置能力、链和 token 限制、品牌化能力，以及为什么它适合 MVP。
4. `SDK 页展示什么`
   展示更细粒度的数据查询、参数校验、`quote / routes` 选择、结果展示、状态查询和错误提示。
5. `这个 demo 的价值`
   它不是“看起来能跑”，而是能帮助开发者做产品和技术选型。

---

## 5. 目标用户

这份 demo 不是面向普通终端用户，而是面向下面 3 类“技术型观众”：

- 想快速接入跨链 / swap 能力的前端开发者
- 想判断应该选 `Widget` 还是 `SDK/API` 的产品工程师
- 招聘方、面试官、DevRel 团队，用来判断你是否真的理解集成和开发者体验

对应要回答的问题分别是：

- `开发者视角`：我多久能接进去？怎么跑通？
- `产品视角`：什么时候用 Widget，什么时候上 SDK/API？
- `工程视角`：如何处理状态、错误、参数、服务端边界和扩展性？

---

## 6. 范围定义

### 6.1 必做

- 展示 `Widget` 的最快接入方式
- 展示 `SDK` 的更高控制力
- 展示 `quote` 和 `routes` 的概念差异
- 展示支持链和 token 的获取
- 展示状态查询逻辑
- 展示常见错误场景
- 展示“为什么这个方案适合开发者”
- 把部署、文档、录屏一并补齐

### 6.2 强烈建议做

- 增加 `quote vs routes` 对比说明区块
- 增加英文版项目简介
- 增加“适合什么场景”的判断卡片
- 增加 APAC / 中文开发者视角的说明
- 补一篇可公开发布的中文教程

### 6.3 明确不做

- 不做复杂视觉设计
- 不做完整交易执行闭环作为 MVP 前置条件
- 不做无关业务系统
- 不做大而全的多页面平台
- 不为追求“看起来高级”去堆无关动画

### 6.4 暂缓项

这些可以放到 `P2` 之后：

- 钱包连接与真实执行
- 路由执行后的自动状态轮询
- 收费 / monetization 演示
- 多 VM 演示（EVM 之外）
- 多语言完整国际化

---

## 7. Demo 要回答的核心问题

这个项目必须显式回答下面 6 个问题，否则就容易沦为“能跑但没观点”的 demo：

1. `LI.FI` 在这个 demo 里到底解决了什么问题？
2. 为什么要同时展示 `Widget` 和 `SDK`？
3. 什么场景下 `Widget` 是更好的答案？
4. 什么场景下 `SDK/API` 是更好的答案？
5. 开发者实际接入时会遇到哪些坑？
6. 这个 demo 的工程处理方式体现了什么判断？

---

## 8. 页面结构与信息架构

建议项目保持为 `3` 个主页面，清晰、紧凑、可讲解。

### 8.1 Home

作用：一句话讲清楚项目价值，并引导进入两种集成方式。

必须包含：

- 项目标题和一句话介绍
- `Widget vs SDK/API` 选择说明
- 演示入口
- 这份 demo 重点解决什么问题
- 一个“我为什么做这个 demo”的短说明

建议包含的区块：

- `Hero`
  - 标题：`LI.FI Integration Demo for Developers`
  - 副标题：`Compare Widget and SDK integration paths in one Next.js project`
- `Why this exists`
  - 说明这个项目不是做用户端 swap 页，而是帮助开发者做集成判断
- `Decision Cards`
  - 卡片 1：`Use Widget when you want the fastest path`
  - 卡片 2：`Use SDK when you need more control`
- `What this demo covers`
  - `quote`
  - `routes`
  - `status`
  - `errors`
  - `deployment`
- `CTA`
  - 进入 `Widget Demo`
  - 进入 `SDK Demo`

Home 页验收标准：

- 打开页面 `10 秒` 内能知道这个项目是干什么的
- 不需要读代码就能理解为什么要有两条接入路径
- 有明确跳转到两个 demo 页的入口

### 8.2 Widget Demo

作用：证明你能让开发者最快接进去，并且理解配置边界。

必须包含：

- `LI.FI Widget` 嵌入
- 基础配置
- 链和 token 限制示例
- 简单品牌化配置
- 适用场景说明
- 一个“什么时候不要用 Widget”的提醒

建议页面结构：

- 顶部说明
  - `This page demonstrates the fastest way to integrate LI.FI`
- Widget 区块
  - 客户端渲染的 `LiFiWidget`
- 配置说明卡片
  - 默认链和 token
  - 限制链
  - 限制 token
  - 简单主题配置
- 场景判断区块
  - 适合：MVP、Hackathon、快速验证、产品原型
  - 不适合：需要完全自定义流程、需要更深埋点、需要复杂业务逻辑
- 备注区块
  - `Widget` 本质上建立在 SDK 之上
  - 生产环境建议考虑 RPC 配置和品牌化细节

Widget 页验收标准：

- 页面正常渲染，无 SSR 报错
- Widget 可见、可操作
- 至少能看出你配置过 `chain / token / theme / integrator`
- 页面文字能讲清楚它为什么适合快速集成

### 8.3 SDK Demo

作用：证明你理解更底层的集成方式和工程取舍。

必须包含：

- 手动输入或选择 `fromChain / toChain / token / amount`
- 能请求 `quote` 或 `routes`
- 能展示关键结果
- 有请求前校验
- 有状态查询模块
- 有错误展示区块

建议页面结构：

- 顶部说明
  - `This page demonstrates a more controllable LI.FI integration using the SDK`
- 请求表单
  - `fromChain`
  - `toChain`
  - `fromToken`
  - `toToken`
  - `amount`
  - `fromAddress`
- 请求模式切换
  - `Best Quote`
  - `Routes`
- 结果展示区
  - 路由概览
  - 关键字段卡片
  - 原始 JSON 折叠区
- Status 查询区
  - 输入 `txHash`
  - 可选输入 `fromChain / toChain / bridge`
  - 返回当前状态
- Error 区块
  - 请求失败
  - 没有路由
  - 参数错误
  - 状态未知

SDK 页验收标准：

- 表单结构清晰，不靠阅读代码猜参数
- `quote / routes` 至少有一个可稳定返回
- 能看出“结果是有解释的”，不是直接 dump JSON
- 能输入一个 tx hash 进行状态查询
- 对错误场景有明确反馈文案

---

## 9. 关键产品判断：为什么是 Widget + SDK，而不是 Widget + API

这是整个 demo 里非常关键的一层判断，你需要在 README 和讲解中说清楚。

### 9.1 为什么保留 Widget

因为 `Widget` 是最快落地的答案，特别适合：

- hackathon
- MVP
- 想最快支持跨链 / swap 的 dApp
- 团队资源有限但又想尽快验证需求

它的价值不在“可定制到极致”，而在：

- 接入速度快
- UI 和基础逻辑现成
- 学习成本低
- 很适合 demo 和原型

### 9.2 为什么主打 SDK

因为 `SDK` 更适合用来展示工程理解，特别是下面几件事：

- 你怎么组织请求层
- 你怎么做参数校验
- 你怎么处理数据转换
- 你怎么展示 `quote / routes`
- 你怎么做状态查询
- 你怎么做错误处理

也就是说，`SDK` 更能体现“你不是只会把组件贴上去”。

### 9.3 为什么 API 不作为主页面核心

不是因为 API 不重要，而是因为：

- 直接 API 演示会让页面层承担更多实现细节
- 如果引入 API key，浏览器暴露会有安全问题
- 对这个 demo 的主线来说，SDK 更适合做“高控制力”的代表

因此更合理的做法是：

- 页面主线：`Widget + SDK`
- README / 教程补充：`如果需要更底层或非 JS 环境，可以直接调用 API`

---

## 10. 演示路径设计

### 10.1 主演示路径

主路径建议固定为：

- `fromChain`: `Arbitrum`
- `toChain`: `Optimism`
- `fromToken`: `USDC`
- `toToken`: `USDC`

这样做的好处：

- EVM 生态，概念成本低
- 稳定币路径更容易解释
- 面试官和开发者都更容易理解
- 失败率通常低于更花哨的 token 组合

### 10.2 备用路径

如果主路径临时找不到 route，切换到：

- `Arbitrum USDC -> Polygon USDC`

### 10.3 为什么不推荐一上来就演示花哨路线

比如：

- 多 VM 路线
- 小众 token
- 高频变化的长路径

这些会让 demo 更酷，但会明显提高不稳定性，也会削弱“开发者一眼看懂”的效果。

---

## 11. 技术实现方案

### 11.1 技术栈

- `Next.js`
- `TypeScript`
- `Tailwind CSS`
- `@lifi/widget`
- `@lifi/sdk`
- `Vercel`

可选但推荐：

- `zod`
- `react-hook-form`
- `lucide-react`

这里的原则是：

- UI 只要清楚，不要本末倒置
- 类型和校验要到位
- 工程结构要像可维护项目，而不是一次性 hack

### 11.2 项目结构建议

```txt
app/
  page.tsx
  widget/page.tsx
  sdk/page.tsx
  api/lifi/chains/route.ts
  api/lifi/tokens/route.ts
  api/lifi/quote/route.ts
  api/lifi/routes/route.ts
  api/lifi/status/route.ts

components/
  layout/site-header.tsx
  home/decision-cards.tsx
  widget/widget-demo-shell.tsx
  sdk/sdk-demo-form.tsx
  sdk/sdk-result-panel.tsx
  sdk/status-panel.tsx
  shared/section-card.tsx
  shared/json-viewer.tsx

lib/
  lifi/config.ts
  lifi/client.ts
  lifi/server.ts
  lifi/serializers.ts
  lifi/validators.ts
  constants/demo-defaults.ts

types/
  lifi.ts
```

### 11.3 服务端边界建议

虽然这个 demo 可以不带 API key 先跑，但仍然建议把 SDK 调用放在 `Route Handlers`：

- `GET /api/lifi/chains`
- `GET /api/lifi/tokens?chain=42161`
- `POST /api/lifi/quote`
- `POST /api/lifi/routes`
- `GET /api/lifi/status?...`

这样做的价值：

- 后续加 `LIFI_API_KEY` 不需要重构前端
- 更符合生产实践
- 更容易加日志、限流、错误归一化
- 避免把第三方请求细节散落在页面组件中

### 11.4 环境变量建议

```bash
LIFI_INTEGRATOR=jackcc-lifi-public-demo
LIFI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

说明：

- `LIFI_INTEGRATOR`：SDK / Widget 都需要一个清晰的 integrator 标识
- `LIFI_API_KEY`：先留空也能做 MVP；如果后续申请 higher rate limits，再只放服务端
- 不要把 `x-lifi-api-key` 暴露到浏览器端

### 11.5 Widget 页面实现要点

- 使用 `use client`
- 按官方 Next.js 兼容方式做客户端渲染
- 初版只做必要配置，不要一开始就堆所有参数
- 页面要显式展示你配置了什么，而不是只展示组件本体

建议最小配置包括：

- `integrator`
- 默认链
- 默认 token
- 限制链范围
- 限制 token 范围
- 轻量主题配置

### 11.6 SDK 页面实现要点

- 页面本身只负责 UI 和状态
- 请求逻辑走你自己的 `/api/lifi/*`
- 表单提交前必须校验
- 结果必须做“解释层”，不要只展示原始对象

建议明确区分：

- `UI 层字段名`
  - `fromChain`
  - `toChain`
  - `fromToken`
  - `toToken`
- `SDK 请求字段名`
  - `fromChainId`
  - `toChainId`
  - `fromTokenAddress`
  - `toTokenAddress`
  - `fromAmount`

这样做的意义是：

- 页面文案更好懂
- 请求层更准确
- 后续如果补 API 直调，也更容易做字段映射

建议优先展示这些 SDK 能力：

- 获取支持链
- 获取 token
- 获取 `quote`
- 获取 `routes`
- 查询 `status`

---

## 12. 数据流设计

### 12.1 Widget 页面数据流

```txt
Widget Page
  -> Client-only Widget Shell
  -> LI.FI Widget
  -> LI.FI internal route fetching
```

这页的重点不是“自己控制每一步”，而是：

- 证明接得快
- 证明配置过
- 证明知道它适合什么场景

### 12.2 SDK 页面数据流

```txt
SDK Page Form
  -> Client validation
  -> POST /api/lifi/quote or /api/lifi/routes
  -> Route Handler calls LI.FI SDK
  -> Normalize response
  -> Return simplified payload to UI
  -> Render summary + raw JSON
```

### 12.3 Status 数据流

```txt
Status Form
  -> txHash required
  -> optional: fromChain / toChain / bridge
  -> GET /api/lifi/status
  -> Render current state + links + notes
```

这里必须强调一个工程点：

- `status` 查询不一定返回“你预期的成功结果”
- 即使 transaction 暂时找不到，也可能是还没被索引到
- 所以 UI 文案要区分：
  - `还在处理中`
  - `暂未找到`
  - `明确失败`
  - `查询参数不足`

---

## 13. SDK 页的输入与输出设计

### 13.1 输入项

建议最小输入项：

- `fromChain`
- `toChain`
- `fromToken`
- `toToken`
- `amount`
- `fromAddress`

默认值建议：

- `fromChain = Arbitrum`
- `toChain = Optimism`
- `fromToken = USDC`
- `toToken = USDC`
- `amount = 10`
- `fromAddress = 一个公开示例地址`

这样做的原因：

- 页面一打开就能演示
- 用户不需要从空白表单开始猜
- 又保留了可编辑性

### 13.2 表单校验

至少要做：

- `amount` 必须大于 `0`
- `fromChain / toChain` 不能为空
- `fromToken / toToken` 不能为空
- `fromAddress` 格式合法
- token 必须属于所选链

建议做：

- amount 输入时就做格式清洗
- 以字符串保存 UI 输入值
- 在请求边界统一转成 smallest unit

### 13.3 UI 字段与 SDK 字段映射

建议在文档和代码里都显式写出这层映射：

| UI 字段 | SDK 字段 | 备注 |
| --- | --- | --- |
| `fromChain` | `fromChainId` | UI 用可读名称，SDK 用链 ID |
| `toChain` | `toChainId` | 同上 |
| `fromToken` | `fromTokenAddress` | UI 可展示 symbol，SDK 最终传地址 |
| `toToken` | `toTokenAddress` | 同上 |
| `amount` | `fromAmount` | 需先转 smallest unit |
| `fromAddress` | `fromAddress` | 可直接复用，但仍需校验 |

### 13.4 结果区建议展示什么

不要把返回对象整块砸到页面上，至少拆成下面几个区块：

- `Summary`
  - 从哪条链到哪条链
  - 从什么 token 到什么 token
  - 输入 amount
- `Routing info`
  - 选择的是 `quote` 还是 `routes`
  - 使用了哪个 tool / bridge
  - 是否是多 step
- `Execution-related fields`
  - 关键估值
  - 预计到手量
  - 最小到手量
  - 费用或 gas 相关摘要
- `Raw JSON`
  - 折叠显示，用于证明你保留了原始响应

### 13.5 为什么要同时展示 Summary 和 Raw JSON

因为你要同时满足两类观众：

- 非协议深度用户：看 Summary 就够了
- 工程型观众：会想看原始对象和字段结构

---

## 14. quote vs routes 的讲解策略

这部分必须在页面文案和 README 里写清楚。

### 14.1 你要传达的核心区别

- `quote`
  - 更像“给我一个最佳单结果”
  - 适合快速拿一条推荐路径和交易数据
- `routes`
  - 更像“给我候选路线和步骤信息”
  - 适合需要更强可视化、可控性或比对能力的场景

### 14.2 页面上怎么讲

建议用一个简洁对比卡片：

| 维度 | Quote | Routes |
| --- | --- | --- |
| 适合场景 | 快速获取最佳结果 | 需要更高透明度和可控性 |
| UI 心智 | One best answer | Candidate plans |
| 适合放哪里 | 快速询价、预览 | 复杂 swap / bridge 流程 |
| Demo 中的定位 | 用来说明最短查询路径 | 用来说明更完整的 routing 能力 |

### 14.3 你的实际实现建议

- SDK 页面主流程以 `routes` 为重点
- `quote` 作为对比模式存在
- README 和教程里专门写一小节解释二者区别

这样安排后，页面主线会更稳定，也更容易讲出“控制力”的价值。

---

## 15. 状态查询方案

因为 MVP 不强依赖真实执行，所以状态模块的设计要非常务实。

### 15.1 MVP 方案

状态查询模块单独存在，支持输入：

- `txHash` 必填
- `fromChain` 选填但推荐
- `toChain` 选填
- `bridge` 选填

这样做符合真实使用方式，也不会被“必须先在页面里执行一笔交易”卡死。

### 15.2 页面上的讲法

你要明确告诉用户：

- 这部分展示的是 `LI.FI` 的状态查询能力
- 它通常会在真实执行后使用
- 因为本 demo 的 MVP 不强依赖钱包执行，所以先采用“手动输入 txHash”的方式演示

### 15.3 录屏时怎么处理

录屏时不要现场赌运气执行一笔新交易，建议提前准备好一笔可查询的真实 `txHash`，然后：

- 粘贴到 status 表单
- 展示状态返回
- 讲清楚为什么 `txHash` 是核心输入
- 再补一句：`fromChain` 可加速查询，`bridge` 可辅助缩小范围

### 15.4 状态区块需要展示什么

- 当前状态
- 发送链交易哈希
- 浏览器链接
- 接收链信息（如果返回）
- `LI.FI Explorer` 或相关追踪链接
- 一句解释文案

---

## 16. 错误处理设计

这是整份 demo 里最能体现“真实工程意识”的部分之一。

### 16.1 必须覆盖的错误

- 参数不合法
- amount 非法
- address 非法
- 找不到 route
- 请求失败
- 限流或临时不可用
- status 未找到
- status 长时间 pending

### 16.2 错误分层

建议把错误分成三层：

#### A. 客户端校验错误

例如：

- amount 为空
- amount 小于等于 0
- address 格式不合法
- token 未选

特点：

- 在请求前就能拦住
- 文案应该明确、短、可操作

#### B. 服务端请求错误

例如：

- SDK 抛错
- 第三方接口异常
- 网络问题
- 限流

特点：

- 需要统一错误格式
- 不要直接把原始异常栈展示给用户

#### C. 业务结果错误

例如：

- 找不到 route
- 查询到状态但结果不是成功
- 交易 hash 暂时查不到

特点：

- technically 可能不是“代码报错”
- 但对于用户来说是失败或阻塞

### 16.3 建议错误文案风格

不要写成空泛提示，比如：

- `Something went wrong`
- `Error`

应该写成有操作指向的文案，比如：

- `No route found for the selected token pair. Try the fallback path or reduce constraints.`
- `The transaction was not found yet. It may still be pending indexing. Try again in 15-30 seconds.`
- `Invalid wallet address. Please enter a valid EVM address.`

### 16.4 错误处理的展示形式

建议页面上固定有一个 `Request State` / `Error State` 区块，展示：

- 当前阶段
- 简化错误信息
- 可重试建议
- 如果适用，展示原始错误对象折叠区

---

## 17. 工程细节与最佳实践

### 17.1 Token 不要只靠 symbol

必须明确：

- `USDC` 只是 symbol
- 真正请求时应以 `token address + chainId` 为准

因此在实现上建议：

- UI 可以展示 symbol
- 内部状态必须保留 `address / decimals / chainId / symbol`

### 17.2 Amount 处理要小心 decimals

不要把用户输入的 `10` 直接当成请求值。

建议流程：

1. UI 保存十进制字符串
2. 根据 token decimals 转成 smallest unit
3. 再传给 SDK / API

### 17.3 不要把第三方对象直接泄漏到页面层

建议在 `lib/lifi/serializers.ts` 做一次标准化，返回页面更容易消费的数据结构。

好处：

- 页面层更干净
- 后续换 API 也不容易炸
- 文档和录屏更好讲

### 17.4 链和 token 列表建议缓存

因为：

- 支持链和 token 相对低频变化
- 每次切页都重新拉取没有必要

可选做法：

- 在服务端做简单缓存
- 或前端用 query cache

### 17.5 Widget 页不要和 SDK 页混成一团

这个项目最核心的价值就是“对比”。

如果两页逻辑、文案和展示都混在一起，反而看不出你的判断。

---

## 18. 推荐的实现优先级

### P0：不做就别投

- 初始化 `Next.js + TypeScript` 项目
- 完成 Home 页
- 跑通 `LI.FI Widget`
- 跑通一个稳定的 `SDK` 请求
- 完成状态查询模块
- 做基础错误提示
- 写清楚 `README`
- 部署上线

### P1：强烈建议做

- 增加 `quote vs routes` 对比区块
- 增加英文项目简介
- 增加适用场景判断卡片
- 补中文教程
- 录一个 `2-3` 分钟视频

### P2：加分项

- 钱包连接体验
- 真实执行 + 自动状态轮询
- `monetization` 说明
- APAC 开发者视角扩展
- 更多 route 场景

---

## 19. 具体任务拆解

### 任务 1：明确叙事和命名

目标：

- 确定项目一句话介绍
- 确定仓库名
- 确定 integrator 标识

完成标准：

- 可以在 `README` 顶部直接使用
- 可以在录屏开头直接念出来

建议命名方向：

- `lifi-integration-demo`
- `lifi-widget-vs-sdk-demo`
- `lifi-devrel-demo`

### 任务 2：先完成 Home 页

目标：

- 用最短内容讲清楚这个 repo 的价值

完成标准：

- 有标题
- 有一句话介绍
- 有 `Widget vs SDK` 对比
- 有两个入口按钮

### 任务 3：跑通 Widget 页

目标：

- `30-60` 分钟内拿到可运行结果

完成标准：

- 页面能正常加载
- 客户端渲染正常
- Widget 可见
- 至少完成基础配置
- 页面上写明适用场景

### 任务 4：跑通 SDK 查询链路

目标：

- 体现你的工程理解

完成标准：

- 支持输入链、token、amount、address
- 能请求 `quote` 或 `routes`
- 能展示核心返回数据
- 能处理失败情况

### 任务 5：补状态查询

目标：

- 让 demo 从“只会拿数据”升级到“理解真实生命周期”

完成标准：

- 支持输入 `txHash`
- 支持可选链参数
- 能展示状态结果
- 能处理“未找到 / pending / failed”

### 任务 6：做错误处理

目标：

- 证明你知道开发者最容易卡在哪里

完成标准：

- 至少覆盖参数错误、无 route、请求失败、状态未找到

### 任务 7：写 README

目标：

- 让陌生开发者不问你也能跑起来

完成标准：

- 有项目说明
- 有接入理由
- 有本地运行步骤
- 有部署说明
- 有 `Widget vs SDK/API` 判断
- 有常见问题说明

### 任务 8：写中文教程

目标：

- 把这个 demo 变成公开传播资产

完成标准：

- 能让一个 React/Next.js 开发者理解基本接入思路
- 有你自己的判断，而不是简单翻译文档

### 任务 9：录屏

目标：

- 让仓库和面试材料形成闭环

完成标准：

- `2-3` 分钟内讲清楚
- 不依赖临场发挥
- 页面、文案、状态、错误都有覆盖

---

## 20. README 详细大纲

下面这个大纲建议直接作为最终 README 的骨架。

```md
# LI.FI Integration Demo

## What this is

## Why I built this

## What it demonstrates

- Widget integration
- SDK-based route/quote flow
- Status tracking
- Error handling
- Integration tradeoffs

## Why Widget and SDK are shown together

## Tech stack

## Project structure

## Local setup

## Environment variables

## Running the demo

## Demo pages

### Home
### Widget Demo
### SDK Demo

## Widget vs SDK/API

## Common integration concerns

- API key exposure
- client/server boundary
- token decimals
- no route found
- status polling

## Deployment

## Future improvements

## References
```

### 20.1 README 必须回答的问题

- 这个项目是什么
- 为什么做这个项目
- 为什么同时演示 `Widget` 和 `SDK`
- 为什么 API 不作为主页面核心
- 怎么本地运行
- 怎么部署
- 这个 demo 的边界是什么
- 我关注了哪些 developer experience 问题

### 20.2 README 中一定要强调的工程判断

- `Widget` 适合最快接入
- `SDK` 适合更高控制力
- 如果要使用 API key，应只放服务端
- 这个 demo 的 MVP 不强依赖真实执行
- 状态查询单独做是为了更稳定地展示真实能力

---

## 21. 中文技术教程大纲

文章标题建议直接用：

`5 分钟把 LI.FI 接进 Next.js：Widget 和 SDK 应该怎么选`

### 21.1 文章结构

1. `LI.FI` 是什么
2. 为什么我要做这个 demo
3. `Widget` 接入
4. `SDK` 接入
5. `quote vs routes` 的区别
6. 如何做状态查询
7. 接入时我重点关注的 developer experience 问题
8. 什么时候该用 `Widget`，什么时候该用 `SDK/API`

### 21.2 文章的价值点

不要写成纯教程文档，要有你自己的判断：

- 为什么我没有一开始就做真实执行
- 为什么我把 SDK 放服务端路由里
- 为什么稳定币路径更适合公开 demo
- 为什么错误处理和状态查询是工程亮点

---

## 22. 录屏脚本建议

总时长控制在 `2-3` 分钟。

### 22.1 推荐脚本

- `0-10 秒`
  - 项目目标
  - 这不是一个普通 swap 页，而是一个开发者导向的 LI.FI 集成 demo
- `10-40 秒`
  - Home 页
  - 简述为什么同时展示 Widget 和 SDK
- `40-80 秒`
  - Widget 页
  - 说明最快接入、基础配置、适用场景
- `80-130 秒`
  - SDK 页
  - 展示参数输入、请求结果、`quote/routes` 区别
- `130-160 秒`
  - Status 查询
  - 粘贴一笔提前准备好的 `txHash`
- `160-180 秒`
  - 错误处理和总结
  - 为什么这个 demo 对开发者有价值

### 22.2 录屏时不要做的事

- 不要临场执行真实交易赌运气
- 不要边录边改代码
- 不要把大量时间花在 UI 讲解上
- 不要只展示结果，不解释选择

---

## 23. 面试时可直接使用的回答素材

### 23.1 为什么要做这个项目

`我想证明自己不只是会写页面，而是能把第三方基础设施产品做成一个开发者真正能理解和复用的集成 demo。LI.FI 本身就很适合展示从 Widget 到 SDK/API 的不同集成层级，所以我刻意把它做成对比式结构。`

### 23.2 为什么分成 Widget 和 SDK 两页

`因为它们解决的问题不同。Widget 是最快集成路径，适合 MVP 和快速验证；SDK 则更适合需要更高控制力、状态跟踪、错误处理和服务端抽象的场景。`

### 23.3 为什么 MVP 不强依赖真实执行

`因为这个项目的核心目标是公开展示和开发者教育，而不是做完整交易产品。先把 route 查询、状态查询、错误处理和接入判断讲清楚，价值更高也更稳。真实执行可以作为下一阶段增强。`

### 23.4 这份 demo 的工程亮点是什么

- 不把 API key 暴露到客户端
- 用服务端 route handlers 包 SDK
- 对第三方响应做标准化
- 显式展示 `quote vs routes`
- 单独做状态查询模块
- 有真实错误处理而不是只做 happy path

---

## 24. 风险清单与规避策略

### 风险 1：Widget 在 Next.js 中 SSR 报错

规避：

- 明确使用客户端组件
- 参考官方 Next.js 兼容写法

### 风险 2：主路径临时无 route

规避：

- 准备备用路径
- 页面上不要写死“永远成功”

### 风险 3：直接在浏览器暴露 API key

规避：

- 默认先不用
- 后续需要 higher rate limits 时只放服务端

### 风险 4：token 只按 symbol 处理导致混乱

规避：

- 使用 `chainId + token address` 作为真实标识

### 风险 5：状态查询演示时没有可用 txHash

规避：

- 提前准备一笔自己测试过的 hash
- 录屏使用预先验证过的数据

### 风险 6：错误处理只做 toast，不可复现

规避：

- 把错误状态固定展示在页面区块中
- 至少保留可复读的错误文案和重试建议

---

## 25. 时间安排

### Day 1

- 起 `Next.js + TypeScript` 项目
- 完成 Home 页
- 跑通 `Widget`

### Day 2

- 搭 SDK 请求层
- 完成 `quote / routes` 查询
- 完成基础结果展示

### Day 3

- 完成状态查询
- 完成错误处理
- 补 README

### Day 4

- 部署上线
- 写中文教程
- 录屏
- 整理到 GitHub 和简历材料

---

## 26. 最终 Definition of Done

当下面这些条件都成立时，这个 demo 才算真正完成：

- Home 页能解释项目价值
- Widget 页能稳定加载并展示核心配置
- SDK 页能稳定返回 `quote` 或 `routes`
- 有状态查询模块
- 有基础错误处理
- README 能让陌生开发者本地跑起来
- 项目已部署
- 有可公开分享的中文教程
- 有 `2-3` 分钟录屏

---

## 27. 你现在就该做的事

按顺序执行：

1. 起一个新的 `Next.js + TypeScript` 项目
2. 先完成 Home 页
3. 跑通 `LI.FI Widget`
4. 再补一个 `SDK` 页面
5. 做状态查询模块
6. 做错误处理
7. 写 README
8. 部署到线上
9. 写中文教程
10. 录屏

---

## 28. 一句话判断这个 demo 是否合格

如果一个陌生开发者打开你的仓库后，能立刻理解：

- `LI.FI` 是什么
- 怎么接
- 什么时候用 `Widget`
- 什么时候用 `SDK/API`
- 遇到问题怎么排

那这个 demo 才算合格。

---

## 29. 官方资料参考

下面这些是后续实现、README 和教程里最值得引用的官方资料：

- Widget 安装：
  - [https://docs.li.fi/widget/install-widget](https://docs.li.fi/widget/install-widget)
- Widget 配置：
  - [https://docs.li.fi/widget/configure-widget](https://docs.li.fi/widget/configure-widget)
- Widget 与 Next.js 兼容：
  - [https://docs.li.fi/widget/compatibility](https://docs.li.fi/widget/compatibility)
- SDK 安装：
  - [https://docs.li.fi/sdk/installing-the-sdk](https://docs.li.fi/sdk/installing-the-sdk)
- 获取 Quote / Route：
  - [https://docs.li.fi/introduction/user-flows-and-examples/requesting-route-fetching-quote](https://docs.li.fi/introduction/user-flows-and-examples/requesting-route-fetching-quote)
- API 总览与鉴权说明：
  - [https://docs.li.fi/api-reference/introduction](https://docs.li.fi/api-reference/introduction)
- Rate Limits 与 API key：
  - [https://docs.li.fi/rate-limits-and-api-key](https://docs.li.fi/rate-limits-and-api-key)
- 状态查询：
  - [https://docs.li.fi/api-reference/check-the-status-of-a-cross-chain-transfer](https://docs.li.fi/api-reference/check-the-status-of-a-cross-chain-transfer)
- 状态跟踪讲解：
  - [https://docs.li.fi/introduction/user-flows-and-examples/status-tracking](https://docs.li.fi/introduction/user-flows-and-examples/status-tracking)

这些参考的核心意义不是“贴链接”，而是帮助你在 README / 教程 / 面试时把下面几件事说准：

- `Widget` 需要按客户端方式接到 Next.js
- `SDK` 需要设置 `integrator`
- `quote`、`route`、`status` 是不同层级的对象
- `x-lifi-api-key` 不应该直接暴露在客户端
