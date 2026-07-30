# Roadmap — gerenciamento de mídia no dashboard

Status: implementação local concluída; rollout pendente

Este dashboard receberá uma biblioteca em `/media` para upload, cadastro por URL,
edição de metadados, recorte/rotação/substituição, consulta de usos e exclusão
protegida.

O contrato completo, decisões de segurança, fases da API, critérios de aceite e
rollback estão documentados em:

[`certifica-backend/docs/media-library-roadmap.md`](../../certifica-backend/docs/media-library-roadmap.md)

## Escopo resumido do dashboard

- item “Mídia” no menu para ADMIN e EDITOR;
- galeria responsiva e modo tabela;
- busca, filtros, ordenação e paginação;
- upload e cadastro por URL em fluxo compartilhado com o seletor de capa;
- detalhe com preview, dados técnicos e posts que utilizam a mídia;
- histórico de versões, com indicação da versão atual;
- edição de título, texto alternativo, legenda e crédito;
- recorte, proporções, rotação, espelhamento e substituição para mídia S3;
- exclusão bloqueada quando a imagem estiver em uso;
- confirmação explícita de que excluir todas as versões pode quebrar links
  compartilhados fora do Certifica;
- estados de carregamento, erro, vazio e sucesso;
- atualização consistente do React Query.

## Ordem local de implementação

- [x] Criar contratos HTTP e tipos da nova API.
- [x] Adicionar `/media` e item de navegação.
- [x] Construir galeria, busca, filtros e paginação.
- [x] Reutilizar os endpoints existentes de upload e URL.
- [x] Criar detalhe e edição de metadados.
- [x] Criar controles de recorte, rotação, espelhamento e substituição.
- [x] Exibir histórico de versões e preview das URLs anteriores.
- [x] Criar visualização de usos e exclusão protegida.
- [x] Preservar compatibilidade com o seletor de capa.
- [x] Validar lint dos arquivos alterados e build do Next.js.
