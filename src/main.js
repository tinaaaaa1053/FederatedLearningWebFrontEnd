import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

// 导入ECharts
import * as echarts from 'echarts'

/**
 * 重点修改：受控的 Mock 加载逻辑
 * 只有当环境变量 VITE_USE_MOCK 为 'true' 时，才拦截网络请求
 */
if (import.meta.env.VITE_USE_MOCK === 'true') {
  console.warn('检测到 VITE_USE_MOCK=true，前端 Mock 拦截已启动');
  import('./mock/dashboard')
  import('./mock/jobManagement')
  import('./mock/modelManagement')
  import('./mock/clientManagement')
  import('./mock/dataQuality')
  import('./mock/setting')
}

const app = createApp(App)

// 全局挂载ECharts
app.config.globalProperties.$echarts = echarts

app.use(router)
app.mount('#app')