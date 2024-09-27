# Node.js 22のAlpineベースイメージを使用
FROM node:22-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージマネージャにnpmを使用
# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# Next.jsアプリケーションをビルド
RUN npm run build

# アプリケーションを起動
CMD ["npm", "run", "dev"]

# 3000番ポートを公開
EXPOSE 3000