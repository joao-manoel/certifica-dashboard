# Certifica Dashboard — orientações para agentes

## Visão do projeto

Painel administrativo do Certifica em Next.js 16 (App Router), React 19 e
TypeScript estrito. Gerencia autenticação, perfil, posts, mídia e métricas do blog.
Usa React Query, Server Actions, React Hook Form/Zod, TinyMCE, Recharts e
componentes Radix/shadcn.

## Mapa do código

- `src/app/(auth)`: fluxo de login.
- `src/app/(app)`: área autenticada, posts, usuários e configurações.
- `src/actions`: fronteira de mutações acionadas por formulários.
- `src/http`: clientes tipados para o backend.
- `src/auth/auth.ts` e `src/proxy.ts`: sessão e proteção de rotas.
- `src/components`: componentes de domínio; `components/ui` contém primitivas.
- `src/lib/env.ts`: validação central das variáveis de ambiente.
- `src/@types/types-posts.ts`: contratos de posts e respostas.

## Convenções de implementação

- Prefira Server Components. Use `"use client"` somente em formulários,
  interações, hooks ou bibliotecas que dependam do navegador.
- Mantenha mutações em `src/actions` e acesso à API em `src/http`; componentes não
  devem reconstruir autenticação ou URLs.
- Preserve o cookie `token`, o header `Authorization` e `x-api-key` conforme
  centralizados no cliente HTTP.
- Use `env` de `src/lib/env.ts`, não acesse `process.env` diretamente em código de
  aplicação. Atualize schema e `runtimeEnv` juntos ao adicionar uma variável.
- Formulários devem usar validação Zod, exibir erros úteis e impedir submissões
  duplicadas.
- Após mutações, invalide/revalide somente os dados afetados e mantenha estados de
  loading, vazio, erro e sucesso.
- Reutilize `src/components/ui`; preserve acessibilidade, foco, teclado e
  responsividade.
- Conteúdo rico e uploads exigem cuidado com sanitização, tipo, tamanho, preview e
  falhas parciais.
- Use o alias `@/*`; imports e exports devem passar pelo
  `simple-import-sort`.
- O estilo configurado é sem ponto e vírgula. Evite reformatação fora do escopo.

## Ambiente e integrações

- Variáveis esperadas: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_URL`,
  `NEXT_PUBLIC_BLOG_URL` e `NEXT_PUBLIC_API_KEY`.
- Nunca versione valores de `.env`. Tudo que começa com `NEXT_PUBLIC_` é público;
  não armazene segredos de servidor nessas variáveis.
- Alterações de contrato precisam ser coordenadas com `certifica-backend`; links
  de publicação também devem continuar válidos no `certifica-blog`.

## Comandos e validação

- Desenvolvimento: `npm run dev`
- Lint: `npm run lint`
- Build e typecheck do Next: `npm run build`
- Produção local após build: `npm run start`

Não há suíte de testes configurada. Rode lint e build antes de concluir. Em
mudanças de fluxo, valide login/logout, proteção da área privada e a mutação
afetada. Em mudanças de editor ou dashboard, confira desktop e mobile e os estados
de carregamento/erro.
