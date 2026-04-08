# 5 分钟把 LI.FI 接进 Next.js：Widget 和 SDK 应该怎么选

这篇文章不是把官方文档翻译一遍，而是基于这个 demo 总结一个更接近真实项目的接入思路。

## 1. LI.FI 在这个 demo 里解决什么问题

如果你要在应用里支持跨链桥接或 swap，通常会遇到几个问题：

- 路由来源很多，自己拼非常麻烦
- 不同链、不同桥、不同 token 的可用性并不稳定
- 你不仅要拿结果，还要解释结果
- 真正上线时还要考虑状态跟踪、错误处理和服务端边界

LI.FI 的价值就在于，它提供了从最快接入到更高控制力的一整套集成路径。

## 2. 为什么这个 demo 同时做 Widget 和 SDK

因为它们不是同一种答案。

### Widget

适合：

- MVP
- hackathon
- 产品原型
- 想先把桥接能力接进去再说

优点：

- 接入快
- UI 现成
- 配置成本低

缺点：

- 自定义流程能力有限
- 更深的埋点和业务逻辑不够灵活

### SDK

适合：

- 自定义表单
- 自定义结果展示
- 状态查询和生命周期跟踪
- 更严格的错误处理
- 想把 API key 和日志放在服务端

这个 demo 的核心判断就是：

`Widget 负责说明最快路径，SDK 负责说明更高控制力。`

## 3. 为什么没有把 API 作为主页面核心

不是因为 API 不重要，而是因为它不适合作为这个 demo 的“主叙事”。

原因有三个：

1. 直接 API 演示会让页面承担太多底层请求细节
2. 如果要加 API key，就更应该放服务端
3. 对“Widget vs 更高控制力”这个对比来说，SDK 更适合作为代表

所以更合理的结构是：

- 页面主线：`Widget + SDK`
- README 和文档：补 API 思路

## 4. 这个 demo 的工程结构怎么设计

核心原则是：

- 页面只负责 UI 和交互状态
- `LI.FI SDK` 调用统一放进 `/api/lifi/*`
- 响应进入页面前先做一层标准化

当前结构里最关键的是这些文件：

```txt
app/api/lifi/chains/route.ts
app/api/lifi/tokens/route.ts
app/api/lifi/quote/route.ts
app/api/lifi/routes/route.ts
app/api/lifi/status/route.ts

lib/lifi/serializers.ts
lib/lifi/validators.ts
```

这样做的好处：

- 后续加 `LIFI_API_KEY` 不用重构前端
- 页面文案可以保持清晰
- 第三方返回结构变化时，影响面更可控

## 5. Widget 在 Next.js 里怎么接

这里最重要的不是“把组件贴上去”，而是处理好客户端边界。

这份 demo 采用的是：

- `WidgetDemoShell` 作为客户端组件
- `WidgetDemoLoader` 用 `dynamic(..., { ssr: false })`
- 页面层只负责文案和配置解释

同时显式展示了这些配置：

- `integrator`
- 默认链路 `Arbitrum USDC -> Optimism USDC`
- 允许链范围
- 允许 token 范围
- 轻量主题样式

重点是让人一眼看出来：

`这个 Widget 不是随便贴上去的，是有明确产品判断的。`

## 6. SDK 页面为什么更能体现工程理解

SDK 页真正想证明的是下面几件事：

- 你知道 UI 字段名和 SDK 字段名不该混在一起
- 你知道 amount 需要按 decimals 转 smallest unit
- 你知道 token 不能只靠 symbol
- 你知道结果不能只 dump JSON

这个 demo 的表单字段是：

- `fromChain`
- `toChain`
- `fromToken`
- `toToken`
- `amount`
- `fromAddress`

真正发给 SDK 的字段则是：

- `fromChainId`
- `toChainId`
- `fromTokenAddress`
- `toTokenAddress`
- `fromAmount`

这就是为什么中间要有一层 validator 和 serializer。

## 7. quote 和 routes 应该怎么讲

很多 demo 会把这两个接口混着讲，结果讲不清楚。

这里建议直接分开：

### quote

更像：

`给我一个当前最适合展示的答案`

适合：

- 快速预览
- 简化 UI
- 只需要一个推荐结果

### routes

更像：

`给我候选路线和更多透明度`

适合：

- 可视化候选路线
- 需要更多可解释性
- 想让用户或工程师看到更多 routing 信息

这个 demo 里：

- `quote` 负责说明“最短查询路径”
- `routes` 负责说明“更高透明度和控制力”

## 8. 为什么状态查询单独做

如果强行把状态查询和“现场执行一笔交易”绑死，公开 demo 的失败率会非常高。

所以这里采用更务实的方案：

- `txHash` 手动输入
- `fromChain / toChain / bridge` 作为可选辅助参数
- 页面单独展示状态结果和跳转链接

这样有两个好处：

1. 不会被钱包和测试资金拖慢 demo 主线
2. 依然能证明你理解真实跨链生命周期

## 9. 这个 demo 最想强调的 developer experience 细节

### 1. API key 不要放前端

后续如果真的需要更高限流，放服务端就行。

### 2. Token 不能只靠 symbol

真正的标识应该是：

`chainId + token address`

### 3. amount 处理不能偷懒

UI 的 `10` 不是请求值，必须按 decimals 转换。

### 4. 错误不能只做 toast

应该固定展示：

- 当前状态
- 错误信息
- 重试建议

### 5. 结果不能只 dump JSON

应该先给 Summary，再给 Raw JSON。

## 10. 什么时候该用 Widget，什么时候该用 SDK/API

最后给一个最短判断：

### 用 Widget

当你想：

- 先最快上线
- 最快验证需求
- 先做 MVP 或 demo

### 用 SDK/API

当你想：

- 自己掌控 UI 和流程
- 自己做状态跟踪
- 自己做错误处理
- 自己控制服务端边界

一句话总结：

`Widget 适合最快落地，SDK/API 适合更深控制。`
