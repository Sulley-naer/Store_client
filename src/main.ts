import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import axios from 'axios'
import * as Sentry from '@sentry/vue'

export const app = createApp(App)

const data = import.meta.env

axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
console.log(data.VITE_API_KEY)

app.use(axios)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')

//前端异常拦截 https://fate-star-shape.sentry.io/issues/
Sentry.init({
  app,
  dsn: 'https://fc3d83e10f21ddc17c877351fc42d022@o4507985725423616.ingest.us.sentry.io/4507985795874816',
  integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})
