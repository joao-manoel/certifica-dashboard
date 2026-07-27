# Tokens de integração

A página `/integrations` permite que administradores e editores conectem o MCP
Certifica ao Claude ou Codex.

## Fluxo

1. Informar um nome para identificar o dispositivo ou cliente.
2. Escolher os scopes necessários.
3. Definir a expiração.
4. Criar e copiar o token exibido uma única vez.
5. Configurar o valor como `CERTIFICA_API_TOKEN` no MCP.

## Instalação do MCP

O guia interativo na própria página `/integrations` gera as configurações do
Codex e Claude Code com a URL da API e a chave pública corretas. O usuário
precisa apenas:

1. ter Node.js 20 ou mais recente;
2. criar e guardar um token de integração;
3. copiar a configuração do cliente desejado;
4. substituir `COLE_SEU_TOKEN_CERTIFICA`;
5. reiniciar o cliente e validar a conexão.

O servidor é executado localmente pelo pacote público
`certifica-mcp@0.1.0`, via `npx -y certifica-mcp`. Não é necessário clonar ou
baixar o código-fonte.

A API guarda somente o hash SHA-256. Não é possível recuperar o token original.
Se ele for perdido ou exposto, revogue-o e crie outro.

## Segurança

- apenas `ADMIN` e `EDITOR` podem acessar;
- cada usuário gerencia somente seus próprios tokens;
- um token MCP não pode criar ou revogar outros tokens;
- há limite de 10 tokens ativos por usuário;
- `posts:publish` é opcional e sensível;
- revogação bloqueia o acesso imediatamente;
- criação e revogação geram auditoria.

O dashboard nunca recebe credenciais AWS. Uploads continuam seguindo o fluxo
MCP → API → S3.
