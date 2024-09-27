# ベースイメージとしてFastAPI専用の公式イメージを使用
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# 作業ディレクトリを設定
WORKDIR /app

# Pythonパッケージの依存関係をインストール
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# アプリケーションのソースコードをコピー
COPY ./ /app

# アプリケーションを起動
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]