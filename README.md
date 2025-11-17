# AI传统剪纸设计应用

使用现代AI技术将照片、文字、语音转换为传统剪纸艺术，支持99种语言和多种书法风格。

## 功能特点

### 核心功能

- **照片转剪纸** - 上传任意照片，AI自动转换为传统剪纸风格
- **文字生成剪纸** - 用任意语言描述，AI生成精美剪纸图案
- **语音生成剪纸** - 支持99种语言语音输入，智能生成剪纸
- **多语言书法** - 中文、阿拉伯语、日语等多种语言书法生成
- **剪纸教程** - AI辅助学习传统剪纸技艺
- **作品管理** - 保存、下载、打印生成的作品

### 支持的语言

中文、English、العربية、日本語、한국어、हिन्दी、ไทย、Tiếng Việt、Español、Français、Deutsch、Русский 等99种语言

### 书法风格

- **中文**: 楷书、行书、草书、隶书、篆书
- **阿拉伯语**: Thuluth、Naskh、Diwani、Kufic
- **日语**: 楷書、行書、草書
- **英语**: Copperplate、Italic、Gothic

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI服务**:
  - Stable Diffusion (图像生成)
  - ControlNet (照片风格转换)
  - OpenAI Whisper (语音识别)
  - Claude AI (教程问答)
- **状态管理**: Zustand
- **动画**: Framer Motion

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd zhongyi-website

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API keys
```

### 配置 API Keys

在 `.env` 文件中配置以下 API keys：

```env
# 必需
OPENAI_API_KEY=your_openai_api_key      # 用于语音识别
REPLICATE_API_TOKEN=your_replicate_token # 用于图像生成
ANTHROPIC_API_KEY=your_anthropic_key     # 用于AI问答

# 可选
DATABASE_URL=your_database_url           # 存储用户数据
```

### 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
npm run start
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── generate/      # 图像生成 API
│   │   ├── transcribe/    # 语音转文字 API
│   │   ├── tutorial/      # 教程 API
│   │   └── tts/           # 文字转语音 API
│   ├── create/            # 创作页面
│   │   ├── photo/         # 照片转剪纸
│   │   ├── text/          # 文字生成
│   │   └── voice/         # 语音生成
│   ├── calligraphy/       # 书法生成
│   ├── tutorial/          # 教程
│   └── gallery/           # 作品库
├── components/            # React 组件
├── lib/                   # 工具函数和状态管理
└── types/                 # TypeScript 类型定义
```

## API 使用说明

### 文字生成剪纸

```typescript
POST /api/generate/text-to-papercut
{
  "prompt": "一条龙环绕祥云",
  "language": "zh"
}
```

### 照片转剪纸

```typescript
POST /api/generate/photo-to-papercut
{
  "image": "base64_image_data",
  "style": "traditional",
  "detailLevel": 50
}
```

### 书法生成

```typescript
POST /api/generate/calligraphy
{
  "text": "福",
  "language": "zh",
  "style": "kaishu"
}
```

### 语音转文字

```typescript
POST /api/transcribe
FormData: {
  "audio": Blob,
  "language": "zh"
}
```

## 费用估算

| 服务 | 价格 | 月预算 (1000次) |
|------|------|----------------|
| 语音转文字 | $0.006/分钟 | ~$6 |
| 图像生成 | $0.002/张 | ~$2 |
| AI对话 | $3/1M tokens | ~$3 |
| 语音合成 | $0.015/1K字符 | ~$5 |
| **总计** | | **~$16/月** |

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### Docker 部署

```bash
docker build -t ai-papercut .
docker run -p 3000:3000 ai-papercut
```

## 贡献指南

欢迎提交 Pull Request！请确保：

1. 代码通过 ESLint 检查
2. 添加必要的类型定义
3. 更新相关文档

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。
