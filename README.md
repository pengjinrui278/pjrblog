# PJR Blog

基于 Next.js 16 的全栈个人博客，xlab 软件部门训练营结项项目。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | SQLite + Prisma 7 |
| 认证 | NextAuth.js v5 (JWT + Credentials) |
| 部署 | Docker + GitHub Actions (计划中) |

## 功能模块

### 已实现 (基础模块)

- **用户系统** — 注册、登录、JWT 会话管理
- **博客 CRUD** — 创建、编辑、删除、文章列表、文章详情
- **评论系统** — 文章评论区，支持删除自己的评论
- **点赞功能** — 文章点赞/取消点赞

### 待实现 (进阶功能)

- AI 写作助手
- MCP 协议集成
- Docker 容器化部署
- CI/CD 自动部署
- 全文搜索
- 暗黑模式

## 项目结构

```
pjr-blog/
├── prisma/
│   ├── schema.prisma                # 数据库模型定义
│   └── migrations/                  # 数据库迁移文件
├── src/
│   ├── app/
│   │   ├── layout.tsx               # 全局布局 + 导航栏
│   │   ├── page.tsx                 # 首页 (文章列表)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # 登录页
│   │   │   └── register/page.tsx    # 注册页
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # 管理后台 (我的文章)
│   │   │   └── posts/
│   │   │       ├── new/page.tsx     # 写文章
│   │   │       └── [id]/edit/       # 编辑文章
│   │   ├── posts/
│   │   │   ├── page.tsx             # 文章列表页
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         # 文章详情页
│   │   │       ├── LikeButton.tsx   # 点赞按钮
│   │   │       └── CommentForm.tsx  # 评论表单
│   │   └── api/auth/               # NextAuth API 路由
│   └── lib/
│       ├── prisma.ts                # Prisma 客户端单例
│       ├── auth.ts                  # NextAuth 配置
│       ├── actions.ts               # Server Actions (所有业务逻辑)
│       └── types.ts                 # TypeScript 类型扩展
├── public/                          # 静态资源
├── .env                             # 环境变量
├── package.json
├── tsconfig.json
├── tailwind.config.ts (via postcss)
└── next.config.ts
```

## 数据库模型

| 模型 | 字段 |
|------|------|
| **User** | id, name, email, password, image, createdAt |
| **Post** | id, title, slug, content, excerpt, published, authorId, createdAt |
| **Comment** | id, content, authorId, postId, createdAt |
| **Like** | id, userId, postId (唯一约束: userId + postId) |

## 如何启动

### 1. 克隆项目

```bash
git clone https://github.com/pengjinrui278/pjrblog.git
cd pjrblog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

项目已包含 `.env` 文件，如需修改：

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="你的密钥"
```

生成新密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. 初始化数据库

```bash
npx prisma migrate dev
```

### 5. 启动开发服务器

```bash
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

### 6. 构建生产版本

```bash
npm run build
npm start
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npx prisma studio` | 打开数据库管理界面 |

## 完成时间线

- **2026-06-02** — 从 Hexo 迁移到 Next.js，完成 4 个基础模块搭建
