# Precrastine-se -

Um aplicativo completo de gerenciamento de tarefas e equilíbrio de vida, desenvolvido com React + TypeScript no frontend e Python Flask no backend.

## 🚀 Funcionalidades

### ✅ Gerenciamento de Tarefas
- **Quadro Kanban** com drag & drop
- **Priorização** (Alta, Média, Baixa)
- **Categorização** por áreas
- **Datas de vencimento**
- **Busca global** em tempo real
- **Filtros avançados**
- **Estatísticas** de produtividade

### 🎯 Roda da Vida
- **8 áreas fundamentais** da vida
- **Sistema de pontuação** (1-10)
- **Visualização gráfica** do progresso
- **Acompanhamento temporal**
- **Metas de equilíbrio**

### 👤 Sistema de Usuários
- **Autenticação JWT** segura
- **Perfis personalizáveis**
- **Upload de fotos**
- **Dados protegidos**

### 📊 Dashboard Unificado
- **Visão geral** completa
- **Métricas importantes**
- **Tarefas prioritárias**
- **Progresso visual**

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **@dnd-kit** para drag & drop
- **Recharts** para gráficos
- **Vite** como bundler

### Backend
- **Python Flask** framework web
- **SQLAlchemy** ORM
- **SQLite** banco de dados
- **JWT** autenticação
- **Pillow** processamento de imagens
- **CORS** suporte cross-origin

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+ e npm
- Python 3.8+ e pip

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd precrastine-se
```

### 2. Configure o Backend
```bash
cd backend

# Instale as dependências Python
pip install -r requirements.txt

# Execute o servidor backend
python run.py
```

O backend estará disponível em `http://localhost:5000`

### 3. Configure o Frontend
```bash
# Em outro terminal, volte para a raiz
cd ..

# Instale as dependências Node.js
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🔗 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário atual

### Tarefas
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Roda da Vida
- `GET /api/life-areas` - Listar áreas da vida
- `PUT /api/life-areas/:id` - Atualizar pontuação

### Perfil
- `PUT /api/users/profile` - Atualizar perfil

### Estatísticas
- `GET /api/stats` - Estatísticas do usuário

## 🧪 Dados de Demonstração

O sistema inclui dados de demonstração:
- **Usuário demo**: `demo@precrastine.com` / `demo123`
- **8 áreas da vida** pré-configuradas
- **Tarefas de exemplo** com diferentes prioridades

## 🏗️ Estrutura do Projeto

```
precrastine-se/
├── backend/                 # Backend Python Flask
│   ├── app.py              # Aplicação principal
│   ├── models.py           # Modelos do banco
│   ├── config.py           # Configurações
│   ├── utils.py            # Utilitários
│   ├── run.py              # Script de execução
│   ├── requirements.txt    # Dependências Python
│   └── README.md           # Documentação do backend
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── contexts/           # Contextos (Auth)
│   ├── hooks/              # Hooks customizados
│   ├── types/              # Definições TypeScript
│   └── main.tsx            # Ponto de entrada
├── public/                 # Arquivos públicos
└── README.md               # Este arquivo
```

## 🎨 Design e UX

- **Design responsivo** para todos os dispositivos
- **Fonte Poppins** para melhor legibilidade
- **Cores harmoniosas** e acessíveis
- **Animações suaves** e micro-interações
- **Interface intuitiva** e moderna

## 🔐 Segurança

- **Autenticação JWT** com expiração
- **Senhas criptografadas** com hash seguro
- **Validação de dados** no frontend e backend
- **Proteção CORS** configurada
- **Sanitização** de uploads de imagem

## 📱 Responsividade

- **Mobile-first** design
- **Breakpoints** otimizados
- **Menu lateral** adaptativo
- **Componentes flexíveis**

## 🚀 Deploy

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy da pasta dist/
```

### Backend (Heroku/Railway)
```bash
# Configure as variáveis de ambiente
# Deploy da pasta backend/
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

- [ ] Notificações push
- [ ] Sincronização offline
- [ ] Temas personalizáveis
- [ ] Integração com calendários
- [ ] Relatórios avançados
- [ ] Compartilhamento de tarefas


**Desenvolvido com ❤️ para ajudar você a vencer a procrastinação e equilibrar sua vida!**
