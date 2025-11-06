// --- utils bem pragmáticos para PT-BR ---
export type Status = 'good' | 'ok' | 'bad'

export function htmlToText(html: string) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<pre[\s\S]*?<\/pre>/gi, '')
    .replace(/<code[\s\S]*?<\/code>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
  return cleaned.trim()
}

export function splitParagraphs(html: string): string[] {
  const blocks = html
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
  return blocks
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[\.\!\?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export function countWords(text: string) {
  return (text.match(/[A-Za-zÀ-ÿ0-9]+(?:-[A-Za-zÀ-ÿ0-9]+)*/g) || []).length
}

export const TRANSITIONS = [
  // ADIÇÃO
  'além disso',
  'ademais',
  'também',
  'do mesmo modo',
  'de igual modo',
  'igualmente',
  'bem como',
  'como também',
  'somado a isso',
  'ainda por cima',
  'outrossim',
  'não apenas',
  'não só',
  'bem como',
  'juntamente com',

  // CAUSA / MOTIVO
  'porque',
  'por causa de',
  'devido a',
  'graças a',
  'em virtude de',
  'visto que',
  'uma vez que',
  'já que',
  'considerando que',
  'dado que',
  'em razão de',

  // CONSEQUÊNCIA / CONCLUSÃO
  'portanto',
  'por conseguinte',
  'consequentemente',
  'assim',
  'dessa forma',
  'desse modo',
  'logo',
  'então',
  'por isso',
  'de modo que',
  'de forma que',
  'de maneira que',
  'em vista disso',
  'em conclusão',
  'em suma',
  'sendo assim',
  'isto posto',
  'em síntese',
  'finalmente',
  'por fim',
  'por derradeiro',
  'em resumo',
  'por conseguinte',
  'em conclusão',

  // CONTRASTE / OPOSIÇÃO
  'no entanto',
  'entretanto',
  'todavia',
  'contudo',
  'porém',
  'apesar disso',
  'mesmo assim',
  'ainda assim',
  'em contrapartida',
  'por outro lado',
  'ao contrário',
  'diferentemente de',
  'ao passo que',
  'embora',
  'apesar de',
  'não obstante',

  // EXPLICAÇÃO / ESCLARECIMENTO
  'ou seja',
  'isto é',
  'ou melhor',
  'em outras palavras',
  'em termos simples',
  'de fato',
  'na verdade',
  'vale dizer',
  'convém ressaltar que',
  'isto posto',

  // EXEMPLO / ILUSTRAÇÃO
  'por exemplo',
  'como exemplo',
  'tal como',
  'por ilustrar',
  'como',
  'isto é',
  'ou seja',
  'a saber',
  'entre outros',
  'entre outras coisas',

  // COMPARAÇÃO
  'como',
  'assim como',
  'tal como',
  'do mesmo modo que',
  'da mesma forma que',
  'da mesma maneira que',
  'bem como',
  'igual a',
  'semelhante a',

  // TEMPO / ORDEM
  'primeiramente',
  'em primeiro lugar',
  'antes de mais nada',
  'a princípio',
  'em seguida',
  'logo depois',
  'posteriormente',
  'depois',
  'por fim',
  'finalmente',
  'atualmente',
  'hoje em dia',
  'nesse ínterim',
  'nesse meio tempo',
  'enquanto isso',
  'logo em seguida',
  'ao mesmo tempo',
  'simultaneamente',
  'desde então',

  // CONDIÇÃO / HIPÓTESE
  'se',
  'caso',
  'desde que',
  'contanto que',
  'a menos que',
  'salvo se',
  'exceto se',
  'no caso de',
  'supondo que',
  'na hipótese de que',

  // CONCESSÃO
  'embora',
  'ainda que',
  'mesmo que',
  'por mais que',
  'apesar de que',
  'conquanto',
  'não obstante',

  // FINALIDADE / INTENÇÃO
  'para',
  'para que',
  'a fim de',
  'com o propósito de',
  'com o objetivo de',
  'com a finalidade de',
  'de modo a',
  'de forma a',

  // ÊNFASE / DESTACAR
  'de fato',
  'realmente',
  'sem dúvida',
  'certamente',
  'com efeito',
  'é importante ressaltar que',
  'convém destacar que',
  'vale destacar que',

  // REAFIRMAÇÃO / REFORÇO
  'ou melhor dizendo',
  'em outras palavras',
  'reiterando',
  'reforçando',
  'em suma',
  'resumindo',
  'em síntese',

  // TRANSIÇÃO NEUTRA / CONTINUAÇÃO
  'quanto a isso',
  'nesse sentido',
  'dessa maneira',
  'nessa perspectiva',
  'nesse contexto',
  'a respeito disso',
  'relativamente a',
  'em relação a',
  'no tocante a'
]

// Busca transições por sentença
export function transitionShare(sentences: string[]): number {
  let withTransition = 0
  const reList = TRANSITIONS.map(
    (t) => new RegExp(`(^|[,\\-–;:\\(\\)\\s])${t}(\\s|[,.;:!?])`, 'i')
  )
  for (const s of sentences) {
    if (reList.some((re) => re.test(s))) withTransition++
  }
  return sentences.length ? withTransition / sentences.length : 0
}

// Heurística de voz passiva
export function passiveShare(text: string): number {
  const sentences = splitSentences(text)
  const rePassive =
    /\b(foi|foram|era|eram|será|seriam|está|estavam|estava|foram|tem sido|tinha sido|seria|são|sendo)\s+[A-Za-zÀ-ÿ]+(ado|ada|ados|adas|ido|ida|idos|idas|to|ta|tos|tas)\b/i
  let hits = 0
  for (const s of sentences) {
    if (rePassive.test(s)) hits++
  }
  return sentences.length ? hits / sentences.length : 0
}

export function consecutiveStartIssues(sentences: string[]): number {
  let issues = 0
  let run = 1
  const firstWord = (s: string) =>
    (s.match(/^[A-Za-zÀ-ÿ0-9]+/) || [''])[0].toLowerCase()
  for (let i = 1; i < sentences.length; i++) {
    const prev = firstWord(sentences[i - 1])
    const curr = firstWord(sentences[i])
    if (!prev || !curr) continue
    if (prev === curr) {
      run++
      if (run >= 3) issues++
    } else {
      run = 1
    }
  }
  return issues
}

export function subheadingEvery(wordsTotal: number, html: string): number {
  const hCount = (html.match(/<(h2|h3)\b/gi) || []).length
  if (hCount === 0) return Infinity
  return wordsTotal / hCount
}

export function gradeToStatus(ok: boolean, warn: boolean): Status {
  if (ok) return 'good'
  if (warn) return 'ok'
  return 'bad'
}

// Thresholds unificados
export const DEFAULT_TARGETS = {
  minTransitions: 0.3,
  maxPassive: 0.1,
  subheadingEvery: 300,
  subheadingWarn: 400,
  maxParagraphWords: 150,
  maxSentenceWords: 30,
  minShortSentencesShare: 0.7,
  minShortSentencesWarn: 0.3
}

export type ReadabilityItem = {
  id: string
  label: string
  status: Status
  details?: string
}

export type ReadabilityTotals = {
  wordsTotal: number
  sentences: number
  paragraphs: number
}

/**
 * Cálculo único da legibilidade (score 0–100) + itens + totais.
 * “meta” e “resumo” são informativos e NÃO entram no score.
 * Se corpo, título e resumo estiverem vazios => score 0%.
 */
export function computeReadability(
  html: string,
  title: string,
  excerpt: string,
  targets = DEFAULT_TARGETS
): { score: number; items: ReadabilityItem[]; totals: ReadabilityTotals } {
  const text = htmlToText(html)
  const paragraphs = splitParagraphs(html)
  const sentences = splitSentences(text)

  const wordsTotal = countWords(text)
  const titleWords = countWords(title)
  const excerptWords = countWords(excerpt)

  const noBody = wordsTotal === 0
  const noAll = noBody && titleWords === 0 && excerptWords === 0

  // ➜ totalmente vazio: score 0 e todos os critérios como "bad"
  if (noAll) {
    const items: ReadabilityItem[] = [
      {
        id: 'transitions',
        label: 'Palavras de transição: 0.0%',
        status: 'bad'
      },
      { id: 'passive', label: 'Voz passiva: 0.0%', status: 'bad' },
      {
        id: 'subheadings',
        label: 'Distribuição de subtítulos: nenhum H2/H3 encontrado',
        status: 'bad'
      },
      {
        id: 'paragraphs',
        label: 'Tamanho dos parágrafos: conteúdo insuficiente',
        status: 'bad'
      },
      {
        id: 'sentences',
        label: 'Tamanho das frases: 0% ≤ 30 palavras',
        status: 'bad'
      },
      {
        id: 'consecutive',
        label: 'Frases consecutivas: conteúdo insuficiente',
        status: 'bad'
      },
      // informativos (não contam no score)
      {
        id: 'meta',
        label: 'Título: 0 palavras',
        status: 'ok'
      },
      { id: 'excerpt', label: 'Resumo: 0 palavras', status: 'bad' }
    ]
    return {
      score: 0,
      items,
      totals: { wordsTotal: 0, sentences: 0, paragraphs: 0 }
    }
  }

  const transShare = transitionShare(sentences)
  const passShare = passiveShare(text)

  const longSentences = sentences.filter(
    (s) => countWords(s) > targets.maxSentenceWords
  ).length
  const pctShortEnough = sentences.length
    ? 1 - longSentences / sentences.length
    : 0

  const longParagraphs = paragraphs.filter(
    (p) => countWords(p) > targets.maxParagraphWords
  ).length

  const ratioWordsPerSub = subheadingEvery(wordsTotal, html)
  const consecutiveIssues = consecutiveStartIssues(sentences)

  const items: ReadabilityItem[] = [
    {
      id: 'transitions',
      label: `Palavras de transição: ${(transShare * 100).toFixed(1)}%`,
      status: noBody
        ? 'bad'
        : gradeToStatus(
            transShare >= targets.minTransitions,
            transShare >= Math.min(targets.minTransitions - 0.1, 0.25)
          ),
      details:
        'Meta ≥ 30%. Exemplos: "além disso", "portanto", "no entanto", "assim", "ou seja"...'
    },
    {
      id: 'passive',
      label: `Voz passiva: ${(passShare * 100).toFixed(1)}%`,
      status: noBody
        ? 'bad'
        : gradeToStatus(
            passShare <= targets.maxPassive,
            passShare <= targets.maxPassive + 0.05
          ),
      details: 'Meta ≤ 10%. Prefira voz ativa quando possível.'
    },
    {
      id: 'subheadings',
      label:
        ratioWordsPerSub === Infinity
          ? 'Distribuição de subtítulos: nenhum H2/H3 encontrado'
          : `Distribuição de subtítulos: ~${Math.round(
              ratioWordsPerSub
            )} palavras por H2/H3`,
      status:
        ratioWordsPerSub === Infinity
          ? noBody
            ? 'bad'
            : 'ok'
          : gradeToStatus(
              ratioWordsPerSub <= targets.subheadingEvery,
              ratioWordsPerSub <= targets.subheadingWarn
            ),
      details: `Use ao menos um subtítulo a cada ~${targets.subheadingEvery} palavras.`
    },
    {
      id: 'paragraphs',
      label:
        paragraphs.length === 0
          ? 'Tamanho dos parágrafos: conteúdo insuficiente'
          : longParagraphs === 0
          ? 'Tamanho dos parágrafos: ok'
          : `Parágrafos muito longos: ${longParagraphs}`,
      status:
        paragraphs.length === 0
          ? 'bad'
          : gradeToStatus(longParagraphs === 0, longParagraphs <= 1),
      details: `Meta: até ${targets.maxParagraphWords} palavras por parágrafo.`
    },
    {
      id: 'sentences',
      label: `Tamanho das frases: ${(pctShortEnough * 100).toFixed(0)}% ≤ ${
        targets.maxSentenceWords
      } palavras`,
      status:
        sentences.length === 0
          ? 'bad'
          : gradeToStatus(
              pctShortEnough >= targets.minShortSentencesShare,
              pctShortEnough >= targets.minShortSentencesWarn
            ),
      details: `Meta: pelo menos ${Math.round(
        targets.minShortSentencesShare * 100
      )}% das frases com ≤ ${targets.maxSentenceWords} palavras.`
    },
    {
      id: 'consecutive',
      label:
        sentences.length < 3
          ? 'Frases consecutivas: conteúdo insuficiente'
          : consecutiveIssues === 0
          ? 'Frases consecutivas: ok'
          : `Inícios repetidos: ${consecutiveIssues}`,
      // ➜ sem sentenças suficientes: BAD (não neutro)
      status:
        sentences.length < 3
          ? 'bad'
          : gradeToStatus(consecutiveIssues === 0, consecutiveIssues <= 1),
      details: 'Evite 3+ frases seguidas começando com a mesma palavra.'
    },
    // Informativos (não contam no score)
    {
      id: 'meta',
      label: `Título: ${titleWords} palavras `,
      status: titleWords === 0 ? 'ok' : 'good'
    },
    {
      id: 'excerpt',
      label: `Resumo: ${excerptWords} palavras`,
      status:
        excerptWords === 0
          ? 'bad'
          : gradeToStatus(excerptWords >= 8 && excerptWords <= 60, true),
      details:
        'Ideal entre ~8 e 60 palavras (seu campo tem limite de caracteres).'
    }
  ]

  // ➜ score só com critérios “avaliativos”
  const scored = new Set([
    'transitions',
    'passive',
    'subheadings',
    'paragraphs',
    'sentences',
    'consecutive'
  ])

  const score0to1 =
    items
      .filter((it) => scored.has(it.id))
      .reduce(
        (acc, it) =>
          acc + (it.status === 'good' ? 2 : it.status === 'ok' ? 1 : 0),
        0
      ) /
    (scored.size * 2)

  return {
    score: Math.round(score0to1 * 100),
    items,
    totals: {
      wordsTotal,
      sentences: sentences.length,
      paragraphs: paragraphs.length
    }
  }
}
