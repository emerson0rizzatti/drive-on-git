<div align="center">
  <img src="https://unavatar.io/instagram/anitarizzatti" width="120" height="120" style="border-radius: 50%; border: 4px solid #cc2366;" alt="Anita Rizzatti" />
  <h1>Drive on Git</h1>
  <p><em>"Este sistema foi criado por Émerson Oliveira Rizzatti para sua filha Anita da Costa Rizzatti armazenar as fotos do seu trabalho como fotógrafa."</em></p>
  <p><a href="https://www.instagram.com/anitarizzatti">Siga no Instagram @anitarizzatti</a></p>
</div>

---

## 🚀 Sobre o Projeto

O **Drive on Git** é uma aplicação web idealizada para clonar (transferir) conteúdos de pastas diretamente do seu Google Drive para repositórios do GitHub. 
Esta ferramenta funciona sem armazenamento intermediário em disco persistente ou banco de dados, utilizando o limite máximo de repositórios do GitHub como host de arquivos do Google Drive.

### ✨ Funcionalidades

- **Dupla Autenticação OAuth2:** Login obrigatório tanto com a conta do Google (para acessar o Drive) quanto com o GitHub (para realizar o upload), integradas na mesma sessão unificada.
- **Drive Browser Integrado:** Navegue pela hierarquia de pastas do seu Google Drive de forma visual, ou cole diretamente o link direto.
- **Inspector de Arquivos e Limites GitHub:** Ferramenta interna de Validação que checa e avisa sobre os arquivos excedentes de 100MB (limite por arquivo do GitHub, os quais serão bloqueados/pulados automaticamente) e avisa se o peso somado do repositório final excederá a recomendação oficial de uso de até 1GB.
- **Repository Setup:** Crie um novo repositório limpo a partir da interface e defina a privacidade ou escolha injetar as fotos em um projeto existente catalogado no seu GitHub.
- **Engine de Streaming e SSE:** A clonagem de dados roda em background transferindo fluxos do Drive direto para o GitHub sem estourar a memória RAM do servidor. O status em tempo real com live feed item a item é conectado mediante a `Server-Sent Events` na UI.
- **Sem Banco de Dados:** Sessões geridas inteiramente em Memory/Cookies usando AES.
- **Separação de Identidade:** Todos os clones criados criam automaticamente metadados (Tópico: `drive-on-git`) para rastreabilidade, permitindo listar facilmente "Meus Projetos" feitos por esta plataforma.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído usando os melhores componentes baseados no design de Microsserviços:

**Backend (API Rest):**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Passport.js](https://www.passportjs.org/) (OAuth2 Google & GitHub)
- [cookie-session](https://www.npmjs.com/package/cookie-session) para statefulness em cache
- [Zod](https://zod.dev/) para validações e restrições de rotas
- [Axios](https://axios-http.com/ptbr/docs/intro) para conversas inter-server APIs (Google & GitHub)

**Frontend (SPA - Single Page Application):**
- [React 18](https://react.dev/) + [ViteJS](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MUI V7 (Material UI)](https://mui.com/) para todos os elementos visuais, usando Dark Mode Glassmorphism nativo
- [TanStack Query (React Query)](https://tanstack.com/query/latest) implementando a arquitetura Suspense-first 
- [TanStack Router](https://tanstack.com/router/latest) implementando roteamento modular client-side

---

## 💻 Instalação em Localhost

Para compilar e rodar o Drive on Git no seu computador, é necessário ter credenciais de aplicativos criados no **Google Cloud Console** (Google Drive API ativada) e **GitHub Developer Settings** (OAuth App), ajustando todas as URLS de Callbacks para `http://localhost:3001`.

1. **Clone o repositório:**
```bash
git clone https://github.com/emerson0rizzatti/drive-on-git.git
cd drive-on-git
```

2. **Configuração Backend:**
```bash
cd backend
npm install
```
Edite o arquivo `.env` preenchendo as seguintes chaves:
```env
GOOGLE_CLIENT_ID=sua_chave_google
GOOGLE_CLIENT_SECRET=seu_secret_google
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

GITHUB_CLIENT_ID=sua_chave_github
GITHUB_CLIENT_SECRET=seu_secret_github
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=string_secreta_local
```
Rode o servidor de API: `npm run dev`

3. **Configuração Frontend:**
```bash
cd ../frontend
npm install
```
Edite o arquivo `.env` (ou use `.env.local`):
```env
VITE_API_URL=http://localhost:3001
```
Inicie a interface em modo de desenvolvimento: `npm run dev`

---

## 🌐 Deploy na Nuvem (Render.com)

Esta aplicação foi preparada nativamente para ser hospedada na infraestrutura do **Render**. As definições detalhadas de instâncias estão mapeadas nos respectivos blueprints (como Static Site + Web Service Express). 

Siga este pipeline para colocar online:
1. No [Render.com](https://render.com/), sincronize seu acesso GitHub e selecione **"New" > "Blueprint"**. Conecte este este repositório.
2. O Render detectará automaticamente e fará merge do Backend (`./backend/render.yaml`) e do Frontend (`./frontend/render.yaml`).
3. Uma tela de preenchimento vai surgir com as variáveis que declaramos como em branco (As chaves secretas do Google/GitHub). Cole seus Environment Variables lá. **Importante:** Atualize agora os Callbacks no painel de DEV das plataformas (Google e GitHub) mudando de localhost para o subdomínio HTTPS que o render deu à sua API web. 
4. Defina o `VITE_API_URL` da aplicação Static Page Site do front para ser sua URL que o render gerou pra API do back.
5. Inicie a publicação. 

---
_Criado em contribuição com IA._
