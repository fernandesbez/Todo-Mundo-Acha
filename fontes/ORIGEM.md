# Origem das fontes

Todas as fontes do jornal são **SIL Open Font License 1.1**, autohospedadas (nenhuma requisição a terceiros).
O texto completo da licença de cada família está ao lado: `OFL-Old-Standard-TT.txt`,
`OFL-Libre-Caslon-Text.txt`, `OFL-Archivo-Narrow.txt` (copiados de `google/fonts`, `ofl/<família>/OFL.txt`,
em 2026-09-20).

## De onde vieram os arquivos

Os `.woff2` vêm do pacote npm **`@fontsource/<família>@5.3.0`** (licença do pacote: OFL-1.1), baixado com
`npm pack` em 2026-09-20 e **copiado sem alteração** de `package/files/<família>-latin-<peso>-<estilo>.woff2`.
O Fontsource já distribui cada família recortada no **subconjunto `latin`** (U+0000–00FF e pontuação
tipográfica comum). **Eu não converti nem recortei nada**: não houve TTF → woff2 nesta tarefa.
O `npm` e o CDN do Fontsource foram usados **só durante o trabalho**, nunca como dependência de execução.

| Família | Papel | Versão (tabela `name` do arquivo) | Arquivos |
|---|---|---|---|
| Old Standard TT | nome do jornal, manchete, títulos | Version 3.000 | 400, 400 itálico, 700 |
| Libre Caslon Text | texto corrido | Version 1.100 | 400, 400 itálico, 700 |
| Archivo Narrow | rótulos, datas, legendas, texto de caixas no impresso | Version 3.002 | 400, 600, 700 |

## Arquivos, tamanhos e impressão digital

| Arquivo | Bytes | SHA-256 (16 primeiros) |
|---|---|---|
| `archivo-narrow-latin-400-normal.woff2` | 11796 | `50e835187413b9d2…` |
| `archivo-narrow-latin-600-normal.woff2` | 12096 | `9bfc794b14b5e62a…` |
| `archivo-narrow-latin-700-normal.woff2` | 11776 | `062eae97e718b8a3…` |
| `libre-caslon-text-latin-400-italic.woff2` | 28020 | `20eac03c053229ce…` |
| `libre-caslon-text-latin-400-normal.woff2` | 24972 | `29310efc1007f608…` |
| `libre-caslon-text-latin-700-normal.woff2` | 25260 | `2819c345e64c715c…` |
| `old-standard-tt-latin-400-italic.woff2` | 25560 | `189ea179284724af…` |
| `old-standard-tt-latin-400-normal.woff2` | 23676 | `52d24e5960257c67…` |
| `old-standard-tt-latin-700-normal.woff2` | 24016 | `c2f2e80290b457a7…` |

**Total dos woff2: 187172 bytes (~183 KB).** As OFL somam ~13 KB.

## Cobertura de caracteres (conferida com fontTools 2026-09-20)

Presentes nas nove fontes: ã õ ç á é í ó ú â ê ô à ü, as maiúsculas correspondentes, aspas “ ” ‘ ’, travessões — e –,
º ª, reticências, «», ·, •, ×, ÷, ° e %. **Ausentes:** setas (→ ← e, em Caslon, também ↑ ↓). Por isso o CSS
não usa setas em texto (sinais como +, − e ✓/× são desenhados em CSS). O Libre Caslon Text **não tem negrito
itálico**; o navegador o sintetizaria, então evite `<b><em>` juntos.

## Reserved Font Name (RFN)

Cabeçalho (`Copyright …`) de cada `OFL-*.txt`, lido em 2026-09-20:

- **Old Standard TT:** “Copyright 2011 The Old Standard Project Authors (amkryukov@gmail.com)”. **Sem** “with Reserved Font Name”.
- **Libre Caslon Text:** “Copyright 2018 The Libre Caslon Text Project Authors (https://github.com/thundernixon/Libre-Caslon)”. **Sem** RFN.
  (O arquivo de fonte traz “Copyright 2012 … Libre Caslon Text Project Authors (impallari/Libre-Caslon-Text)”: outra data e outro
  repositório, mas também sem RFN.)
- **Archivo Narrow:** “Copyright 2019 The Archivo Narrow Project Authors (https://github.com/Omnibus-Type/ArchivoNarrow)”. **Sem** RFN.

A expressão “Reserved Font Name” aparece nos três arquivos **apenas** na definição genérica da licença (linha 33), não
como reserva declarada. Conferi também os campos 0, 13 e 14 da tabela `name` dos 12 `.woff2` baixados (latin e latin-ext):
nenhum contém “Reserved”. Conclusão: **nenhuma das três famílias declara nome reservado**, então usar o subconjunto
`latin` do Fontsource sob o nome original não exige renomear.

**Não confirmado:** não abri os repositórios upstream (`FONTLOG`, `OFL.txt` próprios) nem o pacote Fontsource para ver se
declaram algo diferente do que a cópia do `google/fonts` diz. Se o autor quiser certeza absoluta, é a única verificação que falta.
