# Todo Mundo Acha

**Todo mundo tem opinião. A pesquisa tem método.**

Uma página de jornal que se lê no navegador, com três partes que respondem ao leitor,
e que também imprime como um jornal de papel de verdade.

A edição 01 é sobre **como ler uma manchete de pesquisa sem ser enganado**: a diferença
entre duas coisas andarem juntas e uma causar a outra.

**Ver a edição 01:** https://fernandesbez.github.io/Todo-Mundo-Acha/

Isto aqui é **duas coisas ao mesmo tempo**:

1. **um jornal** — a edição 01, pronta para ler;
2. **um molde** — você troca o texto por outro e tem a sua própria edição, sobre o
   assunto que quiser. É de graça, é livre, e não precisa instalar nada.

---

## O que você precisa (e o que não precisa)

**Precisa:** um computador com navegador (Chrome, Edge ou Firefox) e um editor de texto
simples — o **Bloco de Notas** do Windows já serve. Nada além disso.

**Não precisa:** internet para ler (depois de baixado, funciona desligado da tomada da
rede), conta em lugar nenhum, programa instalado, terminal, `npm`, servidor. Nenhum
arquivo desta página vem de fora da própria pasta.

---

## 1. Como abrir a página no seu computador

É duplo clique. Sério.

1. Baixe a pasta do projeto: abra https://github.com/fernandesbez/Todo-Mundo-Acha ,
   clique no botão verde **Code** e depois em **Download ZIP**.
2. Ache o arquivo `.zip` na sua pasta de Downloads, **clique com o botão direito** nele e
   escolha **Extrair tudo** (no Windows) ou dê duplo clique (no Mac). Isso cria uma pasta
   comum, com os arquivos dentro.
   **Não pule esta parte:** dentro do `.zip`, sem extrair, a página abre errada ou nem abre.
3. Entre na pasta que apareceu. Você vai ver um arquivo chamado **`index.html`**.
4. **Dê dois cliques em `index.html`.** O jornal abre no seu navegador.

Deu certo? Você está vendo o nome do jornal grande no topo, uma manchete, colunas de
texto e algumas caixas cinzas com botões. Se estiver vendo isso, está tudo funcionando —
inclusive sem internet.

**Se abrir errado.** Se der dois cliques e abrir um editor de código em vez do navegador,
clique com o botão direito em `index.html` → **Abrir com** → escolha o navegador.

---

## 2. As três interações

A página não é só texto. Três partes respondem a quem lê:

| Onde | O que faz |
|---|---|
| **Que tipo de pergunta é essa?** | Um quiz de cinco perguntas. Você marca uma opção, aperta **Responder** e a página diz se acertou e por quê. |
| **O sorvete e os afogamentos** | Um botão revela a variável que estava escondida e explicava tudo. |
| **Três caminhos para investigar** | Três abas lado a lado com o que cada método de pesquisa ganha e o que perde. |

Tudo funciona **só com o teclado** também (Tab para andar, setas para escolher, Enter ou
espaço para acionar).

E quando você imprime, **as três já saem resolvidas no papel**: as respostas do quiz
aparecem, a variável escondida aparece revelada, e os três caminhos saem lado a lado.
Ninguém recebe uma folha com perguntas sem resposta.

---

## 3. Como fazer a SUA edição

Esta é a parte que faz deste projeto um molde. **Você mexe em um arquivo só: `edicao.js`.**

Todo o resto — o desenho, as colunas, as interações, a impressão — já está pronto e não
precisa ser tocado.

### O caminho curto

1. **Antes de mais nada, renomeie o `edicao.js` que já está na pasta** para
   `edicao-01.js`. Faça isso **primeiro**, antes de copiar qualquer coisa: é o que impede
   você de escrever por cima da edição 01 e perdê-la.
2. Agora abra a subpasta **`exemplos/`**. Dentro tem o arquivo
   **`edicao-em-branco.js`** — um molde vazio, comentado em português, com um exemplo de
   cada tipo de caixa.
3. **Copie** esse arquivo para a pasta principal (a mesma onde está o `index.html`).
4. **Renomeie a sua cópia** de `edicao-em-branco.js` para **`edicao.js`**.
5. Abra esse `edicao.js` no Bloco de Notas (botão direito → **Abrir com** → Bloco de
   Notas) e troque os textos pelos seus.
6. Salve e **dê dois cliques no `index.html`** de novo (ou aperte F5 se já estiver aberto).

Pronto: é a sua edição.

### As cinco regras de ouro ao editar

- **Mexa só no que está entre aspas duplas** (`"assim"`). O resto é o esqueleto.
- **Dentro do texto, não use aspas duplas retas** (`"`). Use as curvas: `“ ”`. Uma aspa
  reta no meio do texto quebra o arquivo.
- **Não apague as vírgulas do fim das linhas**, nem as chaves `{ }`, nem os colchetes `[ ]`.
- Para destacar, use `**negrito**` e `*itálico*`. Nada de HTML.
- **Salve sempre como `.js`**, nunca como `.txt`. (No Bloco de Notas, em "Salvar como",
  escolha "Tipo: Todos os arquivos" e mantenha o nome `edicao.js`.)

> **Dica que economiza tempo: vá editar? Abra a página no Firefox.**
> Se você esquecer uma vírgula ou usar uma aspa reta, a página avisa — mas **só o Firefox
> diz em qual linha está o erro**. Chrome e Edge, quando a página é aberta por duplo
> clique, não informam a linha (é uma regra de segurança deles para arquivos do seu
> computador, não um defeito daqui). Erro de digitação é de longe o problema mais comum
> ao editar, então editar com o Firefox aberto ao lado poupa a caça à linha errada.

### O molde vem cheio: você vai apagar blocos, e isso tem um pulo do gato

O `edicao-em-branco.js` já vem com **duas matérias** e **quatro caixas** (uma de cada
tipo), para você ver um exemplo de cada coisa. Quase ninguém quer exatamente isso: o
normal é apagar o que não vai usar.

Pode apagar à vontade — **mas apague o bloco inteiro**, da chave `{` que o abre até a
chave `}` que o fecha, junto com a vírgula que vem depois. Meio bloco derruba o arquivo.

**E aqui está a armadilha:** toda caixa tem um campo **`ancora`**, que é o **`id` da
matéria em que ela se apoia** na página. Se você apagar a matéria e esquecer da caixa que
apontava para ela, a página avisa:

> A âncora "materia-dois" não é o id da manchete nem de uma matéria.
> Dica: use um destes ids: manchete, materia-um.

A solução está na própria mensagem: troque a `ancora` daquela caixa por um dos `id` que
ela lista. **Regra simples: apagou uma matéria, confira as `ancora` das caixas.**

### Errou? A página te avisa em português

Se algo estiver errado no seu `edicao.js`, a página **não fica em branco**. Ela mostra, no
topo, uma tarja dizendo **o que falta e em qual campo** — em português, e listando **todos
os problemas de uma vez**. Corrija, salve, recarregue.

**O passo a passo completo do que cada campo faz, e os três erros mais comuns com a
mensagem exata que aparece na tela, estão em [`docs/guia-do-editor.md`](docs/guia-do-editor.md).**
Se você vai editar, leia aquele arquivo.

---

## 4. Como publicar na internet de graça (GitHub Pages)

Aqui você põe a sua edição no ar, num endereço público, sem pagar nada e **sem usar
terminal**. Tudo é feito pelo site do GitHub, clicando.

Leva uns 15 minutos na primeira vez.

### Passo 1 — Criar uma conta no GitHub

Vá em https://github.com/signup e crie a conta. É gratuita. Escolha um nome de usuário
curto: ele vai aparecer no endereço final da sua página.

> Daqui para a frente, onde estiver escrito **SEU-USUARIO**, troque pelo nome de usuário
> que você escolheu.

### Passo 2 — Criar o repositório (a "pasta na nuvem")

1. Com a conta aberta, vá em https://github.com/new
2. Em **Repository name**, escreva um nome sem espaços e sem acento. Exemplo:
   `meu-jornal`.
3. Marque **Public**. (No plano gratuito, é assim que o Pages funciona. Publicar a partir
   de um repositório privado depende de plano pago.)
4. **Não** marque nenhuma das caixinhas de "Add a README" ou ".gitignore".
5. Clique em **Create repository**.

### Passo 3 — Subir os arquivos (arrastando)

Na tela que abriu, procure o link **"uploading an existing file"** (em português,
"enviando um arquivo existente"). Clique nele. Se não achar, vá direto para
`https://github.com/SEU-USUARIO/meu-jornal/upload/main`.

1. Abra a pasta do jornal no seu computador.
2. **Selecione tudo que está DENTRO dela** — `index.html`, `edicao.js`, e as pastas `css`,
   `js`, `fontes`, `exemplos`, `docs`, mais os arquivos `LICENSE`, `LICENSE-CONTEUDO`,
   `README.md` e `.nojekyll`.
   **Atenção:** é o conteúdo de dentro da pasta, **não** a pasta. Se você arrastar a pasta
   inteira, o `index.html` fica um nível abaixo e o endereço não funciona.
3. Arraste tudo para a área tracejada da página do GitHub e espere terminar de subir.
4. Lá embaixo, clique no botão verde **Commit changes**.

> **O arquivo `.nojekyll` é invisível em algumas configurações do Windows.** Se você não
> conseguir vê-lo para arrastar: no Explorador de Arquivos, aba **Exibir** → marque
> **Itens ocultos**. Ele é um arquivo vazio, mas precisa subir.

### Passo 4 — Ligar o GitHub Pages

1. No seu repositório, clique em **Settings** (a engrenagem, no menu de cima).
2. Na coluna da esquerda, clique em **Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Em **Branch**, escolha **main** e a pasta **/ (root)**. Clique em **Save**.
5. Espere de 1 a 3 minutos e recarregue a página de Settings → Pages. Vai aparecer, no
   alto, o endereço da sua página:

```
https://SEU-USUARIO.github.io/meu-jornal/
```

Esse é o link que você manda para as pessoas. (O da edição 01 é
https://fernandesbez.github.io/Todo-Mundo-Acha/ — feito exatamente por estes passos.)

### Se algo der errado

| O que você vê | O que é | Como resolver |
|---|---|---|
| **404** no endereço | Ou o Pages ainda não terminou de publicar, ou o `index.html` não está na raiz | Espere 3 minutos e recarregue. Se persistir, veja se em `github.com/SEU-USUARIO/meu-jornal` o `index.html` aparece já na primeira tela, sem precisar entrar numa pasta. Se estiver dentro de uma pasta, você arrastou a pasta em vez do conteúdo: apague os arquivos e refaça o Passo 3. |
| A página aparece **sem desenho nenhum**, só texto preto no branco | O CSS não subiu, ou o `.nojekyll` faltou | Confira se a pasta `css` está lá, com `estilo.css` dentro, e se o `.nojekyll` subiu (veja a nota do Passo 3). |
| **A tarja de erro em português** no topo | Seu `edicao.js` tem um problema | É o comportamento certo do molde. A tarja diz o que é. Veja [`docs/guia-do-editor.md`](docs/guia-do-editor.md). |

### Para trocar o texto depois de publicado

Não precisa subir tudo de novo. No GitHub, entre no arquivo `edicao.js`, clique no ícone
de **lápis** (Edit this file), altere o texto ali mesmo, desça e clique em
**Commit changes**. Em um ou dois minutos a página pública se atualiza sozinha.

---

## 5. Como imprimir ou gerar um PDF

Com a página aberta no navegador, aperte **Ctrl + P** (no Mac, **Cmd + P**).

A página já vem preparada para o papel: ela vira A4, as colunas se reorganizam, os botões
somem e as três interações saem **no estado resolvido**.

Na janela que abrir:

- Em **Destino**, escolha a sua impressora, ou **Salvar como PDF** para gerar um arquivo.
- Deixe **Margens** em "Padrão" e a escala em "Padrão" (100%). Não mexa.
- **Marque a opção "Gráficos de segundo plano"** (em alguns navegadores está escondida em
  "Mais definições"). Sem ela, os fundos cinza das caixas somem e o jornal fica sem graça.

A edição 01 sai em **3 folhas A4**. A sua pode sair em mais ou menos, dependendo de
quanto texto você escreveu.

---

## 6. De onde isto veio

Este jornal foi produzido como **Atividade Avaliativa da Unidade I** da disciplina
**PSI0981 — Psicologia Social e Comunicação**, da **Universidade Federal do Rio Grande do
Norte (UFRN)**, no período **2026.2**, sob orientação do docente Thiago da Silva Laurentino.

> **Não é um veículo oficial da UFRN.** É um modelo de página de jornal, feito como
> trabalho de disciplina. Não usa brasão, marca nem qualquer identidade visual da
> Universidade, e não fala em nome dela.

O conteúdo da edição 01 se apoia na bibliografia da disciplina (Günther; Pereira, Sindic e
Camino) e, como leituras complementares, em seis artigos com DOI verificado, listados na
seção **"Para ir além"** da própria página. A regra editorial seguida foi estrita: **o
jornal só afirma aquilo que o resumo oficial de cada artigo sustenta.**

---

## 7. Como citar

Se você usar o texto da edição 01:

> BEZERRA, João Victor Fernandes. **Todo Mundo Acha**, edição 01. Natal: 2026.
> Disponível em: https://fernandesbez.github.io/Todo-Mundo-Acha/. Acesso em: [data].

Se você usar o molde para fazer a sua edição, basta uma linha no seu expediente:

> Feito com o molde *Todo Mundo Acha* (MIT) — github.com/fernandesbez/Todo-Mundo-Acha

---

## 8. Licenças

São três, porque são três coisas diferentes dentro da mesma pasta:

| O quê | Licença | Onde está o texto |
|---|---|---|
| **O código** — `index.html`, `css/`, `js/`, `exemplos/`, `docs/` | **MIT** | [`LICENSE`](LICENSE) |
| **O texto da edição 01** — o que está em `edicao.js` | **CC BY 4.0** | [`LICENSE-CONTEUDO`](LICENSE-CONTEUDO) |
| **As fontes tipográficas** — `fontes/*.woff2` | **SIL OFL 1.1** | `fontes/OFL-*.txt` |

Na prática: **pegue o código e faça o que quiser com ele**, inclusive comercialmente,
mantendo o aviso de licença. **Use o texto da edição 01 citando o autor.** As fontes vêm
da coleção Google Fonts, todas OFL, e estão dentro da pasta — nada é buscado na internet
(veja `fontes/ORIGEM.md`).

Titular: João Victor Fernandes Bezerra, 2026.

---

## 9. O que tem em cada pasta

```
index.html          A página. É aqui que você dá dois cliques.
edicao.js           O CONTEÚDO. É o único arquivo que você precisa editar.
css/estilo.css      O desenho: colunas, cores, tipos, e as regras de impressão.
js/jornal.js        O motor: lê o edicao.js, monta a página e confere se está tudo certo.
js/interacoes.js    As três interações (o quiz, o botão de revelar, as abas).
exemplos/           edicao-em-branco.js — o molde vazio para você copiar.
docs/               guia-do-editor.md — o passo a passo de quem vai escrever.
fontes/             As letras, autohospedadas, com a licença de cada uma.
LICENSE             MIT (o código).
LICENSE-CONTEUDO    CC BY 4.0 (o texto da edição 01).
.nojekyll           Arquivo vazio, mas necessário: faz o GitHub Pages servir a pasta como está.
```

---

## 10. Perguntas que aparecem sempre

**Funciona sem internet?** Funciona. Depois de baixada a pasta, tudo roda do disco. É o
mesmo motivo pelo qual funciona de um pendrive.

**Preciso saber programar?** Não. Você edita texto entre aspas em um arquivo. As regras
estão na seção 3 e o guia completo em `docs/guia-do-editor.md`.

**Posso usar isto para um jornal de verdade, de um centro acadêmico?** Pode, e foi feito
para isso. O código é MIT. Troque o texto, troque o nome no alto do `edicao.js`, e ajuste
o expediente para dizer quem é você.

**Quantas matérias posso ter?** Quantas quiser. A lista `materias` em `edicao.js` aceita
quantos itens você escrever. A página se reorganiza sozinha.

**Dá para ler no celular?** Dá. As colunas viram uma só.
