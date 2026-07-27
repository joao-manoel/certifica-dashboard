# Upload de imagens para S3 — Dashboard

Status: implementação local concluída; smoke test integrado pendente  
Dependência: endpoint `POST /blog/media/upload` do `certifica-backend`

## Objetivo

Evoluir o seletor de capa para oferecer três formas de escolher uma imagem:

1. **Galeria**: selecionar mídia já cadastrada;
2. **Usar URL**: manter o fluxo atual de URL externa;
3. **Upload**: escolher um arquivo local e hospedá-lo no S3 por meio da API.

Qualquer opção deve terminar com o mesmo resultado `{ id, url }`, permitindo que
os formulários de criação e edição continuem enviando apenas `coverId`.

## Estado atual

- `CoverPickerDialog` possui as abas “Galeria” e “Usar URL”.
- `createMediaFromUrlAction` baixa a URL no servidor do Next, calcula metadados e
  chama `POST /blog/media`.
- `listMedia` abastece a galeria com React Query.
- Ao confirmar, o diálogo chama `onChange(url, id)`.
- Os formulários de post guardam a seleção e enviam `coverId`.

Esse contrato interno deve ser preservado. O upload é uma terceira origem, não um
novo tipo de capa.

## Dependência da API

O dashboard não deve acessar AWS nem receber credenciais S3. Ele envia um
`multipart/form-data` autenticado para:

```text
POST /blog/media/upload
file=<imagem>
alt=<texto opcional>
```

A API retorna o mesmo objeto de criação por URL. Consulte o documento homônimo do
backend para contrato, segurança, armazenamento e roadmap completo.

## Arquitetura no dashboard

### Cliente HTTP

Criar `src/http/upload-media.ts`:

```ts
export interface UploadMediaResponse {
  id: string
  url: string
  alt: string | null
  mimeType: string | null
  width: number | null
  height: number | null
  dominantClr: string | null
  createdAt: string
  updatedAt: string
}

export async function uploadMedia(formData: FormData) {
  return api
    .post('blog/media/upload', { body: formData })
    .json<UploadMediaResponse>()
}
```

Não definir manualmente o header `Content-Type`: o runtime precisa incluir o
boundary do multipart. O `api-client` existente continua adicionando JWT e
`x-api-key`.

### Envio direto pelo cliente HTTP

Adicionar `src/http/upload-media.ts` para enviar o `FormData` diretamente à API.
Essa opção é preferível ao Server Action porque:

- evita duplicar até 25 MiB pelo servidor Next;
- não depende do limite de body das Server Actions;
- reutiliza o cliente HTTP que já injeta token e API key;
- mantém as credenciais AWS exclusivamente na API.

A API continua sendo a autoridade de segurança. Validação no dashboard melhora a
experiência, mas não substitui validação de conteúdo no backend.

### Seletor de capa

Alterar `CoverPickerDialog` para três abas:

- `gallery`;
- `url`;
- `upload`.

Estado adicional sugerido:

```ts
const [file, setFile] = React.useState<File | null>(null)
const [uploadAlt, setUploadAlt] = React.useState('')
const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
```

Ao selecionar arquivo:

1. validar tipo e tamanho;
2. criar preview local com `URL.createObjectURL(file)`;
3. revogar a URL anterior ao trocar/remover arquivo;
4. no Confirmar, enviar `file` e `alt`;
5. invalidar `['media']`;
6. chamar `onChange(created.url, created.id)`;
7. fechar e limpar o diálogo.

O preview local é apenas visual e nunca deve ser persistido como URL da capa.

## Experiência de uso

Na aba “Upload”:

- área clicável e compatível com drag-and-drop;
- input de arquivo acessível;
- texto com formatos e limite;
- preview em proporção 16:9 sem recortar o arquivo original no upload;
- campo de texto alternativo;
- nome e tamanho do arquivo;
- ação para trocar/remover;
- botão “Enviar e usar” ou o botão global “Confirmar”;
- estado de envio que bloqueia duplo clique;
- mensagem de erro próxima ao campo relevante.

O botão deve usar “Enviando…” durante a operação. Fechar o diálogo durante envio
deve ser bloqueado ou exigir cancelamento consciente.

Na primeira versão não é necessário progresso percentual real: o cliente `ky`
baseado em Fetch não oferece progresso de upload portátil. Um estado
indeterminado é suficiente para arquivos de até 25 MiB.

## Validações no cliente

Manter os limites sincronizados com a API:

- JPEG (`image/jpeg`);
- PNG (`image/png`);
- WebP (`image/webp`);
- máximo de 25 MiB;
- um arquivo por upload;
- alt opcional com no máximo 200 caracteres.

Não confiar somente no atributo `accept`; validar `file.type` e deixar a API
validar a assinatura real. Não aceitar SVG na primeira versão.

Exemplo de input:

```tsx
<input
  type="file"
  accept="image/jpeg,image/png,image/webp"
  onChange={handleFileChange}
/>
```

## Erros e mensagens

Mapear respostas para mensagens acionáveis:

| Situação | Mensagem sugerida |
| --- | --- |
| sem arquivo | “Selecione uma imagem.” |
| tipo inválido | “Use uma imagem JPEG, PNG ou WebP.” |
| acima do limite | “A imagem deve ter no máximo 25 MB.” |
| `401/403` | “Sua sessão não permite enviar imagens.” |
| `413` | “A imagem excede o limite permitido.” |
| `415` | “O formato da imagem não é suportado.” |
| falha S3/API | “Não foi possível hospedar a imagem. Tente novamente.” |

Não mostrar stack trace, resposta interna da AWS, chave S3, token ou API key.

## Compatibilidade com os fluxos existentes

- A aba URL continua chamando `createMediaFromUrlAction`.
- A galeria continua usando `listMedia`.
- Upload bem-sucedido invalida a mesma query e aparece na galeria.
- `create-post-form.tsx` e `edit-post-form.tsx` continuam recebendo `{ url, id }`.
- O post continua persistindo `coverId`; não deve persistir arquivo, blob URL ou
  URL digitada diretamente.
- Remover capa continua chamando `onChange(null, null)`.

Pode ser útil extrair o tipo `MediaItem`/`MediaResponse` para um módulo comum,
evitando definições diferentes em `create-media.ts`, `list-media.ts` e no novo
cliente.

## Acessibilidade e limpeza

- O dropzone precisa funcionar por teclado e ter label associada ao input.
- Erros devem usar `aria-describedby` e região anunciável.
- Preview deve usar o alt digitado ou uma descrição neutra.
- Revogar toda URL criada com `URL.createObjectURL` no cleanup do efeito.
- Ao reabrir o diálogo, sincronizar seleção atual sem reutilizar um arquivo antigo.
- Manter foco dentro do diálogo e devolver foco ao gatilho ao fechar.

## Testes e critérios de aceite

- Usuário seleciona JPEG, vê preview, envia e a imagem fica selecionada.
- A mídia enviada aparece na galeria sem recarregar a página.
- Criação e edição de post salvam o `coverId` do upload.
- Cadastro por URL continua funcionando.
- Seleção pela galeria continua funcionando.
- Arquivo inválido e grande demais são bloqueados com mensagem adequada.
- Erro da API mantém o diálogo aberto e permite tentar novamente.
- Trocar/remover arquivos não vaza object URLs.
- Layout e interação funcionam em desktop e mobile.
- Lint e build passam.

## Roadmap

### Fase 0 — alinhamento com backend

- [x] Confirmar contrato final do endpoint.
- [x] Compartilhar formatos, tamanho máximo e mensagens de erro.
- [ ] Garantir no ambiente que a URL retornada é estável e aceita pelo `next/image`.

### Fase 1 — camada HTTP

- [x] Extrair um tipo comum de `Media`.
- [x] Criar `src/http/upload-media.ts`.
- [x] Implementar upload direto em `src/http/upload-media.ts`.
- [x] Mapear erros HTTP sem expor detalhes internos.

### Fase 2 — interface

- [x] Adicionar a terceira aba “Upload”.
- [x] Implementar input/dropzone, preview e alt.
- [x] Implementar validação de tipo e tamanho.
- [x] Implementar estado de envio e mensagens.
- [x] Limpar arquivo e object URL ao fechar/trocar.

### Fase 3 — integração

- [x] Invalidar cache da galeria após upload.
- [x] Selecionar automaticamente a mídia criada.
- [ ] Validar criação de post.
- [ ] Validar edição de post.
- [ ] Confirmar que URL e galeria não sofreram regressão.

### Fase 4 — qualidade e entrega

- [ ] Adicionar testes de validação e do diálogo, se a suíte for introduzida.
- [ ] Executar `npm run lint`.
- [x] Executar `npm run build`.
- [ ] Fazer smoke test com API/bucket de desenvolvimento.
- [ ] Validar teclado, leitor de tela, desktop e mobile.

### Fase 5 — evoluções

- [ ] Paginação e busca mais completas na galeria.
- [ ] Crop e ajuste de foco da capa.
- [ ] Upload múltiplo para biblioteca de mídia.
- [ ] Progresso percentual via XHR ou upload direto pré-assinado.
- [ ] Cancelamento de upload.
- [ ] Exclusão segura e gerenciamento de mídias não utilizadas.

## Ordem recomendada de entrega

1. infraestrutura/CDN e contrato da API;
2. migration e endpoint do backend;
3. teste do endpoint isolado;
4. cliente multipart no dashboard;
5. terceira aba no diálogo;
6. testes ponta a ponta dos três caminhos;
7. deploy do backend antes do dashboard.

Essa ordem mantém o dashboard antigo compatível durante a publicação e permite
rollback independente: se a interface nova for revertida, o endpoint adicional
não interfere no cadastro por URL.
