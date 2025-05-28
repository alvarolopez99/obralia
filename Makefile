.PHONY: install dev build start test lint clean help run-backend run-frontend run-all

# Variables
NODE_ENV ?= development
PORT ?= 3000

# Colores para los mensajes
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Muestra la ayuda
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  ${BLUE}make install${NC}    - Instala las dependencias del proyecto"
	@echo "  ${BLUE}make dev${NC}        - Inicia el servidor de desarrollo"
	@echo "  ${BLUE}make build${NC}      - Construye la aplicación para producción"
	@echo "  ${BLUE}make start${NC}      - Inicia la aplicación en modo producción"
	@echo "  ${BLUE}make test${NC}       - Ejecuta los tests"
	@echo "  ${BLUE}make lint${NC}       - Ejecuta el linter"
	@echo "  ${BLUE}make clean${NC}      - Limpia los archivos generados"
	@echo "  ${BLUE}make run-backend${NC} - Levanta el backend"
	@echo "  ${BLUE}make run-frontend${NC} - Levanta el frontend"
	@echo "  ${BLUE}make run-all${NC}    - Levanta el backend y el frontend"
	@echo ""

install: ## Instala las dependencias
	@echo "${BLUE}Instalando dependencias...${NC}"
	cd frontend && npm install
	@echo "${GREEN}✓ Dependencias instaladas${NC}"

dev: ## Inicia el servidor de desarrollo
	@echo "${BLUE}Iniciando servidor de desarrollo...${NC}"
	cd frontend && npm run dev

build: ## Construye la aplicación para producción
	@echo "${BLUE}Construyendo aplicación...${NC}"
	cd frontend && npm run build
	@echo "${GREEN}✓ Aplicación construida${NC}"

start: ## Inicia la aplicación en modo producción
	@echo "${BLUE}Iniciando aplicación en modo producción...${NC}"
	cd frontend && npm start

test: ## Ejecuta los tests
	@echo "${BLUE}Ejecutando tests...${NC}"
	cd frontend && npm test

lint: ## Ejecuta el linter
	@echo "${BLUE}Ejecutando linter...${NC}"
	cd frontend && npm run lint

clean: ## Limpia los archivos generados
	@echo "${BLUE}Limpiando archivos generados...${NC}"
	rm -rf frontend/.next
	rm -rf frontend/node_modules
	@echo "${GREEN}✓ Archivos limpiados${NC}"

run-backend:
	cd backend/src/Obralia.API && dotnet run

run-frontend:
	cd frontend && npm run dev

run-all:
	( cd backend/src/Obralia.API && dotnet run & ) && ( cd frontend && npm run dev )

# Comando por defecto
.DEFAULT_GOAL := help 