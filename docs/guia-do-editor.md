# Guia do editor

Para quem vai escrever uma edição e **nunca abriu um terminal**.

Você vai mexer em **um arquivo só**: `edicao.js`. Nada mais. Se este guia mandar você
abrir outro arquivo, é só para olhar, nunca para editar.

Antes de começar, tenha o jornal aberto no navegador (duplo clique no `index.html`). Você
vai trabalhar com duas janelas: o Bloco de Notas com o `edicao.js` de um lado, o navegador
do outro. Editou, salvou, apertou **F5** no navegador, viu o resultado. É esse o ciclo.

---

## Parte 1 — Começando do zero

1. Abra a pasta `exemplos/` e copie o arquivo **`edicao-em-branco.js`** para a pasta
   principal (onde está o `index.html`).
2. Renomeie o **`edicao.js` que já existe** para `edicao-01.js`. Ele é a edição que veio
   pronta, e você não quer perdê-la.
3. Renomeie a sua cópia para **`edicao.js`**.
4. Dê **F5** no navegador. Você deve ver um jornal de mentirinha, com textos genéricos.
   **Isso é o certo:** significa que o molde está funcionando e agora é só trocar as
   palavras.

Se aparecer uma tarja de erro nesse momento, o problema é da cópia, não do seu texto —
volte ao passo 1.

### As cinco regras que evitam 90% dos problemas

1. **Mexa só no que está entre aspas duplas.** `titulo: "Troque isto aqui"` — você troca o
   que está dentro das aspas, nunca a palavra `titulo` e nunca as aspas.
2. **Dentro do texto, nada de aspas retas** (`"`). Se precisar de aspas no meio de uma
   frase, use as curvas: `“ ”`. Elas estão no Word, no Google Docs, e você pode copiar
   daqui mesmo.
3. **Não apague vírgula de fim de linha, chave `{ }` nem colchete `[ ]`.** São o
   esqueleto. Uma vírgula a menos derruba o arquivo inteiro.
4. **Destaque com `**negrito**` e `*itálico*`.** Nada de HTML, nada de `<b>`.
5. **Salve como `.js`.** No Bloco de Notas, em "Salvar como", escolha
   **Tipo: Todos os arquivos** e mantenha o nome `edicao.js`. Se sair `edicao.js.txt`, a
   página não acha o arquivo.

---

## Parte 2 — O que cada campo faz

O arquivo é uma lista de dez blocos, nesta ordem. Nenhum é opcional, exceto onde está
escrito.

### 1. `jornal` — o cabeçalho

```js
jornal: {
  nome: "Nome do Seu Jornal",
  lema: "Uma frase curta que diz a que o jornal veio.",
  numero: "01",
  data: "1º de março de 2027"
}
```

| Campo | O que é |
|---|---|
| `nome` | O nome grande no alto da página. Curto funciona melhor. |
| `lema` | A frase pequena embaixo do nome. |
| `numero` | O número da edição, como texto: `"01"`, `"02"`. |
| `data` | **Texto de exibição**, escrito como você quer que apareça. Não é data de computador. |
| `local` | **Opcional.** `"Natal, RN"`. Apague a linha se não quiser. |

### 2. `aviso_modelo` — a nota de rodapé honesta

Uma frase só, que aparece na tela e no papel, dizendo que isto é um modelo de página e não
um veículo oficial de instituição nenhuma. **Não apague.** É o que impede alguém de
confundir o seu trabalho com um jornal institucional.

### 3. `manchete` — a matéria principal

```js
manchete: {
  id: "manchete",
  chapeu: "Assunto da editoria",
  titulo: "O título principal da edição",
  linha_fina: "Uma frase que completa o título.",
  autoria: "Redação Nome do Seu Jornal",
  corpo: [ "primeiro parágrafo", "segundo parágrafo" ],
  fontes: [ { id: "fonte-principal", paginas: "p. 10–12" } ]
}
```

| Campo | O que é |
|---|---|
| `id` | Um apelido interno, sem espaço e sem acento. Serve para as caixas se apoiarem nela. Deixe `"manchete"`. |
| `chapeu` | A palavrinha acima do título, em letra pequena. A editoria. |
| `titulo` | O título grande. |
| `linha_fina` | Uma frase abaixo do título. **Obrigatória.** |
| `autoria` | Assinatura genérica, tipo `"Redação"`. **O seu nome vai só no expediente.** |
| `corpo` | A lista de parágrafos, entre colchetes, cada parágrafo entre aspas e separado por vírgula. |
| `fontes` | De onde veio o que você afirmou. Veja o bloco 7. |

**Truque útil:** se um parágrafo começar com um rótulo em negrito seguido de ponto —
`"**Assim.** o resto da frase"` — ele ganha um destaque visual próprio, como numa lista de
definições.

### 4. `materias` — quantas você quiser

Uma lista. Cada matéria é igual à manchete, menos o `chapeu` e a `autoria`, e mais o campo
`secao` (o nome da editoria daquela matéria: `"Conceitos"`, `"Métodos"`).

Toda matéria precisa de `id`, `secao`, `titulo`, `linha_fina`, `corpo` e `fontes`.

Os `id` precisam ser **diferentes entre si**: `"materia-um"`, `"materia-dois"`.

### 5. `caixas` — os quatro tipos

Caixa é o que dá vida à página. Toda caixa tem quatro campos em comum:

| Campo | O que é |
|---|---|
| `id` | Apelido interno, único. |
| `tipo` | Um dos quatro: `"revelar"`, `"classificar"`, `"comparar"`, `"destaque"`. |
| `ancora` | **O `id` da manchete ou de uma matéria.** É onde a caixa se apoia; o motor decide o lugar exato na página. |
| `titulo` | O título da caixa. |
| `fontes` | Igual ao das matérias. |

Depois disso, cada tipo pede campos próprios:

**`destaque`** — o mais simples. Uma caixa lateral sem interação, para a ressalva que não
cabe no fio da matéria. Além dos comuns, pede só:
- `corpo`: a lista de parágrafos.

**`revelar`** — o leitor aperta um botão e aparece a resposta. No papel já sai revelada.
- `variaveis`: exatamente **duas** coisas que se vê;
- `variavel_escondida`: a terceira, que explica as duas;
- `botao`: o texto do botão;
- `antes`: `{ titulo, texto }` — o que se vê, terminando na pergunta;
- `revelacao`: `{ titulo, texto }` — a resposta;
- `explicacao`: o porquê, com o nome do conceito.

**`classificar`** — um quiz. No papel, as respostas já saem visíveis.
- `instrucao`: uma frase dizendo o que fazer;
- `tipos`: **exatamente 4**, cada um `{ id, nome }`;
- `perguntas`: **de 5 a 6**, cada uma `{ texto, tipo, explicacao }` — e `tipo` tem que ser
  um dos `id` da lista de `tipos`;
- `fecho`: uma frase final.

**`comparar`** — três opções lado a lado. No papel saem as três.
- `introducao`: uma frase;
- `caminhos`: **exatamente 3**, cada um `{ id, nome, exemplo, ganha, perde }`.

### 6. `editorial` — a opinião da redação

`{ id, titulo, corpo, fontes }`. É o único lugar da página onde a redação fala em nome
próprio.

### 7, 8 e 9. As três listas de fontes

Toda afirmação que veio de algum lugar precisa apontar para uma fonte cadastrada. São três
listas, e o `id` que você usa em `fontes:` pode estar em qualquer uma delas:

| Lista | Para quê | Campos |
|---|---|---|
| `fontes_da_disciplina` | Os livros e capítulos que são a base do que você escreveu | `{ id, referencia_abnt }` |
| `fontes_complementares` | Fontes que aparecem só numa caixa. **Pode ficar vazia:** `[ ]` | `{ id, referencia_abnt }` |
| `para_ir_alem` | As leituras que o leitor pode procurar depois. Viram uma seção própria na página | `{ id, doi, referencia_abnt, o_que_diz, cuidado }` |

Em `para_ir_alem`, dois campos merecem atenção:
- **`o_que_diz`** — em até 40 palavras, o que o estudo mostrou. Escreva **a partir do
  resumo oficial do artigo, e nada além dele.**
- **`cuidado`** — em até 25 palavras, o que aquele estudo **não** autoriza concluir. Este
  campo não é enfeite: é o que separa divulgação honesta de exagero.

E o **`doi`** entra só como código (`10.1126/science.aac4716`), sem endereço. A página não
tem link de saída.

**Campo opcional muito útil:** qualquer fonte aceita `nome_curto`. É o nome que aparece na
linha "Fontes:" no fim de cada matéria. Sem ele o motor tenta adivinhar a partir da
referência ABNT, e **erra em capítulo de livro** (confunde autor com organizador).
Escreva o `nome_curto` e acabou o problema.

### 10. `expediente` — quem assina

`{ autoria, disciplina, instituicao, docente, origem, licenca }`.

**É o único lugar do arquivo com o seu nome.** Se você não está fazendo trabalho de
disciplina, use `disciplina` e `docente` para o que fizer sentido, ou escreva um traço.

---

## Parte 3 — Os três erros mais comuns

Quando algo está errado, a página **não fica em branco**. Aparece, no topo, uma tarja com
este cabeçalho:

> **Erro na edição**
> ## Esta edição não pôde ser montada
> O arquivo `edicao.js` tem problemas. Corrija o que está listado abaixo, salve o arquivo e
> recarregue a página.

E abaixo, a lista do que está errado. **Ela lista todos os problemas de uma vez** — você
não precisa corrigir um, recarregar, descobrir o próximo.

### Erro 1 — Vírgula ou aspa fora do lugar (erro de sintaxe)

É de longe o mais comum. Uma vírgula que faltou no fim de uma linha, uma aspa reta no meio
do texto, uma chave sem par.

**No Chrome e no Edge**, abertos por duplo clique, a mensagem é esta:

```
• edicao.js
  Há um erro de sintaxe em edicao.js: confira vírgulas e aspas.
  Neste navegador, a linha do erro não é informada quando a página é aberta por
  duplo clique.
  Dica: quase sempre é uma vírgula a mais, uma vírgula a menos, uma chave { } ou um
  colchete [ ] sem par, ou uma aspa dupla " dentro do texto. Dentro do texto, use
  aspas curvas “ ”. Para ver a linha: abra a página no Firefox, ou aperte F12 e olhe
  a aba Console.
```

**Por que não diz a linha.** Não é defeito do molde. Quando a página é aberta por duplo
clique (endereço `file://`), o Chrome e o Edge **se recusam a informar o arquivo e a linha
do erro** — é uma política de segurança deles, que trata cada arquivo local como origem
desconhecida. A mensagem prefere dizer a verdade a chutar.

**Os dois caminhos que funcionam para descobrir a linha:**

**Caminho A — abrir no Firefox.** O Firefox informa a linha sempre. Clique com o botão
direito no `index.html` → **Abrir com** → **Firefox**. A mensagem passa a ser:

```
• edicao.js, perto da linha 84
  Há um erro de sintaxe perto da linha 84 de edicao.js: confira vírgulas e aspas.
  O navegador disse: SyntaxError: missing } after property list
```

**Caminho B — o console, sem trocar de navegador.** No Chrome ou no Edge, com a página
aberta, aperte **F12**. Abre um painel. Clique na aba **Console**. A linha de erro em
vermelho mostra o arquivo e o número da linha entre parênteses, assim:

```
Uncaught SyntaxError: ...    edicao.js:84
```

Esse `84` é o número da linha. No Bloco de Notas, use **Ctrl + G** para ir até ela.
Olhe **essa linha e a de cima** — a vírgula que faltou costuma estar na linha anterior.

### Erro 2 — Faltou um campo

Você apagou uma linha sem querer, ou copiou um bloco pela metade.

```
• materias[2].titulo
  Falta o campo “titulo”.
  Dica: escreva o texto entre aspas duplas.
```

**Como ler isso.** `materias[2]` quer dizer: na lista de matérias, a **terceira** — a
contagem começa em zero, então `[0]` é a primeira, `[1]` a segunda, `[2]` a terceira. E o
que falta ali é o campo `titulo`.

Cada tipo de campo tem a sua dica. Se o que faltou for uma lista de parágrafos, a dica
muda para `Dica: é uma lista de parágrafos, entre colchetes [ ], cada um entre aspas.`

### Erro 3 — O campo é do tipo errado

Você escreveu um texto onde a página esperava uma lista, ou o contrário. Acontece muito
com `corpo`, que é sempre uma lista de parágrafos, mesmo quando só tem um.

```
• materias[0].corpo
  O campo “corpo” precisa ser uma lista entre colchetes [ ], e veio como um texto.
  Dica: use [ "primeiro parágrafo", "segundo parágrafo" ].
```

Ou seja: **errado** `corpo: "meu parágrafo"` — **certo** `corpo: [ "meu parágrafo" ]`.

### Outras mensagens que você pode ver

A tarja fala a mesma língua em todos os casos. Alguns exemplos:

| Situação | O que aparece |
|---|---|
| Usou um `id` de fonte que não cadastrou | `Dica: cadastre esse id em fontes_da_disciplina, fontes_complementares ou para_ir_alem` |
| A `ancora` de uma caixa aponta para um `id` que não existe | `Dica: use um destes ids: manchete, materia-um, materia-dois` — e ele lista os que existem |
| Escreveu um `tipo` de caixa que não existe | `Dica: use um destes: classificar, revelar, comparar, destaque` |
| O quiz ficou com 3 ou 7 perguntas | a mensagem diz que são de 5 a 6 |
| A caixa `comparar` ficou com 2 caminhos | a mensagem diz que são exatamente 3 |

---

## Parte 4 — Quando a página some ou fica estranha

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Página **em branco**, sem nem a tarja de erro | O arquivo foi salvo como `edicao.js.txt`, ou está fora da pasta | Confira o nome exato do arquivo, ao lado do `index.html` |
| A tarja aparece mas você **jura que não mexeu naquilo** | Vírgula da linha anterior | Olhe sempre a linha de cima da que o erro aponta |
| O texto aparece com `**estrelas**` visíveis | Negrito escrito errado | São duas estrelas de cada lado, coladas na palavra: `**assim**` |
| Um acento virou `Ã§` ou símbolo estranho | O arquivo foi salvo em outra codificação | No Bloco de Notas, "Salvar como" → em **Codificação**, escolha **UTF-8** |
| Mudou o texto e **nada mudou na tela** | O navegador está mostrando a versão antiga | **Ctrl + F5** (recarrega ignorando o cache) |

---

## Parte 5 — Antes de publicar, confira

- [ ] Abri a página e **não** tem tarja de erro no topo.
- [ ] Apertei **Ctrl + P** e olhei a prévia de impressão: as três interações aparecem já
      resolvidas, e não ficou nenhuma página quase vazia no fim.
- [ ] Toda afirmação que veio de uma fonte tem a fonte listada.
- [ ] O campo `cuidado` de cada item de `para_ir_alem` diz de verdade o que o estudo
      **não** autoriza concluir.
- [ ] O `expediente` tem o meu nome e diz de onde o trabalho vem.
- [ ] O `aviso_modelo` continua lá.
- [ ] Naveguei a página inteira **só com o Tab e as setas**, e consegui usar as três
      interações.

Para publicar, volte ao [README](../README.md), seção 4.
