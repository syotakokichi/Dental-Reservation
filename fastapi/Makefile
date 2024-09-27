# Docker関連の変数
DOCKER_COMPOSE = docker-compose
DOCKER_EXEC = $(DOCKER_COMPOSE) exec api
DOCKER_RUN = $(DOCKER_COMPOSE) run --rm api

# アプリケーション関連の変数
PYTHON = python
ALEMBIC = alembic
PYTEST = pytest
PIP = pip

# データベース関連の操作
migrate:
	$(DOCKER_EXEC) $(PYTHON) -m $(ALEMBIC) upgrade head

migration:
	$(DOCKER_EXEC) $(PYTHON) -m $(ALEMBIC) revision --autogenerate -m "$(message)"

downgrade:
	$(DOCKER_EXEC) $(PYTHON) -m $(ALEMBIC) downgrade -1

reset-db:
	$(DOCKER_EXEC) $(PYTHON) -m $(ALEMBIC) downgrade base
	$(DOCKER_EXEC) $(PYTHON) -m $(ALEMBIC) upgrade head

# アプリケーション関連の操作
build:
	$(DOCKER_COMPOSE) build --no-cache

test:
	$(DOCKER_EXEC) $(PYTHON) -m $(PYTEST)

install:
	$(DOCKER_EXEC) $(PIP) install -r requirements.txt

# パッケージのインストール
install-pydantic-settings:
	$(DOCKER_EXEC) pip install pydantic-settings

# Docker関連の操作
up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

shell:
	$(DOCKER_EXEC) /bin/bash

# 追加のサービス関連のコマンド
mysql-shell:
	$(DOCKER_COMPOSE) exec mysql mysql -u user -p database

mailpit-logs:
	$(DOCKER_COMPOSE) logs -f mailpit

meilisearch-logs:
	$(DOCKER_COMPOSE) logs -f meilisearch

# ヘルプコマンド
help:
	@echo "Available commands:"
	@echo "  make migrate              : Run database migrations"
	@echo "  make migration message=.. : Create a new migration"
	@echo "  make downgrade            : Downgrade the database"
	@echo "  make reset-db             : Reset the database"
	@echo "  make run                  : Run the application"
	@echo "  make test                 : Run tests"
	@echo "  make install              : Install dependencies"
	@echo "  make up                   : Start Docker containers"
	@echo "  make down                 : Stop Docker containers"
	@echo "  make logs                 : View Docker logs"
	@echo "  make shell                : Open a shell in the api container"
	@echo "  make mysql-shell          : Open MySQL shell"
	@echo "  make mailpit-logs         : View Mailpit logs"
	@echo "  make meilisearch-logs     : View Meilisearch logs"

.PHONY: migrate migration downgrade reset-db build test install up down logs shell mysql-shell mailpit-logs meilisearch-logs help