# Precrastine-se Backend

Backend completo em Python Flask para o aplicativo Precrastine-se de gerenciamento de tarefas e Roda da Vida.

## 🚀 Funcionalidades

### ✅ Autenticação
- Registro de usuários
- Login com JWT
- Proteção de rotas
- Gerenciamento de sessões

### 📋 Gerenciamento de Tarefas
- CRUD completo de tarefas
- Categorização e priorização
- Datas de vencimento
- Status de conclusão
- Filtros e busca

### 🎯 Roda da Vida
- 8 áreas da vida pré-definidas
- Sistema de pontuação (1-10)
- Acompanhamento de progresso
- Histórico de atualizações

### 👤 Perfil do Usuário
- Upload e processamento de fotos
- Edição de informações pessoais
- Estatísticas de uso

## 🛠️ Tecnologias

- **Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Pillow** - Processamento de imagens
- **CORS** - Suporte a requisições cross-origin

## 📦 Instalação

### 1. Pré-requisitos
```bash
# Python 3.8 ou superior
python --version

# pip (gerenciador de pacotes)
pip --version
```

### 2. Instalação das dependências
```bash
# Instalar dependências
pip install -r requirements.txt
```

### 3. Configuração
```bash
# Copiar arquivo de configuração
cp .env.example .env

# Editar configurações se necessário
nano .env
```

### 4. Executar o servidor
```bash
# Método 1: Usando o script run.py
python run.py

# Método 2: Usando Flask diretamente
python app.py

# Método 3: Usando flask run
export FLASK_APP=app.py
flask run
```

## 🔗 Endpoints da API

### Autenticação
```
POST /api/auth/register    # Registrar usuário
POST /api/auth/login       # Login
GET  /api/auth/me          # Dados do usuário atual
```

### Usuários
```
PUT  /api/users/profile    # Atualizar perfil
```

### Tarefas
```
GET    /api/tasks          # Listar tarefas
POST   /api/tasks          # Criar tarefa
PUT    /api/tasks/:id      # Atualizar tarefa
DELETE /api/tasks/:id      # Deletar tarefa
```

### Roda da Vida
```
GET /api/life-areas        # Listar áreas da vida
PUT /api/life-areas/:id    # Atualizar pontuação
```

### Estatísticas
```
GET /api/stats             # Estatísticas do usuário
```

### Utilitários
```
GET /api/health            # Status da API
```

## 📊 Estrutura do Banco de Dados

### Tabela: users
- `id` (String) - Chave primária UUID
- `email` (String) - Email único
- `name` (String) - Nome do usuário
- `password_hash` (String) - Senha criptografada
- `photo` (Text) - Foto em base64
- `created_at` (DateTime) - Data de criação
- `updated_at` (DateTime) - Data de atualização

### Tabela: tasks
- `id` (String) - Chave primária UUID
- `title` (String) - Título da tarefa
- `description` (Text) - Descrição
- `completed` (Boolean) - Status de conclusão
- `priority` (String) - Prioridade (low/medium/high)
- `category` (String) - Categoria
- `due_date` (DateTime) - Data de vencimento
- `created_at` (DateTime) - Data de criação
- `updated_at` (DateTime) - Data de atualização
- `user_id` (String) - FK para users

### Tabela: life_areas
- `id` (String) - Chave primária
- `name` (String) - Nome da área
- `score` (Integer) - Pontuação (1-10)
- `color` (String) - Cor em hexadecimal
- `icon` (String) - Nome do ícone
- `last_updated` (DateTime) - Última atualização
- `user_id` (String) - FK para users

## 🔐 Segurança

### Autenticação JWT
- Tokens com expiração de 7 dias
- Proteção de rotas sensíveis
- Validação de usuário em cada requisição

### Senhas
- Hash usando Werkzeug (PBKDF2)
- Salt automático
- Verificação segura

### Upload de Imagens
- Processamento e redimensionamento
- Conversão para JPEG
- Limite de tamanho (16MB)
- Validação de formato

## 📈 Monitoramento

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Logs
- Erros são logados automaticamente
- Debug mode para desenvolvimento
- Rollback automático em caso de erro

## 🧪 Dados de Demonstração

O sistema cria automaticamente:
- **Usuário demo**: `demo@precrastine.com` / `demo123`
- **8 áreas da vida** com pontuação inicial 5
- **3 tarefas de exemplo** com diferentes prioridades

## 🚀 Deploy

### Desenvolvimento
```bash
export FLASK_ENV=development
python run.py
```

### Produção
```bash
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🔧 Configurações Avançadas

### Variáveis de Ambiente
```bash
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=sua-chave-secreta
JWT_SECRET_KEY=sua-chave-jwt
DATABASE_URL=sqlite:///precrastine.db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Banco de Dados Personalizado
```python
# Para PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/precrastine

# Para MySQL
DATABASE_URL=mysql://user:password@localhost/precrastine
```

## 🐛 Troubleshooting

### Erro de CORS
- Verificar configuração de CORS_ORIGINS
- Adicionar domínio do frontend

### Erro de Banco de Dados
- Verificar se SQLite está instalado
- Permissões de escrita na pasta

### Erro de JWT
- Verificar JWT_SECRET_KEY
- Token pode estar expirado

## 📝 Licença

Este projeto é parte do sistema Precrastine-se e está sob licença MIT.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para ajudar você a vencer a procrastinação!**