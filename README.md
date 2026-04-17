# FederatedLearningWebFrontEnd

联邦学习平台前端（Vue 3 + Vite），用于展示与管理联邦学习任务、模型、客户端、数据质量与系统设置。

本项目已经支持两种运行形态：

- **Mock 演示模式**：前端本地 Mock.js 拦截请求，不依赖后端
- **联调模式**：通过 Vite 代理请求后端 `FederatedLearningBackend`

---

## 1. 项目作用与职责

前端主要负责：

- 提供联邦学习平台可视化操作界面
- 调用后端 API 展示任务、模型、客户端等业务数据
- 以图表（ECharts/ECharts GL）呈现训练效果与数据质量
- 提供配置管理、用户管理等控制台能力

---

## 2. 技术栈

- 核心框架：Vue 3 (`^3.5.13`)
- 路由：Vue Router 4 (`^4.5.0`)
- 构建工具：Vite 6 (`^6.0.7`)
- HTTP 客户端：Axios (`^1.7.9`)
- 图表：ECharts (`^5.6.0`)、ECharts-GL (`^2.0.9`)
- 样式：Tailwind CSS (`^3.4.19`)
- 本地 Mock：Mock.js (`^1.1.0`)

`package.json` 脚本：

- `npm run dev`：开发环境
- `npm run build`：打包
- `npm run preview`：预览构建产物

---

## 3. 前端架构与目录

### 3.1 目录结构

```text
src/
├── main.js                  # 入口，挂载应用，按环境开关 Mock
├── App.vue                  # 根组件
├── router/
│   └── index.js             # 路由定义
├── views/
│   ├── index.vue            # 主布局页
│   └── fl/                  # 业务页面
│       ├── dashboard.vue
│       ├── jobManagement.vue
│       ├── modelManagement.vue
│       ├── clientManagement.vue
│       ├── dataQuality.vue
│       └── setting.vue
├── api/                     # 接口封装层
│   ├── dashboard.js
│   ├── jobManagement.js
│   ├── modelManagement.js
│   ├── clientManagement.js
│   ├── dataQuality.js
│   └── setting.js
├── utils/
│   └── request.js           # Axios 实例与拦截器
├── mock/                    # Mock.js 数据与拦截规则
└── assets/                  # 样式与静态资源
```

### 3.2 页面路由

来自 `src/router/index.js`：

- `/fl/dashboard`：仪表盘
- `/fl/jobManagement`：作业管理
- `/fl/modelManagement`：模型管理
- `/fl/clientManagement`：客户端管理
- `/fl/dataQuality`：数据质量分析
- `/fl/setting`：系统设置

根路径 `/` 会重定向到 `/fl/dashboard`。

---

## 4. 接口通信设计

### 4.1 Axios 基础行为（`src/utils/request.js`）

- `baseURL`：`import.meta.env.VITE_API_BASE_URL || '/api'`
- 请求超时：`10000ms`
- 请求拦截器：如果 `localStorage` 有 `token`，自动加 `Authorization: Bearer <token>`
- 响应拦截器：
  - `responseType === 'blob'` 时直接返回原响应（用于文件下载）
  - 普通响应要求 `res.code === 200`，否则按错误处理

### 4.2 Vite 代理（`vite.config.js`）

当前已配置：

- 前端开发端口：`8080`
- `/api` 代理到：`http://127.0.0.1:3000`
- **不做 rewrite**（保留 `/api` 前缀）

---

## 5. Mock 与联调开关

### 5.1 环境变量

`.env.development`：

- `VITE_USE_MOCK=false`（联调时）
- `VITE_API_BASE_URL=/api`

`.env.production`：

- `VITE_USE_MOCK=false`
- `VITE_API_BASE_URL=/`

### 5.2 Mock 加载逻辑（`src/main.js`）

仅当：

```js
import.meta.env.VITE_USE_MOCK === 'true'
```

才动态导入 `src/mock/*` 并拦截请求。

这意味着：

- `true`：前端本地假数据模式
- `false`：请求走后端（推荐联调）

---

## 6. 完整前端 API 封装清单

前缀统一由 `request.js` 的 `baseURL` 控制。

### 6.1 `src/api/dashboard.js`

| 方法名 | Method | Path | 说明 |
|---|---|---|---|
| `getDashboardStats` | GET | `/dashboard/stats` | 仪表盘统计 |
| `getClientList` | GET | `/dashboard/clients` | 仪表盘客户端列表 |
| `getCurrentJobProgress` | GET | `/dashboard/currentJob` | 当前任务进度 |
| `getRealTimeLogs` | GET | `/dashboard/logs` | 实时日志 |
| `getChartData(type)` | GET | `/dashboard/chart/{type}` | 图表数据 |

### 6.2 `src/api/jobManagement.js`

| 方法名 | Method | Path | 说明 |
|---|---|---|---|
| `getJobList(pageNo, pageSize, params)` | POST | `/job/list` | 分页任务列表 |
| `getJobDetail(jobId)` | GET | `/job/detail/{jobId}` | 任务详情 |
| `createJob(data)` | POST | `/job/create` | 创建任务 |
| `abortJob(jobId)` | POST | `/job/abort/{jobId}` | 中止任务 |
| `downloadJobLogs(jobId)` | GET | `/job/logs/{jobId}` | 下载任务日志（blob） |
| `getJobMetrics(jobId)` | GET | `/job/metrics/{jobId}` | 任务指标 |

### 6.3 `src/api/modelManagement.js`

| 方法名 | Method | Path | 说明 |
|---|---|---|---|
| `getModelList(pageNo, pageSize, params)` | POST | `/model/list` | 模型分页列表 |
| `getModelDetail(modelId)` | GET | `/model/detail/{modelId}` | 模型详情 |
| `uploadModel(data)` | POST | `/model/upload` | 上传模型（form-data） |
| `downloadModel(modelId)` | GET | `/model/download/{modelId}` | 下载模型（blob） |
| `validateModel(modelId)` | POST | `/model/validate/{modelId}` | 模型验证 |
| `compareModels(modelIds)` | POST | `/model/comparison` | 模型对比 |
| `deleteModel(modelId)` | POST | `/model/delete/{modelId}` | 删除模型 |

### 6.4 `src/api/clientManagement.js`

| 方法名 | Method | Path | 说明 |
|---|---|---|---|
| `getClientList(pageNo, pageSize, params)` | POST | `/client/list` | 客户端分页列表 |
| `getClientDetail(clientId)` | GET | `/client/detail/{clientId}` | 客户端详情 |
| `addClient(data)` | POST | `/client/add` | 添加客户端 |
| `deleteClient(clientId)` | POST | `/client/delete/{clientId}` | 删除客户端 |
| `updateClient(clientId, data)` | POST | `/client/update/{clientId}` | 更新客户端 |
| `reconnectClient(clientId)` | POST | `/client/reconnect/{clientId}` | 重连客户端 |

### 6.5 `src/api/dataQuality.js`

| 方法名 | Method | Path | 说明 |
|---|---|---|---|
| `getDataQualityStats()` | GET | `/dataQuality/stats` | 数据质量统计 |
| `getNodeQualityData()` | GET | `/dataQuality/nodes` | 节点质量数据 |
| `getDataDistribution()` | GET | `/dataQuality/distribution` | 分布数据 |
| `getWarningList(pageNo, pageSize, params)` | POST | `/dataQuality/warnings` | 警告分页 |
| `generateQualityReport(params)` | POST | `/dataQuality/report` | 生成报告（blob） |

### 6.6 `src/api/setting.js`

| 方法名 | Method | Path | 说明 |
|---|---|---|---|
| `getSettings()` | GET | `/settings/get` | 获取设置 |
| `saveSettings(data)` | POST | `/settings/save` | 保存设置 |
| `testConnection(params)` | POST | `/settings/testConnection` | 测试连接 |
| `addUser(data)` | POST | `/settings/user/add` | 添加用户 |
| `updateUser(userId, data)` | POST | `/settings/user/update/{userId}` | 更新用户 |
| `deleteUser(userId)` | POST | `/settings/user/delete/{userId}` | 删除用户 |
| `resetToDefaults()` | POST | `/settings/reset` | 重置默认设置 |

---

## 7. 启动方式

### 7.1 环境要求

- Node.js 18+（建议）
- npm

### 7.2 安装依赖

```bash
cd /Users/tina/Documents/project/4.4bishe/FederatedLearningWebFrontEnd
npm install
```

### 7.3 启动开发环境

```bash
npm run dev
```

默认监听 `http://localhost:8080`。

### 7.4 构建与预览

```bash
npm run build
npm run preview
```

---

## 8. 与后端联调（推荐流程）

### 8.1 后端准备

确保后端已启动（例如 Mock 模式）：

```bash
cd /Users/tina/Documents/project/4.4bishe/FederatedLearningBackend
MOCK_MODE=true python3 -m uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

### 8.2 前端准备

确认 `.env.development`：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
```

然后重启前端：

```bash
npm run dev
```

### 8.3 验证联调

浏览器打开控制台/Network，确认接口请求：

- 发起 URL：`/api/...`
- 实际代理目标：`http://127.0.0.1:3000/api/...`
- 返回 `code: 200`

---

## 9. 页面模块作用说明

### 9.1 Dashboard（仪表盘）

- 展示平台总体状态：活动任务、已完成任务、客户端在线情况
- 展示当前任务进度与日志
- 展示准确率/损失图表

### 9.2 Job Management（作业管理）

- 任务分页查询、详情查看
- 任务创建、任务中止
- 任务日志下载、指标查看

### 9.3 Model Management（模型管理）

- 模型分页查询、详情查看
- 模型上传/下载/验证/删除
- 模型对比可视化

### 9.4 Client Management（客户端管理）

- 客户端分页管理
- 添加、更新、删除、重连
- 查看设备信息、资源使用、参与任务

### 9.5 Data Quality（数据质量分析）

- 数据质量统计指标
- 节点质量 3D 可视化
- 质量分布与警告分析
- 报告导出（PDF）

### 9.6 Setting（设置）

- 连接参数、工作区、安全设置
- 用户管理（增删改）
- 连接测试与默认重置

---

## 10. 常见问题

### Q1：页面有数据但后端日志没有请求？

A：`VITE_USE_MOCK` 很可能为 `true`，前端请求被 Mock.js 拦截。

### Q2：接口一直 404？

A：检查 Vite 代理是否错误 rewrite 了 `/api`；当前配置应保留 `/api` 前缀。

### Q3：文件下载接口报错？

A：下载接口需 `responseType: 'blob'`（代码已处理），同时后端必须返回流式文件响应。

### Q4：生产环境能否使用前端 Mock？

A：不建议。生产构建应保持 `VITE_USE_MOCK=false`。

---

## 11. 建议的维护规范

- 新增页面时：同步新增 `src/api/*` 封装与后端接口文档
- 新增接口时：统一遵循 `{code, message, data}`
- 提交前至少自测：页面访问、接口成功率、下载功能、图表渲染
- 后续可引入：TypeScript、Pinia、ESLint + Prettier、统一错误码体系
