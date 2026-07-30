# Roadmap — modernização de UX e design do dashboard

Status: implementação funcional concluída em 30/07/2026; auditorias empíricas
contínuas identificadas abaixo  
Projeto: `certifica-dashboard`

## Entrega implementada

- temas claro, escuro e automático com preferência persistida;
- tokens semânticos, tipografia Geist e gráficos compatíveis com os temas;
- shell responsivo com sidebar recolhível, navegação mobile, breadcrumbs e
  cabeçalho persistente;
- navegação ativa, seletor de tema e menu de perfil acessíveis;
- padrões reutilizáveis de cabeçalho, métricas, loading, vazio e erro;
- login, dashboard, publicações, mídia, usuários, integrações e configurações
  integrados ao novo sistema visual;
- confirmação acessível para exclusão de mídia e usuários;
- idioma, foco visível, redução de movimento, skip link e nomes de controles
  revisados;
- lint dos arquivos alterados e build de produção aprovados.

### Refinamento de experiência — segunda entrega

- gerenciamento de mídia movido do modal para a rota dedicada
  `/media/[id]`;
- prévia ampla da imagem com ações de URL e informações técnicas;
- metadados, transformação, locais de uso e histórico de versões separados em
  áreas legíveis;
- prévia visual de rotação e espelhamento antes de criar uma versão;
- biblioteca de mídia com cards navegáveis e hierarquia de ação mais clara;
- publicações com busca persistida na URL, filtros por status e visibilidade,
  visualizações em tabela/cards e ações agrupadas;
- tabela de publicações com resumo, autoria, desempenho, estado e data;
- configurações organizadas nas abas Perfil, Segurança e Aparência;
- integrações organizadas nas abas Tokens de acesso e Instalação do MCP.

As tarefas mantidas abertas exigem medição em navegador, leitor de tela,
telemetria real ou evolução funcional posterior; elas não bloqueiam o uso do
novo design.

## Objetivo

Evoluir o dashboard para uma interface moderna, consistente, acessível e
responsiva, com temas claro, escuro e automático, sem reescrever os fluxos de
negócio.

O resultado deve reduzir esforço cognitivo, melhorar descoberta de ações,
uniformizar feedbacks e permitir que posts, mídias, usuários, integrações e
configurações compartilhem o mesmo sistema visual.

## Diagnóstico atual

Pontos positivos:

- Next.js App Router, Tailwind CSS 4 e React 19;
- componentes shadcn/ui no estilo `new-york`;
- primitivas acessíveis do Radix;
- tokens CSS em OKLCH;
- `next-themes` já instalado;
- Lucide como biblioteca única de ícones;
- componentes reutilizáveis para cards, tabelas, diálogos e formulários.

Oportunidades:

- os tokens `.dark` existem, mas não há `ThemeProvider` nem seletor de tema;
- `components.json` ainda declara `darkMode: false`;
- o `<html>` não usa `suppressHydrationWarning`;
- várias telas usam `gray-*`, `black`, `white` e hex diretamente;
- cores de gráficos não seguem integralmente os tokens;
- sidebar e header têm estados ativos e contraste inconsistentes;
- navegação mobile não possui shell dedicado;
- layout usa medidas rígidas dependentes de `81px`;
- tipografia usa Roboto, mas não há escala tipográfica documentada;
- formulários possuem padrões diferentes de label, erro e ação;
- confirmação destrutiva nem sempre usa `AlertDialog`;
- estados de loading, vazio, erro e sucesso variam entre páginas;
- há animações globais sem tratamento explícito de `prefers-reduced-motion`;
- idioma do documento está como `en`, apesar da interface em português.

## Direção visual

### Personalidade

- profissional, editorial e técnica;
- clara o suficiente para trabalho prolongado;
- verde Certifica como acento, não como cor dominante de todas as superfícies;
- alta densidade de informação com hierarquia calma;
- sombras discretas, bordas suaves e pouco uso de efeitos translúcidos;
- evitar glassmorphism generalizado, gradientes decorativos e múltiplas cores de
  destaque competindo.

### Base

- shadcn/ui `new-york`;
- base cromática neutral/zinc com verde Certifica como `primary`;
- Geist Sans para interface e Geist Mono para IDs, métricas e dados técnicos;
- raio base entre `0.625rem` e `0.75rem`;
- ícones Lucide em `size-4` ou `size-5`;
- densidade confortável por padrão: `gap-6`, `p-6`, controles de 36–40 px;
- densidade compacta somente em tabelas e filtros avançados.

## Fundação do design system

### Tokens semânticos

Consolidar em `globals.css`:

- superfícies: `background`, `card`, `popover`, `sidebar`;
- texto: `foreground`, `muted-foreground`;
- interação: `primary`, `secondary`, `accent`, `ring`;
- bordas: `border`, `input`;
- estados: `success`, `warning`, `info`, `destructive`;
- estados editoriais: `draft`, `scheduled`, `published`, `private`;
- gráficos: `chart-1` até `chart-8`;
- elevação: `shadow-xs`, `shadow-sm`, `shadow-md`;
- largura de conteúdo e sidebar;
- escala de espaço e raio.

Regra: componentes de aplicação não devem usar hex ou cores estruturais como
`text-black`, `bg-white` e `gray-*`. Devem usar tokens como `text-foreground`,
`bg-card`, `text-muted-foreground` e `border-border`.

### Tipografia

Escala proposta:

- título de página: 28–32 px, semibold;
- título de seção: 20–24 px, semibold;
- título de card: 14–16 px, medium;
- corpo: 14 px;
- legenda e metadado: 12 px;
- métricas: 24–32 px, semibold;
- IDs, tokens, comandos e datas técnicas: Geist Mono.

Garantir line-height confortável e largura máxima para textos longos.

### Componentes de domínio

Criar padrões sobre os componentes shadcn existentes:

- `AppShell`;
- `DesktopSidebar`;
- `MobileNavigation`;
- `AppHeader`;
- `ThemeSwitcher`;
- `Breadcrumbs`;
- `PageHeader`;
- `PageToolbar`;
- `FilterBar`;
- `DataTable`;
- `EntityCard`;
- `MetricCard`;
- `StatusBadge`;
- `FormField`;
- `FormActions`;
- `EmptyState`;
- `ErrorState`;
- `LoadingState`;
- `ConfirmDeleteDialog`;
- `UnsavedChangesGuard`.

Esses componentes concentram estilo e comportamento, evitando repetir shells
Tailwind em cada página.

## Temas claro, escuro e automático

### Infraestrutura

- envolver a aplicação com `ThemeProvider` do `next-themes`;
- usar `attribute="class"`, `defaultTheme="system"` e `enableSystem`;
- adicionar `suppressHydrationWarning` no `<html>`;
- alterar `lang` para `pt-BR`;
- corrigir `components.json` para refletir suporte a dark mode;
- adicionar `color-scheme` coerente por tema;
- configurar o Toaster para acompanhar o tema;
- persistir preferência do usuário;
- evitar flash do tema incorreto durante hidratação.

### Seletor

Adicionar no header e configurações:

- Claro;
- Escuro;
- Sistema.

O controle deve ter texto acessível, tooltip e indicação da opção ativa.

### Paridade visual

Toda tela deve ser revisada nos dois temas:

- contraste mínimo WCAG AA;
- foco visível;
- bordas perceptíveis sem excesso;
- imagens, gráficos, tooltips e overlays legíveis;
- estados destructive/success/warning consistentes;
- sem texto preto fixo no tema escuro;
- sem fundos brancos fixos no tema escuro.

## Arquitetura da experiência

### Shell e navegação

Desktop:

- sidebar estável, recolhível e com largura consistente;
- estado ativo claramente visível;
- grupos por domínio: Conteúdo, Administração e Sistema;
- labels e tooltips quando recolhida;
- persistir estado recolhido;
- header com breadcrumbs, busca global, tema e perfil.

Mobile:

- sidebar substituída por `Sheet`;
- botão de menu com nome acessível;
- toolbar e ações prioritárias empilhadas;
- conteúdo sem dependência de altura fixa;
- áreas clicáveis de no mínimo 44 × 44 px.

Busca global futura:

- `CommandDialog` com atalho `Ctrl/Cmd + K`;
- pesquisar posts, mídias, usuários e ações;
- histórico recente e navegação por teclado.

### Hierarquia das páginas

Padrão:

1. breadcrumb;
2. título, descrição e ação primária;
3. métricas essenciais, quando úteis;
4. busca e filtros;
5. conteúdo principal;
6. paginação ou ações de continuidade.

Evitar cards desnecessários dentro de cards. Usar `Separator` para grupos simples.

### Listagens

- busca com debounce e URL como fonte de verdade;
- filtros explícitos e removíveis;
- contador de resultados;
- ordenação com label compreensível;
- modo tabela no desktop e cards no mobile quando necessário;
- cabeçalho fixo para tabelas longas;
- ações secundárias em `DropdownMenu`;
- ações destrutivas com `AlertDialog`;
- paginação preservada ao voltar de uma edição;
- skeleton com formato semelhante ao conteúdo final.

### Formulários

- label sempre associado ao campo;
- descrição e erro abaixo do controle;
- campos obrigatórios identificados sem depender apenas de cor;
- validação no blur e no submit;
- foco no primeiro erro;
- botão primário com estado pending;
- prevenir submissão duplicada;
- barra de ações estável em formulários longos;
- proteção contra saída com alterações não salvas;
- mensagens com ação de recuperação quando possível;
- separar configurações em tabs ou seções curtas.

### Feedback

- toast para confirmação breve;
- alert inline para erro que exige leitura ou correção;
- progresso visível para upload e operações demoradas;
- optimistic update apenas quando houver rollback seguro;
- mensagens específicas, evitando “Algo deu errado”;
- estados vazios com explicação e próxima ação;
- erro de permissão distinto de erro de rede.

## Melhorias por área

### Login

- layout focado, com branding mais discreto;
- suporte imediato ao tema do sistema;
- mostrar/ocultar senha;
- estados de erro e loading acessíveis;
- autofill e navegação por teclado;
- revisar contraste e remover fundo branco fixo.

### Dashboard inicial

- priorizar métricas acionáveis;
- remover gráficos redundantes;
- títulos e períodos claros;
- comparação com período anterior;
- tooltips formatados;
- gráficos usando tokens de tema;
- reorganização responsiva sem perda de contexto.

### Publicações

- filtros por status, visibilidade, autor e período;
- chips de status sem texto preto fixo;
- ações consistentes entre cards e tabela;
- destaque de agendados e rascunhos;
- preservar busca/página após editar;
- editor com barra de ações mais estável;
- painel de qualidade editorial progressivo, sem competir com o conteúdo.

### Biblioteca de mídia

- toolbar consistente com as demais listagens;
- filtros em `Sheet` no mobile;
- preview e ações com hierarquia clara;
- editor de imagem com comparação antes/depois;
- histórico de versões mais legível;
- progresso para transformação e upload;
- confirmação destrutiva usando `AlertDialog`.

### Usuários

- tabela responsiva;
- badges semânticos de papel/status;
- filtros por papel;
- detalhe/edição em sheet ou página dedicada;
- confirmação clara para mudanças de permissão.

### Integrações

- separar credenciais, instalação e clientes ativos;
- tokens e comandos em fonte monoespaçada;
- copiar com confirmação;
- destacar que tokens são exibidos apenas uma vez;
- status ativo/revogado/expirado com tokens semânticos;
- reduzir densidade do guia MCP usando tabs para Codex e Claude.

### Configurações

- tabs: Perfil, Segurança, Aparência;
- tema também disponível em Aparência;
- ações de salvar por seção;
- feedback inline;
- avatar com crop e preview consistentes com mídia.

## Acessibilidade

Meta: WCAG 2.2 nível AA.

- contraste de texto, ícones e foco;
- navegação completa por teclado;
- foco preso e restaurado em dialogs/sheets;
- landmarks `header`, `nav`, `main` e `aside`;
- heading hierarchy sem saltos;
- `aria-current="page"` na navegação;
- nomes acessíveis para botões somente com ícone;
- mensagens de erro associadas via `aria-describedby`;
- `aria-live` para feedback assíncrono relevante;
- não depender apenas de cor;
- respeitar `prefers-reduced-motion`;
- tamanho mínimo de alvo;
- zoom de 200% sem perda de operação;
- idioma `pt-BR`.

## Responsividade

Breakpoints comportamentais:

- mobile: navegação em sheet, cards e ações empilhadas;
- tablet: duas colunas quando houver espaço;
- desktop: sidebar e tabelas completas;
- telas amplas: limitar largura de leitura e evitar conteúdo excessivamente
  espalhado.

Testar larguras de 320, 375, 768, 1024, 1280 e 1440 px.

## Performance percebida

- Server Components para shell e primeira leitura;
- React Query somente para interação necessária;
- `next/image` com `sizes` corretos;
- lazy-load para editores e gráficos pesados;
- Suspense e skeletons por região;
- evitar waterfalls com `Promise.all`;
- preservar dados anteriores durante paginação;
- debounce de busca;
- transições apenas para mudanças não urgentes;
- medir LCP, INP e CLS nas rotas principais.

## Fases

### Fase 0 — auditoria e baseline

- [x] Inventariar telas, componentes e cores fixas.
- [ ] Capturar screenshots em desktop/mobile.
- [ ] Medir contraste e acessibilidade.
- [ ] Registrar Core Web Vitals e tamanho dos bundles.
- [ ] Definir métricas de sucesso e fluxo crítico.

### Fase 1 — temas e tokens

- [x] Implementar `ThemeProvider`.
- [x] Implementar claro, escuro e sistema.
- [x] Criar `ThemeSwitcher`.
- [x] Corrigir idioma e hidratação.
- [x] Consolidar tokens semânticos.
- [x] Migrar cores fixas estruturais.
- [x] Ajustar gráficos para os dois temas.

### Fase 2 — shell responsivo

- [x] Criar `AppShell`.
- [x] Refatorar header e sidebar.
- [x] Adicionar navegação mobile com `Sheet`.
- [x] Implementar estado ativo e breadcrumbs.
- [x] Persistir sidebar recolhida.
- [x] Remover cálculos rígidos de altura.

### Fase 3 — componentes e estados

- [x] Padronizar page header, toolbar e filtros.
- [x] Criar estados loading, vazio e erro.
- [x] Padronizar tabelas/cards responsivos.
- [x] Padronizar badges de status.
- [x] Padronizar dialogs e confirmações destrutivas.
- [x] Padronizar formulários e ações.

### Fase 4 — migração das telas

- [x] Login.
- [x] Dashboard inicial.
- [x] Publicações e editor.
- [x] Biblioteca de mídia.
- [x] Usuários.
- [x] Integrações.
- [x] Configurações.

Migrar uma rota por vez e manter comportamento existente.

### Fase 5 — acessibilidade e responsividade

- [ ] Auditoria automatizada com axe/Lighthouse.
- [ ] Fluxos completos apenas por teclado.
- [ ] Teste com leitor de tela.
- [x] Contraste estrutural nos dois temas por tokens semânticos.
- [x] `prefers-reduced-motion`.
- [x] Layouts responsivos implementados para os breakpoints definidos.

### Fase 6 — performance e estabilização

- [ ] Analisar bundle por rota.
- [ ] Carregar TinyMCE e gráficos sob demanda.
- [x] Revisar waterfalls e queries duplicadas no escopo alterado.
- [ ] Medir Core Web Vitals após mudanças.
- [ ] Teste visual de regressão.
- [ ] Rollout gradual e coleta de feedback.

## Ordem recomendada de rollout

1. tema e tokens;
2. shell, header e navegação;
3. componentes de estado e formulários;
4. login e configurações;
5. publicações;
6. mídia;
7. usuários e integrações;
8. dashboard e gráficos;
9. acessibilidade, performance e refinamento.

## Métricas de sucesso

- zero falhas WCAG A/AA críticas nas rotas principais;
- contraste AA em claro e escuro;
- ausência de flash perceptível de tema;
- mudança de tema persistida entre sessões;
- nenhuma ação crítica inacessível por teclado;
- redução de erros de formulário e submissões duplicadas;
- LCP abaixo de 2,5 s, INP abaixo de 200 ms e CLS abaixo de 0,1 no percentil 75;
- consistência de loading/vazio/erro em todas as listagens;
- nenhuma regressão nos fluxos de posts, mídia, usuários e integrações.

## Critérios de aceite

- temas claro, escuro e sistema funcionam em todas as rotas;
- o tema não pisca durante carregamento;
- sidebar funciona em desktop e vira navegação adequada no mobile;
- todos os componentes usam tokens semânticos para estrutura e texto;
- formulários apresentam validação e feedback consistentes;
- operações destrutivas usam confirmação acessível;
- páginas funcionam a partir de 320 px;
- navegação por teclado e foco são previsíveis;
- gráficos e imagens são legíveis nos dois temas;
- builds, lint dos arquivos alterados e testes de fluxo passam.

## Fora da primeira entrega

- aplicativo mobile nativo;
- personalização livre de cores por usuário;
- múltiplas marcas/white-label;
- editor completo de layout;
- animações decorativas complexas;
- substituição de toda a base shadcn por outra biblioteca.
