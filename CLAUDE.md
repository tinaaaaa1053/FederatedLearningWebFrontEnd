# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

联邦学习平台前端项目 (Federated Learning Platform Frontend) - A Vue 3 web application for managing federated learning jobs, models, and clients.

## Development Commands

```bash
npm run dev      # Start dev server on http://localhost:8080
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

## Architecture

### Directory Structure
- `src/views/index.vue` - Main layout with sidebar navigation and header
- `src/views/fl/` - Feature modules: dashboard, jobManagement, modelManagement, clientManagement, dataQuality, setting
- `src/api/` - API service functions using axios
- `src/mock/` - MockJS mock data (only loaded in development)
- `src/utils/request.js` - Axios instance with request/response interceptors
- `src/router/index.js` - Route definitions, all routes nested under `/fl`

### Key Patterns

**API Layer**: Uses `src/utils/request.js` as axios wrapper with:
- Base URL: `/api` (proxied to `http://localhost:3000` in dev)
- JWT token auto-attached from localStorage
- 401 handling redirects to `/login`

**Mock Data**: MockJS intercepts API calls in development. Each feature module has a corresponding mock file in `src/mock/`.

**ECharts**: Globally mounted as `$echarts`. Used for training metrics visualization (accuracy, loss charts).

**Styling**: TailwindCSS with custom dark theme. Key colors defined in `tailwind.config.js`:
- `primary`: #0B1E39
- `accent`: #76B900 (green accent for status indicators)
- `secondary`: #1E293B

**Route Structure**: All authenticated routes under `/fl` path, with layout wrapper in `src/views/index.vue`.
