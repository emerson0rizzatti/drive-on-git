# Drive on Git — Requisitos e Regras de Negócio

> Sistema para clonar pastas do Google Drive diretamente para repositórios do GitHub, com autenticação OAuth2 para ambos os serviços.

---

## Resposta à Dúvida: Repositório Público ou Privado?

> [!IMPORTANT]
> **Sim, o repositório precisa ser público para que qualquer pessoa veja os arquivos sem autenticação.**
>
> Repositórios **privados** no GitHub só podem ser acessados por usuários com permissão explícita (owner, colaboradores ou membros de organização).
>
> Repositórios **públicos** são visíveis para qualquer pessoa na internet, sem login.
>
> **Decisão recomendada:** O sistema deve deixar o usuário escolher entre **público** ou **privado** no momento da criação do repositório. A decisão deve ser informada claramente na UI: _"Repositórios públicos são visíveis para qualquer pessoa. Repositórios privados requerem autenticação GitHub para acesso."_

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 18 + TypeScript + MUI v7 + TanStack Router + TanStack Query |
| **Backend** | Node.js + Express + TypeScript |
| **Validação** | Zod (backend) |
| **Erros** | Sentry (backend) |
| **Autenticação** | OAuth2 via Google (Drive) + OAuth2 via GitHub |
| **Hospedagem** | Render.com (frontend: Static Site / backend: Web Service) |
| **Banco de dados** | ❌ Nenhum — sessão mantida em memória/token no frontend |

---

## Atores

| Ator | Descrição |
|---|---|
| **Usuário** | Pessoa autenticada no Google Drive e no GitHub |
| **Sistema** | Backend Node.js que orquestra as operações com as APIs |

---

## Requisitos Funcionais

### RF-01 — Autenticação Google (OAuth2 Drive)
- O sistema deve permitir login com conta Google via OAuth2
- O escopo mínimo necessário: `https://www.googleapis.com/auth/drive.readonly`
- O token de acesso é armazenado temporariamente na sessão (sem banco de dados)
- O sistema deve verificar se o token é válido antes de cada operação
- **Regra de negócio:** O usuário só pode avançar no fluxo se estiver autenticado em ambos os serviços

### RF-02 — Autenticação GitHub (OAuth2)
- O sistema deve permitir login com conta GitHub via OAuth2
- Se o usuário não tiver conta GitHub, o sistema deve exibir link para criação de conta em `github.com/join`
- Escopo necessário: `repo` (criar e escrever em repositórios)
- **Regra de negócio:** O login GitHub é obrigatório para qualquer operação de clonagem

### RF-03 — Verificação Dupla de Login
- A tela inicial deve exibir o status de autenticação dos dois serviços
- Ambos devem estar conectados antes de liberar as funcionalidades principais
- Status visual: `✅ Conectado` / `❌ Desconectado` com botão de ação correspondente

### RF-04 — Seleção da Pasta de Origem (Drive)

#### Opção A — Cole o link da pasta
- Campo de texto para colar URL de pasta do Google Drive
- Formato aceito: `https://drive.google.com/drive/folders/{folderId}`
- O sistema extrai o `folderId` da URL automaticamente
- Validação: verificar se a URL é válida e se o usuário tem acesso à pasta

#### Opção B — Navegar nas pastas do Drive
- Interface de exploração de pastas estilo _file browser_
- Navegar recursivamente pelas pastas do Drive do usuário autenticado
- Exibir nome, data de modificação e tamanho estimado
- Seleção de uma pasta confirma a origem

### RF-05 — Verificação da Pasta de Origem
Após seleção da pasta, o sistema deve:
1. Listar todos os arquivos (incluindo subpastas recursivamente)
2. Exibir: nome do arquivo, tamanho em MB, caminho relativo
3. Identificar e sinalizar arquivos **acima de 100 MB** (limite GitHub por arquivo)
4. Calcular o **tamanho total da pasta** e comparar com o limite de 1 GB do repositório
5. Exibir resumo: total de arquivos, tamanho total, quantos arquivos serão ignorados (>100MB)

> [!WARNING]
> **Limites do GitHub que serão verificados:**
> - 🚫 **100 MB por arquivo** — arquivos acima deste limite são rejeitados pelo GitHub e serão ignorados na clonagem
> - ⚠️ **1 GB por repositório** — pastas cujo tamanho total ultrapassar 1 GB podem causar falha ou degradação no repositório
>
> O sistema calculará esses limites **antes** de iniciar a clonagem e alertará o usuário caso qualquer limite seja violado.

**Regras de negócio — Limites do GitHub:**
- Arquivos > 100 MB são **bloqueados** pelo GitHub e devem ser excluídos da clonagem
- Se o tamanho total dos arquivos válidos ultrapassar **1 GB**, o sistema exibe aviso de alto risco e solicita confirmação explícita para prosseguir
- O sistema deve alertar o usuário sobre cada arquivo ignorado antes de prosseguir
- O usuário deve confirmar ciência dos arquivos ignorados e dos limites para continuar

### RF-06 — Seleção do Destino (GitHub)

#### Opção A — Repositório existente
- O sistema solicita confirmação do usuário para listar seus repositórios do GitHub
- Exibe lista de repositórios com: nome, visibilidade (público/privado), data de atualização
- O usuário seleciona o repositório de destino
- **Regra de negócio:** Apenas repositórios onde o usuário é **owner** podem ser selecionados

#### Opção B — Novo repositório
- Campos obrigatórios: **Nome** e **Descrição**
- Campo de escolha: **Público** ou **Privado**
  - Texto de apoio: _"Repositórios públicos são visíveis para qualquer pessoa. Repositórios privados requerem autenticação."_
- **Regra de negócio:** Todo repositório criado pelo sistema recebe automaticamente o tópico/rótulo `drive-on-git`
- Validação do nome: sem espaços, caracteres especiais (GitHub aceita apenas letras, números e hífens)

### RF-07 — Marcação de Repositórios
- Todo repositório criado pelo sistema recebe o tópico do GitHub: **`drive-on-git`**
- Isso permite que o sistema filtre e liste apenas esses repositórios na tela de gerenciamento
- **Regra de negócio:** O rótulo `drive-on-git` é adicionado automaticamente, sem opção de remoção pelo usuário durante a criação

### RF-08 — Confirmação de Origem e Destino
Antes de iniciar a clonagem, o sistema exibe um resumo:
- **Origem:** Nome da pasta do Drive, total de arquivos, tamanho total
- **Destino:** Nome do repositório GitHub, visibilidade (público/privado), URL
- **Arquivos ignorados:** Lista de arquivos >100MB que serão pulados
- Botões: `Confirmar e Clonar` / `Cancelar`

### RF-09 — Processo de Clonagem
1. O backend faz download de cada arquivo do Drive (via Google Drive API)
2. O backend faz upload de cada arquivo para o repositório GitHub (via GitHub API — commits)
3. A UI exibe barra de progresso com: arquivo atual, progresso geral (X de Y arquivos)
4. Ao final, exibe mensagem de sucesso com link para o repositório

**Regras de negócio durante a clonagem:**
- Arquivos >100 MB são pulados automaticamente (já avisado na etapa anterior)
- Em caso de falha em um arquivo, o sistema registra o erro, continua com os demais e exibe relatório ao final
- A estrutura de pastas do Drive é replicada no repositório (caminhos relativos preservados)

### RF-10 — Gerenciamento de Repositórios "Drive on Git"
- Tela dedicada para listar os repositórios do usuário marcados com o tópico `drive-on-git`
- Informações exibidas: nome, descrição, visibilidade, data de atualização, link direto
- Ações disponíveis: abrir no GitHub (nova aba)
- **Regra de negócio:** A listagem é feita em tempo real via GitHub API (sem cache local/banco de dados)

### RF-11 — Exclusão da Pasta de Origem (Opcional)
- Após a conclusão bem-sucedida da clonagem, o sistema deve verificar se o usuário autenticado é o proprietário da pasta original no Google Drive.
- Caso o usuário seja o proprietário, o sistema deve oferecer a opção de excluir a pasta do Drive para liberar espaço.
- **Regra de negócio:** A funcionalidade de exclusão só deve ser exibida se:
  1. A clonagem foi 100% bem-sucedida.
  2. A pasta é de propriedade do usuário logado (`ownedByMe: true` via API do Drive).
- O sistema solicita confirmação explícita antes de deletar: _"Deseja excluir a pasta original do Google Drive para liberar espaço? Esta ação não pode ser desfeita."_
### RF-12 — Logout de Contas
- O sistema deve oferecer um botão de "Sair" visível em todas as telas (geralmente na barra superior).
- Ao clicar em "Sair", o sistema deve encerrar a sessão no backend e limpar as informações de autenticação do Google e GitHub do cliente.
- O usuário deve ser redirecionado para a tela inicial após o logout.
- **Regra de negócio:** O logout deve invalidar a sessão atual no backend, garantindo que o acesso seja removido até um novo login.

---

## Requisitos Não-Funcionais

### RNF-01 — Segurança
- Tokens OAuth (Google e GitHub) **nunca** trafegam no frontend armazenados em localStorage
- Tokens são armazenados em memória de sessão no backend (ou em cookies HttpOnly)
- Toda comunicação frontend ↔ backend via HTTPS
- O backend nunca expõe tokens diretamente ao cliente

### RNF-02 — Sem banco de dados
- O sistema não usa banco de dados
- Estado de sessão mantido via token JWT ou cookies de sessão no backend (em memória do processo)
- **Consequência conhecida:** Reiniciar o servidor apaga todas as sessões ativas (usuários precisam reautenticar)

### RNF-03 — Hospedagem no Render.com
- **Frontend:** Deploy como _Static Site_ (build React)
- **Backend:** Deploy como _Web Service_ (Node.js)
- Variáveis de ambiente gerenciadas pelo painel do Render
- Sem custo de banco de dados

### RNF-04 — Performance
- Listagem de pastas do Drive: paginada (não carregar tudo de uma vez)
- Clonagem: processo assíncrono com feedback em tempo real (SSE ou polling)
- Arquivos grandes: streamed (não carregar em memória completa)

### RNF-05 — Limites de API
| API | Limite relevante |
|---|---|
| GitHub | **100 MB por arquivo** (hard limit — upload bloqueado) |
| GitHub | **1 GB por repositório** (hard limit — repositório pode ser desativado) |
| Google Drive API | 1.000.000.000 unidades de cota/dia |
| GitHub API | 5.000 requisições/hora (autenticado) |

### RNF-06 — Idioma da Interface
- Toda a interface com o usuário (textos, botões, mensagens de erro, alertas e logs) deve ser escrita obrigatoriamente em **Língua Portuguesa falada no Brasil (pt-BR)**.

---

## Fluxo Principal (Happy Path)

```
1. Usuário acessa o sistema
2. [RF-01] Faz login no Google → autoriza acesso ao Drive
3. [RF-02] Faz login no GitHub → autoriza criação de repositórios
4. [RF-03] Sistema confirma ambos os logins ✅
5. [RF-04] Usuário seleciona pasta de origem no Drive
6. [RF-05] Sistema verifica arquivos e exibe relatório
7. [RF-06] Usuário escolhe destino (repositório novo ou existente)
8. [RF-08] Sistema exibe tela de confirmação
9. [RF-09] Clonagem é executada com barra de progresso
10. Sistema exibe sucesso com link para o repositório
```

---

## Fluxos Alternativos e de Exceção

| Situação | Comportamento |
|---|---|
| Pasta do Drive inacessível | Erro claro: _"Você não tem permissão para acessar esta pasta"_ |
| Todos os arquivos >100MB | Sistema bloqueia clonagem e informa ao usuário |
| Nome de repositório já existe | Sistema sugere variações ou pede outro nome |
| Falha de rede durante clonagem | Relatório de arquivos copiados e arquivos com falha |
| Token OAuth expirado | Sistema redireciona para reautenticação antes de continuar |
| Repositório existente selecionado | Confirmação extra: _"Os arquivos serão adicionados ao repositório. Arquivos com mesmo nome serão sobrescritos."_ |

---

## Estrutura de Features (Frontend)

Seguindo a skill `frontend-dev-guidelines`:

```
src/
  features/
    auth/               # Login Google + GitHub, status de autenticação
    drive-browser/      # Navegação de pastas do Drive, seleção de origem
    file-inspector/     # Verificação de arquivos, alertas de tamanho
    repo-selector/      # Listar/criar repositórios GitHub
    clone-job/          # Progresso de clonagem, relatório
    my-repos/           # Listagem de repositórios "Drive on Git"
  components/
    SuspenseLoader/
    CustomAppBar/
    AuthStatusBadge/
  routes/
    index.tsx           # Tela inicial / status de autenticação
    browse/index.tsx    # Seleção de origem
    destination/index.tsx
    confirm/index.tsx
    cloning/index.tsx
    my-repos/index.tsx
```

---

## Estrutura de Camadas (Backend)

Seguindo a skill `backend-dev-guidelines`:

```
src/
  config/              # unifiedConfig (OAuth credentials, URLs)
  controllers/         # AuthController, DriveController, GitHubController, CloneController
  services/            # authService, driveService, githubService, cloneService
  repositories/        # (sem DB — adapters para APIs externas)
  routes/              # authRoutes, driveRoutes, githubRoutes, cloneRoutes
  middleware/          # sessionMiddleware, authGuard, errorHandler
  validators/          # auth.schema.ts, clone.schema.ts, repo.schema.ts
  types/               # DriveFile, GitHubRepo, CloneJob, etc.
  utils/               # fileSizeHelper, urlParser
  instrument.ts        # Sentry
  app.ts
  server.ts
```

---

## Endpoints da API (Backend → GitHub/Google)

| Endpoint | Método | Descrição |
|---|---|---|
| `/auth/google` | GET | Inicia OAuth Google |
| `/auth/google/callback` | GET | Callback OAuth Google |
| `/auth/github` | GET | Inicia OAuth GitHub |
| `/auth/github/callback` | GET | Callback OAuth GitHub |
| `/auth/status` | GET | Retorna status dos 2 logins |
| `/auth/logout` | POST | Encerra sessão |
| `/drive/folders` | GET | Lista pastas raiz do Drive |
| `/drive/folders/:id` | GET | Lista conteúdo de uma pasta |
| `/drive/inspect/:id` | GET | Verifica arquivos, tamanhos, alertas |
| `/github/repos` | GET | Lista repositórios do usuário |
| `/github/repos` | POST | Cria novo repositório |
| `/clone/start` | POST | Inicia processo de clonagem |
| `/clone/status/:jobId` | GET | Status do job de clonagem (SSE ou polling) |
| `/drive/folders/:id` | DELETE | Exclui uma pasta do Drive (após verificação de ownership) |

---

## Critérios de Aceitação

- [ ] Usuário consegue autenticar Google + GitHub de forma independente
- [ ] Sistema rejeita fluxo se qualquer autenticação estiver ausente
- [ ] Arquivos >100 MB são identificados e listados antes da clonagem
- [ ] Todo repositório criado tem o tópico `drive-on-git`
- [ ] Repositório pode ser criado como público ou privado (escolha do usuário)
- [ ] Estrutura de pastas do Drive é preservada no repositório
- [ ] Tela "Meus Repositórios" lista somente repositórios com rótulo `drive-on-git`
- [ ] Sistema funciona sem banco de dados
- [ ] Frontend e backend funcionam no Render.com
