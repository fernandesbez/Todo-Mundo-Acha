// =====================================================================
// TODO MUNDO ACHA — MOTOR DO MOLDE (js/jornal.js)
// Licença MIT. Script CLÁSSICO: nada de import/export, nada de módulo.
//
// O que este arquivo faz, em ordem:
//   1. VALIDA window.EDICAO (o conteúdo que veio de edicao.js);
//   2. se houver erro, mostra um aviso em português no topo da página
//      e PARA — a página nunca fica em branco;
//   3. se estiver tudo certo, MONTA a página inteira no DOM;
//   4. marca <html class="com-js"> e avisa quem estiver ouvindo
//      (o js/interacoes.js) com o evento "jornal:montado".
//
// REGRA DE OURO: todo texto entra no DOM por textContent ou por
// document.createTextNode. Nada de innerHTML. Isso elimina qualquer
// risco de o texto colado pelo editor virar código.
//
// O editor NÃO precisa mexer aqui. Mexa só em edicao.js.
// =====================================================================

(function () {
  "use strict";

  // ===================================================================
  // 1. AJUDANTES DE DOM
  // ===================================================================

  var NS_SVG = "http://www.w3.org/2000/svg";

  /** Cria um elemento com classe e texto opcionais. */
  function el(tag, classe, texto) {
    var n = document.createElement(tag);
    if (classe) { n.className = classe; }
    if (texto !== undefined && texto !== null && texto !== "") { n.textContent = String(texto); }
    return n;
  }

  /** Cria um elemento SVG (precisa de createElementNS). */
  function svgEl(tag, classe) {
    var n = document.createElementNS(NS_SVG, tag);
    if (classe) { n.setAttribute("class", classe); }
    return n;
  }

  /** Põe vários atributos de uma vez. */
  function attrs(n, mapa) {
    var k;
    for (k in mapa) {
      if (Object.prototype.hasOwnProperty.call(mapa, k) && mapa[k] !== null && mapa[k] !== undefined) {
        n.setAttribute(k, String(mapa[k]));
      }
    }
    return n;
  }

  /** Acrescenta filhos (ignora nulos). */
  function juntar(pai) {
    var i, f;
    for (i = 1; i < arguments.length; i++) {
      f = arguments[i];
      if (f) { pai.appendChild(f); }
    }
    return pai;
  }

  // ===================================================================
  // 2. MARCAÇÃO INLINE: **negrito** e *itálico*
  // ===================================================================
  // Um analisador próprio, pequeno e sem regex de substituição em HTML.
  // Varre o texto caractere a caractere e devolve uma lista de nós
  // (texto puro, <b> e <em>). Dois casos que quebram analisador ingênuo
  // e que este trata:
  //   - itálico colado a aspas curvas:  *“algo”*
  //   - dois itálicos seguidos no mesmo parágrafo:  *“a”* *“b”*
  // A regra é a mesma do protótipo: o delimitador mais próximo fecha
  // (busca não gulosa), e ** tem precedência sobre *.

  /**
   * Converte texto com negrito e itálico em uma lista de nós de DOM.
   *
   * Regra (a mesma do protótipo da T3): primeiro casam os pares de "**",
   * depois, no que sobrou, os pares de "*". Em cada passagem o
   * fechamento é o delimitador MAIS PRÓXIMO (busca não gulosa) — é isso
   * que faz dois itálicos seguidos no mesmo parágrafo virarem dois <em>
   * separados, e não um <em> gigante engolindo o texto do meio.
   * Marcador sem par de fechamento fica como texto literal.
   */
  function inline(texto) {
    var t = String(texto === undefined || texto === null ? "" : texto);
    return fatiar([t], "**", "b").reduce(function (acc, pedaco) {
      // Só os pedaços que ainda são texto puro passam pela segunda rodada.
      if (typeof pedaco === "string") {
        return acc.concat(fatiar([pedaco], "*", "em"));
      }
      acc.push(pedaco);
      return acc;
    }, []).map(function (pedaco) {
      return typeof pedaco === "string" ? document.createTextNode(pedaco) : pedaco;
    });
  }

  /**
   * Quebra os textos de uma lista nos pares de `marca`, trocando cada par
   * por um elemento `tag`. Devolve uma lista com textos (string) e
   * elementos já prontos, na ordem.
   */
  function fatiar(pedacos, marca, tag) {
    var saida = [];
    var p, t, pos, abre, fecha, conteudo;
    for (p = 0; p < pedacos.length; p++) {
      t = pedacos[p];
      pos = 0;
      while (pos < t.length) {
        abre = t.indexOf(marca, pos);
        // Precisa de ao menos um caractere entre os dois marcadores.
        fecha = abre === -1 ? -1 : t.indexOf(marca, abre + marca.length + 1);
        if (abre === -1 || fecha === -1) {
          saida.push(t.slice(pos));
          break;
        }
        if (abre > pos) { saida.push(t.slice(pos, abre)); }
        conteudo = t.slice(abre + marca.length, fecha);
        saida.push(el(tag, null, conteudo));
        pos = fecha + marca.length;
      }
    }
    // Some com os textos vazios, que só sujam o DOM.
    return saida.filter(function (x) { return x !== ""; });
  }

  /** Cria um elemento e enche com a marcação inline do texto. */
  function comInline(tag, classe, texto) {
    var n = el(tag, classe);
    var partes = inline(texto);
    var i;
    for (i = 0; i < partes.length; i++) { n.appendChild(partes[i]); }
    return n;
  }

  /** Acrescenta a marcação inline de um texto a um elemento já existente. */
  function porInline(n, texto) {
    var partes = inline(texto);
    var i;
    for (i = 0; i < partes.length; i++) { n.appendChild(partes[i]); }
    return n;
  }

  // Parágrafo que começa com "**Rótulo.** " ganha a classe paragrafo--rotulo.
  var RE_ROTULO = /^\*\*[^*]+\.\*\*\s/;

  /** Monta os parágrafos de um corpo dentro do elemento pai. */
  function paragrafos(pai, lista) {
    var i, p;
    for (i = 0; i < lista.length; i++) {
      p = comInline("p", RE_ROTULO.test(lista[i]) ? "paragrafo--rotulo" : null, lista[i]);
      pai.appendChild(p);
    }
    return pai;
  }

  // ===================================================================
  // 3. NOME CURTO DAS FONTES
  // ===================================================================
  // A linha "Fontes:" e o título das chamadas de "Para ir além" precisam
  // de um nome curto ("Sumner et al. (2014)"), e o esquema de edicao.js
  // só tem `id` e `referencia_abnt`. O motor resolve em três degraus:
  //
  //   1. o campo OPCIONAL `nome_curto` da própria fonte, se o editor
  //      escreveu um (é o jeito de mandar no resultado, e não exige
  //      mexer em nada aqui);
  //   2. o mapa CURTO abaixo, que cobre as fontes desta edição;
  //   3. uma derivação automática a partir da referência ABNT.
  //
  // O degrau 3 erra em referência de capítulo de livro (confunde autor com
  // organizador) e em autor coletivo. É rede de segurança, não regra: para
  // uma edição nova, escreva `nome_curto` na fonte ou acrescente uma linha
  // ao mapa.
  var CURTO = {
    "gunther": "Günther",
    "pereira": "Pereira, Sindic e Camino",
    "sumner-2014": "Sumner et al. (2014)",
    "darley-latane-1968": "Darley e Latané (1968)",
    "philpot-2020": "Philpot et al. (2020)",
    "osc-2015": "Open Science Collaboration (2015)",
    "massola-2016": "Massola, Crochík e Svartman (2016)",
    "manning-2007": "Manning, Levine e Collins (2007)",
    "gilbert-2016": "Gilbert et al. (2016)",
    "anderson-2016": "Anderson et al. (2016)"
  };

  /** Deixa um SOBRENOME em Capitalizado, respeitando acentos. */
  function capitalizar(palavra) {
    return palavra.charAt(0) + palavra.slice(1).toLocaleLowerCase("pt-BR");
  }

  /**
   * Nome curto de uma fonte, para a linha "Fontes:" e para o título das
   * chamadas de "Para ir além". Ver os três degraus acima.
   */
  function nomeCurto(fonte) {
    if (!fonte) { return ""; }
    if (fonte.nome_curto) { return String(fonte.nome_curto); }
    if (fonte.id && CURTO[fonte.id]) { return CURTO[fonte.id]; }

    var ref = String(fonte.referencia_abnt || "");
    // Só o trecho antes de "In:" interessa: depois dele vêm os organizadores.
    var autoral = ref.split(/\bIn:\s/)[0];
    // Sobrenomes em CAIXA-ALTA seguidos de vírgula (padrão ABNT).
    var sobrenomes = [];
    var re = /(^|[.;]\s)([A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ][A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ'\- ]{1,})\s*,/g;
    var m;
    while ((m = re.exec(autoral)) !== null) {
      sobrenomes.push(m[2].trim().split(/\s+/).map(capitalizar).join(" "));
      if (sobrenomes.length >= 4) { break; }
    }
    var temEtAl = /\bet al\./.test(autoral);
    var autores;
    if (sobrenomes.length === 0) {
      // Autor coletivo: "OPEN SCIENCE COLLABORATION. Título…"
      var coletivo = autoral.match(/^([A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ][A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ'\- ]{4,})\./);
      autores = coletivo
        ? coletivo[1].trim().split(/\s+/).map(capitalizar).join(" ")
        : (fonte.id ? String(fonte.id) : "Fonte");
    } else if (temEtAl || sobrenomes.length > 3) {
      autores = sobrenomes[0] + " et al.";
    } else if (sobrenomes.length === 1) {
      autores = sobrenomes[0];
    } else {
      autores = sobrenomes.slice(0, -1).join(", ") + " e " + sobrenomes[sobrenomes.length - 1];
    }
    // Ano: o último grupo de 4 dígitos entre 1800 e 2199 da referência.
    var anos = ref.match(/\b(1[89]\d\d|20\d\d|21\d\d)\b/g);
    if (anos && anos.length) {
      return autores + " (" + anos[anos.length - 1] + ")";
    }
    return autores;
  }

  // ===================================================================
  // 4. MONTAGEM DOS BLOCOS
  // ===================================================================

  /**
   * Linha "Fontes: nome p. …". Cada nome é link interno para a referência.
   * Aceita { id, paginas } ou uma string solta como atalho de { id }.
   */
  function fontes(lista, curtos) {
    var caixa = el("div", "fontes");
    caixa.appendChild(el("span", "rotulo fontes__rotulo", "Fontes"));
    var ul = el("ul", "fontes__lista");
    var i, f, li, a;
    for (i = 0; i < lista.length; i++) {
      f = typeof lista[i] === "string" ? { id: lista[i] } : lista[i];
      li = el("li", "fontes__item");
      a = el("a", "fontes__nome", curtos[f.id] || f.id);
      a.setAttribute("href", "#ref-" + f.id);
      li.appendChild(a);
      if (f.paginas) {
        li.appendChild(document.createTextNode(" "));
        li.appendChild(el("span", "fontes__paginas", f.paginas));
      }
      ul.appendChild(li);
    }
    caixa.appendChild(ul);
    return caixa;
  }

  function manchete(m, curtos) {
    var art = el("article", "manchete");
    art.setAttribute("aria-labelledby", m.id + "-t");
    art.appendChild(el("p", "manchete__chapeu", m.chapeu));
    var h2 = comInline("h2", "manchete__titulo", m.titulo);
    h2.id = m.id + "-t";
    art.appendChild(h2);
    art.appendChild(comInline("p", "manchete__linha-fina", m.linha_fina));
    var corpo = el("div", "manchete__corpo");
    paragrafos(corpo, m.corpo);
    art.appendChild(corpo);
    art.appendChild(fontes(m.fontes, curtos));
    var autoria = el("p", "manchete__autoria", "Por ");
    autoria.appendChild(el("b", null, m.autoria));
    art.appendChild(autoria);
    return art;
  }

  function materia(m, extra, curtos) {
    var art = el("article", ("materia" + extra).trim());
    art.setAttribute("aria-labelledby", m.id + "-t");
    art.appendChild(el("p", "rotulo materia__secao", m.secao));
    var h2 = comInline("h2", "materia__titulo", m.titulo);
    h2.id = m.id + "-t";
    art.appendChild(h2);
    art.appendChild(comInline("p", "materia__linha-fina", m.linha_fina));
    var corpo = el("div", "materia__corpo");
    paragrafos(corpo, m.corpo);
    art.appendChild(corpo);
    art.appendChild(fontes(m.fontes, curtos));
    return art;
  }

  // -------------------------------------------------------------------
  // I2 — o gráfico. É um ESQUEMA, sem números: só mostra que as duas
  // curvas têm o mesmo formato. As coordenadas vêm do protótipo da T3.
  // -------------------------------------------------------------------
  var XS = [6, 75.6, 145.2, 214.8, 284.4, 354];
  var SORV = [86, 90, 80, 38, 28, 22];
  var AFOG = [80, 84, 88, 34, 26, 30];
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun"];

  function y(valor, topo) { return topo + 82 - (valor / 100) * 56; }

  function pontos(vals, topo) {
    var saida = [];
    var i;
    for (i = 0; i < vals.length; i++) {
      saida.push(XS[i].toFixed(1) + "," + y(vals[i], topo).toFixed(1));
    }
    return saida.join(" ");
  }

  function linhaBase(y1) {
    return attrs(svgEl("line", "g-base"), { x1: 6, y1: y1, x2: 354, y2: y1 });
  }

  function textoSvg(classe, x, yy, texto) {
    var n = svgEl("text", classe);
    n.setAttribute("x", String(x));
    n.setAttribute("y", String(yy));
    n.textContent = texto;
    return n;
  }

  function graficoVariavel(c, idp) {
    var v1 = c.variaveis[0];
    var v2 = c.variaveis[1];
    var escondida = c.variavel_escondida;

    var svg = svgEl("svg", "grafico__svg");
    attrs(svg, {
      viewBox: "0 0 360 300",
      role: "img",
      "aria-labelledby": idp + "-t " + idp + "-d"
    });

    var titulo = svgEl("title");
    titulo.id = idp + "-t";
    titulo.textContent = "Esquema, sem números: " + v1 + " e " + v2 + ", de janeiro a junho";
    svg.appendChild(titulo);

    var desc = svgEl("desc");
    desc.id = idp + "-d";
    desc.textContent = "Duas curvas com o mesmo formato: altas de janeiro a março e mais baixas de abril a junho. "
      + "A terceira variável, " + escondida + ", fica escondida até o leitor pedir para revelá-la; "
      + "revelada, marca os meses de janeiro a março.";
    svg.appendChild(desc);

    // Revelado: faixa dos meses mais quentes, atrás de tudo.
    var faixa = svgEl("g", "grafico__terceira");
    faixa.appendChild(attrs(svgEl("rect", "g-banda"), { x: 0, y: 0, width: 182, height: 284 }));
    svg.appendChild(faixa);

    // Curva 1 — as duas variáveis que parecem ligadas.
    svg.appendChild(textoSvg("g-rotulo", 6, 19, v1));
    svg.appendChild(linhaBase(88));
    svg.appendChild(attrs(svgEl("polyline", "g-serie g-serie--sorvete"), { points: pontos(SORV, 6) }));
    svg.appendChild(attrs(svgEl("circle", "g-ponto--sorvete"),
      { cx: XS[5].toFixed(1), cy: y(SORV[5], 6).toFixed(1), r: 4.5 }));

    // Curva 2.
    svg.appendChild(textoSvg("g-rotulo", 6, 115, v2));
    svg.appendChild(linhaBase(184));
    svg.appendChild(attrs(svgEl("polyline", "g-serie g-serie--afogados"), { points: pontos(AFOG, 102) }));
    svg.appendChild(attrs(svgEl("circle", "g-ponto--afogados"),
      { cx: XS[5].toFixed(1), cy: y(AFOG[5], 102).toFixed(1), r: 4.5 }));

    // Repouso (com JS): a terceira linha aparece como "escondida".
    var oculta = svgEl("g", "grafico__oculta");
    oculta.appendChild(attrs(svgEl("rect", "g-oculta-caixa"), { x: 6, y: 222, width: 348, height: 58 }));
    oculta.appendChild(textoSvg("g-oculta-texto", 20, 246, "Terceira variável:"));
    oculta.appendChild(textoSvg("g-oculta-texto", 20, 266, "escondida"));
    var interrog = textoSvg("g-oculta-interrog", 318, 268, "?");
    interrog.setAttribute("text-anchor", "middle");
    oculta.appendChild(interrog);
    svg.appendChild(oculta);

    // Revelado: a terceira variável.
    var terceira = svgEl("g", "grafico__terceira");
    var rotuloTerceira = textoSvg("g-rotulo", 6, 211, escondida);
    rotuloTerceira.setAttribute("style", "fill: var(--atencao)");
    terceira.appendChild(rotuloTerceira);
    terceira.appendChild(linhaBase(280));
    terceira.appendChild(attrs(svgEl("rect", "g-barra"), { x: 6, y: 224, width: 174, height: 46 }));
    var barraTexto = textoSvg("g-barra-texto", 93, 252, "meses mais quentes");
    barraTexto.setAttribute("text-anchor", "middle");
    terceira.appendChild(barraTexto);
    svg.appendChild(terceira);

    // Eixo dos meses.
    var i, t;
    for (i = 0; i < MESES.length; i++) {
      t = textoSvg("g-eixo", XS[i].toFixed(1), 296, MESES[i]);
      if (i === 5) { t.setAttribute("text-anchor", "end"); }
      else if (i !== 0) { t.setAttribute("text-anchor", "middle"); }
      svg.appendChild(t);
    }
    return svg;
  }

  function caixaRevelar(c, curtos) {
    var idp = c.id;
    var sec = el("section", "caixa caixa--revelar");
    attrs(sec, { "aria-labelledby": idp + "-t", "data-tipo": "revelar", "data-ancora": c.ancora });
    sec.appendChild(el("p", "rotulo caixa__rotulo", "Quadro"));
    var h2 = comInline("h2", "caixa__titulo", c.titulo);
    h2.id = idp + "-t";
    sec.appendChild(h2);

    var antes = el("div", "revelar__antes");
    antes.appendChild(el("h3", "revelar__subtitulo", c.antes.titulo));
    antes.appendChild(comInline("p", null, c.antes.texto));
    sec.appendChild(antes);

    var fig = el("figure", "grafico");
    fig.appendChild(graficoVariavel(c, idp + "-g"));
    fig.appendChild(el("figcaption", "grafico__legenda", "Esquema ilustrativo, sem números."));
    sec.appendChild(fig);

    var acoes = el("div", "revelar__acoes");
    var botao = el("button", "botao botao--revelar", c.botao);
    attrs(botao, { type: "button", "aria-expanded": "false", "aria-controls": idp + "-r" });
    acoes.appendChild(botao);
    sec.appendChild(acoes);

    var resposta = el("div", "revelar__resposta");
    resposta.id = idp + "-r";
    resposta.appendChild(el("h3", "revelar__subtitulo", c.revelacao.titulo));
    resposta.appendChild(comInline("p", null, c.revelacao.texto));
    resposta.appendChild(comInline("p", "revelar__explicacao", c.explicacao));
    sec.appendChild(resposta);

    sec.appendChild(fontes(c.fontes, curtos));
    return sec;
  }

  // -------------------------------------------------------------------
  // I1 — classifique a pergunta
  // -------------------------------------------------------------------
  function caixaClassificar(c, curtos) {
    var idp = c.id;
    var nomes = {};
    var i, j;
    for (i = 0; i < c.tipos.length; i++) { nomes[c.tipos[i].id] = c.tipos[i].nome; }

    var sec = el("section", "caixa caixa--classificar");
    attrs(sec, { "aria-labelledby": idp + "-t", "data-tipo": "classificar", "data-ancora": c.ancora });
    sec.appendChild(el("p", "rotulo caixa__rotulo", "Quadro"));
    var h2 = comInline("h2", "caixa__titulo", c.titulo);
    h2.id = idp + "-t";
    sec.appendChild(h2);
    sec.appendChild(comInline("p", "caixa__instrucao", c.instrucao));

    var lista = el("div", "classificar__lista");
    for (i = 0; i < c.perguntas.length; i++) {
      var p = c.perguntas[i];
      var campo = el("fieldset", "pergunta");
      campo.setAttribute("data-estado", "repouso");

      var legenda = el("legend", "pergunta__enunciado");
      legenda.appendChild(el("span", "pergunta__numero", String(i + 1)));
      porInline(legenda, p.texto);
      campo.appendChild(legenda);

      var opcoes = el("div", "pergunta__opcoes");
      for (j = 0; j < c.tipos.length; j++) {
        var t = c.tipos[j];
        var rotulo = el("label", "opcao");
        var radio = el("input", "opcao__campo");
        attrs(radio, { type: "radio", name: idp + "-p" + (i + 1), value: t.id });
        rotulo.appendChild(radio);
        var marca = el("span", "opcao__marca");
        marca.setAttribute("aria-hidden", "true");
        rotulo.appendChild(marca);
        rotulo.appendChild(el("span", "opcao__texto", t.nome));
        rotulo.appendChild(el("span", "opcao__estado"));
        opcoes.appendChild(rotulo);
      }
      campo.appendChild(opcoes);

      var feedback = el("p", "pergunta__feedback");
      feedback.setAttribute("role", "status");
      campo.appendChild(feedback);

      var resolucao = el("div", "pergunta__resolucao");
      var linhaTipo = el("p", "pergunta__tipo");
      linhaTipo.appendChild(el("b", null, "Tipo: " + String(nomes[p.tipo]).toLocaleLowerCase("pt-BR")));
      resolucao.appendChild(linhaTipo);
      resolucao.appendChild(comInline("p", "pergunta__explicacao", p.explicacao));
      campo.appendChild(resolucao);

      lista.appendChild(campo);
    }
    sec.appendChild(lista);

    var n = c.perguntas.length;
    var placar = el("div", "placar");
    placar.setAttribute("role", "status");
    var texto = el("p", "placar__texto", "Você ainda não respondeu. Faltam ");
    texto.appendChild(el("b", null, String(n)));
    texto.appendChild(document.createTextNode(n === 1 ? " pergunta." : " perguntas."));
    placar.appendChild(texto);
    var pontosLista = el("ol", "placar__pontos");
    pontosLista.setAttribute("aria-hidden", "true");
    for (i = 0; i < n; i++) { pontosLista.appendChild(el("li", "ponto")); }
    placar.appendChild(pontosLista);
    var recomecar = el("button", "botao botao--secundario", "Recomeçar");
    recomecar.setAttribute("type", "button");
    recomecar.disabled = true;
    placar.appendChild(recomecar);
    sec.appendChild(placar);

    sec.appendChild(comInline("p", "classificar__fecho", c.fecho));
    sec.appendChild(fontes(c.fontes, curtos));
    return sec;
  }

  // -------------------------------------------------------------------
  // I3 — três caminhos, lado a lado
  // -------------------------------------------------------------------
  function caixaComparar(c, curtos) {
    var idp = c.id;
    var sec = el("section", "caixa caixa--comparar");
    attrs(sec, {
      "aria-labelledby": idp + "-t",
      "data-tipo": "comparar",
      "data-ancora": c.ancora,
      "data-caminho-ativo": c.caminhos[0].id
    });
    sec.appendChild(el("p", "rotulo caixa__rotulo", "Quadro"));
    var h2 = comInline("h2", "caixa__titulo", c.titulo);
    h2.id = idp + "-t";
    sec.appendChild(h2);

    // A frase sobre cor e forma é do motor, não da edição: ela explica a
    // convenção visual (círculo/quadrado/losango) que o CSS aplica.
    sec.appendChild(comInline("p", "caixa__instrucao", c.introducao
      + " Escolha um caminho; a cor e a forma (círculo, quadrado, losango) identificam cada método."));

    var abas = el("div", "caminhos__abas");
    attrs(abas, { role: "tablist", "aria-label": "Os três caminhos" });
    var paineis = el("div", "caminhos__paineis");

    var i;
    for (i = 0; i < c.caminhos.length; i++) {
      var k = c.caminhos[i];
      var ativo = i === 0;

      var aba = el("button", "aba metodo--" + k.id);
      attrs(aba, {
        type: "button",
        role: "tab",
        id: idp + "-aba-" + k.id,
        "aria-selected": ativo ? "true" : "false",
        "aria-controls": idp + "-painel-" + k.id
      });
      if (!ativo) { aba.setAttribute("tabindex", "-1"); }
      var nome = el("span", "aba__nome");
      var selo = el("span", "selo-metodo");
      selo.setAttribute("aria-hidden", "true");
      nome.appendChild(selo);
      nome.appendChild(el("span", "aba__texto", k.nome));
      aba.appendChild(nome);
      abas.appendChild(aba);

      var painel = el("article", "caminho metodo--" + k.id + (ativo ? " esta-ativo" : ""));
      attrs(painel, {
        role: "tabpanel",
        id: idp + "-painel-" + k.id,
        "aria-labelledby": idp + "-aba-" + k.id,
        tabindex: "0"
      });
      var texto = el("div", "caminho__texto");
      texto.appendChild(el("p", "rotulo caminho__rotulo selo-metodo", "Caminho " + (i + 1) + " · " + k.nome));
      texto.appendChild(el("h3", "caminho__titulo", k.nome));
      var caso = el("div", "caminho__caso");
      caso.appendChild(el("b", null, "Exemplo"));
      porInline(caso, k.exemplo);
      texto.appendChild(caso);
      painel.appendChild(texto);

      var balanco = el("dl", "caminho__balanco");
      var ganha = el("div", "balanco balanco--ganha");
      ganha.appendChild(el("dt", null, "Ganha"));
      ganha.appendChild(comInline("dd", null, k.ganha));
      balanco.appendChild(ganha);
      var perde = el("div", "balanco balanco--perde");
      perde.appendChild(el("dt", null, "Perde"));
      perde.appendChild(comInline("dd", null, k.perde));
      balanco.appendChild(perde);
      painel.appendChild(balanco);

      paineis.appendChild(painel);
    }
    sec.appendChild(abas);
    sec.appendChild(paineis);
    sec.appendChild(fontes(c.fontes, curtos));
    return sec;
  }

  function caixaDestaque(c, curtos) {
    var lado = el("aside", "caixa caixa--destaque");
    attrs(lado, { "aria-labelledby": c.id + "-t", "data-tipo": "destaque", "data-ancora": c.ancora });
    var h2 = comInline("h2", "caixa__titulo", c.titulo);
    h2.id = c.id + "-t";
    lado.appendChild(h2);
    var corpo = el("div", "caixa__corpo");
    paragrafos(corpo, c.corpo);
    lado.appendChild(corpo);
    lado.appendChild(fontes(c.fontes, curtos));
    return lado;
  }

  function editorial(e, curtos) {
    var sec = el("section", "editorial");
    sec.setAttribute("aria-labelledby", e.id + "-t");
    sec.appendChild(el("p", "rotulo editorial__rotulo", "Editorial"));
    var h2 = comInline("h2", "editorial__titulo", e.titulo);
    h2.id = e.id + "-t";
    sec.appendChild(h2);
    var corpo = el("div", "editorial__corpo");
    paragrafos(corpo, e.corpo);
    sec.appendChild(corpo);
    sec.appendChild(fontes(e.fontes, curtos));
    return sec;
  }

  function paraIrAlem(lista, curtos) {
    // Escreve "Seis leituras para aprofundar" / "Uma leitura para aprofundar".
    // Até dez sai por extenso, como manda a norma de texto corrido; daí em diante,
    // em algarismo. O singular existe porque uma edição pode ter uma fonte só.
    function tituloDasLeituras(quantas) {
      var extenso = ["Nenhuma", "Uma", "Duas", "Três", "Quatro", "Cinco",
                     "Seis", "Sete", "Oito", "Nove", "Dez"];
      var numero = quantas <= 10 ? extenso[quantas] : String(quantas);
      // "Nenhuma leitura" e "Uma leitura" são singulares; de duas em diante, plural.
      var substantivo = quantas <= 1 ? " leitura" : " leituras";
      return numero + substantivo + " para aprofundar";
    }

    var sec = el("section", "alem");
    sec.setAttribute("aria-labelledby", "alem-t");
    var cab = el("header", "alem__cabecalho");
    cab.appendChild(el("p", "rotulo", "Para ir além"));
    // O número vem da lista, não fica fixo: outra edição pode ter 1 ou 10 leituras.
    var h2 = el("h2", "alem__titulo", tituloDasLeituras(lista.length));
    h2.id = "alem-t";
    cab.appendChild(h2);
    sec.appendChild(cab);

    var caixa = el("div", "alem__lista");
    var i;
    for (i = 0; i < lista.length; i++) {
      var f = lista[i];
      var art = el("article", "chamada");
      art.id = "ref-" + f.id;
      art.appendChild(el("p", "rotulo chamada__rotulo", "Leitura " + (i + 1)));
      art.appendChild(el("h3", "chamada__titulo", curtos[f.id] || f.id));
      var oQueDiz = el("p", "chamada__texto");
      oQueDiz.appendChild(el("b", null, "O que diz:"));
      oQueDiz.appendChild(document.createTextNode(" "));
      porInline(oQueDiz, f.o_que_diz);
      art.appendChild(oQueDiz);
      var cuidado = el("p", "chamada__cuidado");
      cuidado.appendChild(el("b", null, "Cuidado:"));
      cuidado.appendChild(document.createTextNode(" "));
      porInline(cuidado, f.cuidado);
      art.appendChild(cuidado);
      // O DOI entra como TEXTO dentro da referência; não viramos link para
      // doi.org (decisão do projeto: nenhum link de saída).
      art.appendChild(comInline("p", "chamada__ref", f.referencia_abnt));
      caixa.appendChild(art);
    }
    sec.appendChild(caixa);
    return sec;
  }

  function referencias(edicao) {
    var sec = el("section", "referencias");
    sec.setAttribute("aria-labelledby", "ref-t");
    var cab = el("header", "referencias__cabecalho");
    cab.appendChild(el("p", "rotulo", "Referências"));
    var h2 = el("h2", "referencias__titulo", "Fontes da disciplina e complementares");
    h2.id = "ref-t";
    cab.appendChild(h2);
    sec.appendChild(cab);

    var ul = el("ul", "referencias__lista");
    var todas = edicao.fontes_da_disciplina.concat(edicao.fontes_complementares);
    var i, li;
    for (i = 0; i < todas.length; i++) {
      li = comInline("li", "referencia", todas[i].referencia_abnt);
      li.id = "ref-" + todas[i].id;
      ul.appendChild(li);
    }
    sec.appendChild(ul);
    return sec;
  }

  // ===================================================================
  // 5. VALIDADOR (nível B): mensagens em português, nunca página em branco
  // ===================================================================

  var TIPOS_DE_CAIXA = ["classificar", "revelar", "comparar", "destaque"];

  /** Acumula os problemas encontrados. */
  function Problemas() {
    this.itens = [];
  }
  Problemas.prototype.add = function (caminho, texto, dica) {
    this.itens.push({ caminho: caminho, texto: texto, dica: dica || "" });
  };
  Problemas.prototype.temAlgum = function () { return this.itens.length > 0; };

  function ehTexto(v) { return typeof v === "string" && v.trim() !== ""; }
  function ehLista(v) { return Object.prototype.toString.call(v) === "[object Array]"; }
  function ehObjeto(v) { return v !== null && typeof v === "object" && !ehLista(v); }

  /** Confere que o campo existe e é texto não vazio. */
  function exigeTexto(p, obj, campo, caminho, dica) {
    if (!ehObjeto(obj)) { return false; }
    var v = obj[campo];
    if (v === undefined || v === null || v === "") {
      p.add(caminho + "." + campo, "Falta o campo “" + campo + "”.",
        dica || "Dica: escreva o texto entre aspas duplas.");
      return false;
    }
    if (!ehTexto(v)) {
      p.add(caminho + "." + campo, "O campo “" + campo + "” precisa ser um texto entre aspas, e veio como "
        + tipoEmPortugues(v) + ".", dica || "Dica: escreva o texto entre aspas duplas.");
      return false;
    }
    return true;
  }

  /** Confere que o campo existe e é uma lista de textos. */
  function exigeListaDeTextos(p, obj, campo, caminho) {
    if (!ehObjeto(obj)) { return false; }
    var v = obj[campo];
    if (v === undefined || v === null) {
      p.add(caminho + "." + campo, "Falta o campo “" + campo + "”.",
        "Dica: é uma lista de parágrafos, entre colchetes [ ], cada um entre aspas.");
      return false;
    }
    if (!ehLista(v)) {
      p.add(caminho + "." + campo, "O campo “" + campo + "” precisa ser uma lista entre colchetes [ ], e veio como "
        + tipoEmPortugues(v) + ".", "Dica: use [ \"primeiro parágrafo\", \"segundo parágrafo\" ].");
      return false;
    }
    if (v.length === 0) {
      p.add(caminho + "." + campo, "A lista “" + campo + "” está vazia.",
        "Dica: escreva ao menos um parágrafo.");
      return false;
    }
    var i, ok = true;
    for (i = 0; i < v.length; i++) {
      if (!ehTexto(v[i])) {
        p.add(caminho + "." + campo + "[" + i + "]", "Este item precisa ser um texto entre aspas, e veio como "
          + tipoEmPortugues(v[i]) + ".", "Dica: cada parágrafo é um texto entre aspas duplas.");
        ok = false;
      }
    }
    return ok;
  }

  /** Nome do tipo do valor, em português, para a mensagem de erro. */
  function tipoEmPortugues(v) {
    if (v === null) { return "vazio (null)"; }
    if (ehLista(v)) { return "uma lista [ ]"; }
    switch (typeof v) {
      case "string": return "um texto";
      case "number": return "um número";
      case "boolean": return "verdadeiro/falso";
      case "object": return "um bloco { }";
      case "undefined": return "nada";
      default: return "outra coisa";
    }
  }

  /** Confere a lista de fontes de um bloco e registra os ids usados. */
  function conferirFontes(p, obj, caminho, usados) {
    var v = obj.fontes;
    if (v === undefined || v === null) { return; }
    if (!ehLista(v)) {
      p.add(caminho + ".fontes", "O campo “fontes” precisa ser uma lista entre colchetes [ ], e veio como "
        + tipoEmPortugues(v) + ".", "Dica: use [ { id: \"gunther\", paginas: \"p. 58\" } ].");
      return;
    }
    var i, f;
    for (i = 0; i < v.length; i++) {
      f = typeof v[i] === "string" ? { id: v[i] } : v[i];
      if (!ehObjeto(f) || !ehTexto(f.id)) {
        p.add(caminho + ".fontes[" + i + "].id", "Falta o campo “id” da fonte.",
          "Dica: cada fonte é { id: \"gunther\" } e o id precisa existir na lista de referências.");
        continue;
      }
      usados.push({ id: f.id, caminho: caminho + ".fontes[" + i + "]" });
    }
  }

  /**
   * Valida window.EDICAO inteira. Devolve a lista de problemas.
   * Regras mínimas: perguntas 5–6; caminhos exatamente 3; tipos exatamente 4
   * e todo pergunta.tipo conhecido; para_ir_alem completa; linha_fina em toda
   * matéria; todo fontes[].id existente; ancora conhecida.
   */
  function validar(edicao) {
    var p = new Problemas();
    var i, j, c;

    if (!ehObjeto(edicao)) {
      p.add("window.EDICAO", "O arquivo edicao.js não definiu o conteúdo da edição.",
        "Dica: o arquivo precisa começar com window.EDICAO = { … };");
      return p;
    }

    // --- jornal -------------------------------------------------------
    if (!ehObjeto(edicao.jornal)) {
      p.add("jornal", "Falta o bloco “jornal”.", "Dica: jornal: { nome, lema, numero, data }.");
    } else {
      exigeTexto(p, edicao.jornal, "nome", "jornal");
      exigeTexto(p, edicao.jornal, "lema", "jornal");
      exigeTexto(p, edicao.jornal, "numero", "jornal");
      exigeTexto(p, edicao.jornal, "data", "jornal");
      // local é opcional.
      if (edicao.jornal.local !== undefined && edicao.jornal.local !== null && !ehTexto(edicao.jornal.local)) {
        p.add("jornal.local", "O campo “local” é opcional, mas quando existe precisa ser um texto entre aspas.",
          "Dica: apague a linha ou escreva local: \"Natal, RN\".");
      }
    }

    exigeTexto(p, edicao, "aviso_modelo", "");

    // --- manchete -----------------------------------------------------
    var idsDeAncora = [];
    if (!ehObjeto(edicao.manchete)) {
      p.add("manchete", "Falta o bloco “manchete”.",
        "Dica: manchete: { id, chapeu, titulo, linha_fina, autoria, corpo, fontes }.");
    } else {
      exigeTexto(p, edicao.manchete, "id", "manchete");
      exigeTexto(p, edicao.manchete, "chapeu", "manchete");
      exigeTexto(p, edicao.manchete, "titulo", "manchete");
      exigeTexto(p, edicao.manchete, "linha_fina", "manchete");
      exigeTexto(p, edicao.manchete, "autoria", "manchete");
      exigeListaDeTextos(p, edicao.manchete, "corpo", "manchete");
      if (ehTexto(edicao.manchete.id)) { idsDeAncora.push(edicao.manchete.id); }
    }

    // --- matérias -----------------------------------------------------
    var usados = [];
    if (ehObjeto(edicao.manchete)) { conferirFontes(p, edicao.manchete, "manchete", usados); }

    if (!ehLista(edicao.materias)) {
      p.add("materias", "Falta a lista “materias”.", "Dica: materias: [ { … }, { … } ].");
    } else {
      for (i = 0; i < edicao.materias.length; i++) {
        var cam = "materias[" + i + "]";
        var m = edicao.materias[i];
        if (!ehObjeto(m)) {
          p.add(cam, "Esta matéria precisa ser um bloco { … }.", "Dica: confira as chaves { } e as vírgulas.");
          continue;
        }
        exigeTexto(p, m, "id", cam);
        exigeTexto(p, m, "secao", cam);
        exigeTexto(p, m, "titulo", cam);
        exigeTexto(p, m, "linha_fina", cam, "Dica: toda matéria precisa de uma linha fina: uma frase abaixo do título.");
        exigeListaDeTextos(p, m, "corpo", cam);
        conferirFontes(p, m, cam, usados);
        if (ehTexto(m.id)) { idsDeAncora.push(m.id); }
      }
    }

    // --- caixas -------------------------------------------------------
    if (!ehLista(edicao.caixas)) {
      p.add("caixas", "Falta a lista “caixas”.", "Dica: caixas: [ { … } ].");
    } else {
      for (i = 0; i < edicao.caixas.length; i++) {
        c = edicao.caixas[i];
        var cc = "caixas[" + i + "]";
        if (!ehObjeto(c)) {
          p.add(cc, "Esta caixa precisa ser um bloco { … }.", "Dica: confira as chaves { } e as vírgulas.");
          continue;
        }
        exigeTexto(p, c, "id", cc);
        exigeTexto(p, c, "titulo", cc);
        conferirFontes(p, c, cc, usados);

        if (!ehTexto(c.tipo)) {
          p.add(cc + ".tipo", "Falta o campo “tipo” da caixa.",
            "Dica: o tipo é um destes: " + TIPOS_DE_CAIXA.join(", ") + ".");
        } else if (TIPOS_DE_CAIXA.indexOf(c.tipo) === -1) {
          p.add(cc + ".tipo", "O tipo “" + c.tipo + "” não existe.",
            "Dica: use um destes: " + TIPOS_DE_CAIXA.join(", ") + ".");
        } else if (c.tipo === "classificar") {
          validarClassificar(p, c, cc);
        } else if (c.tipo === "revelar") {
          validarRevelar(p, c, cc);
        } else if (c.tipo === "comparar") {
          validarComparar(p, c, cc);
        } else if (c.tipo === "destaque") {
          exigeListaDeTextos(p, c, "corpo", cc);
        }
      }
    }

    // --- editorial ----------------------------------------------------
    if (!ehObjeto(edicao.editorial)) {
      p.add("editorial", "Falta o bloco “editorial”.", "Dica: editorial: { id, titulo, corpo, fontes }.");
    } else {
      exigeTexto(p, edicao.editorial, "id", "editorial");
      exigeTexto(p, edicao.editorial, "titulo", "editorial");
      exigeListaDeTextos(p, edicao.editorial, "corpo", "editorial");
      conferirFontes(p, edicao.editorial, "editorial", usados);
    }

    // --- listas de fontes --------------------------------------------
    var idsConhecidos = {};
    ["fontes_da_disciplina", "fontes_complementares"].forEach(function (chave) {
      if (!ehLista(edicao[chave])) {
        p.add(chave, "Falta a lista “" + chave + "”.",
          "Dica: " + chave + ": [ { id: \"gunther\", referencia_abnt: \"…\" } ]. Pode ficar vazia: [ ].");
        return;
      }
      var k;
      for (k = 0; k < edicao[chave].length; k++) {
        var f = edicao[chave][k];
        var cf = chave + "[" + k + "]";
        if (!ehObjeto(f)) {
          p.add(cf, "Esta fonte precisa ser um bloco { … }.", "Dica: { id: \"…\", referencia_abnt: \"…\" }.");
          continue;
        }
        exigeTexto(p, f, "id", cf);
        exigeTexto(p, f, "referencia_abnt", cf);
        if (ehTexto(f.id)) { idsConhecidos[f.id] = true; }
      }
    });

    // --- para ir além -------------------------------------------------
    if (!ehLista(edicao.para_ir_alem)) {
      p.add("para_ir_alem", "Falta a lista “para_ir_alem”.",
        "Dica: para_ir_alem: [ { id, doi, referencia_abnt, o_que_diz, cuidado } ].");
    } else {
      for (i = 0; i < edicao.para_ir_alem.length; i++) {
        var a = edicao.para_ir_alem[i];
        var ca = "para_ir_alem[" + i + "]";
        if (!ehObjeto(a)) {
          p.add(ca, "Esta leitura precisa ser um bloco { … }.",
            "Dica: { id, doi, referencia_abnt, o_que_diz, cuidado }.");
          continue;
        }
        exigeTexto(p, a, "id", ca);
        exigeTexto(p, a, "doi", ca, "Dica: só o código do DOI, sem endereço. Exemplo: 10.1126/science.aac4716.");
        exigeTexto(p, a, "referencia_abnt", ca);
        exigeTexto(p, a, "o_que_diz", ca, "Dica: em até 40 palavras, o que a fonte diz.");
        exigeTexto(p, a, "cuidado", ca, "Dica: em até 25 palavras, o que NÃO dá para concluir dela.");
        if (ehTexto(a.id)) { idsConhecidos[a.id] = true; }
      }
    }

    // --- expediente ---------------------------------------------------
    if (!ehObjeto(edicao.expediente)) {
      p.add("expediente", "Falta o bloco “expediente”.",
        "Dica: expediente: { autoria, disciplina, instituicao, docente, origem, licenca }.");
    } else {
      ["autoria", "disciplina", "instituicao", "docente", "origem", "licenca"].forEach(function (campo) {
        exigeTexto(p, edicao.expediente, campo, "expediente");
      });
    }

    // --- cruzamentos: fontes usadas e âncoras -------------------------
    for (i = 0; i < usados.length; i++) {
      if (!idsConhecidos[usados[i].id]) {
        p.add(usados[i].caminho + ".id", "A fonte “" + usados[i].id + "” não existe em nenhuma lista de referências.",
          "Dica: cadastre esse id em fontes_da_disciplina, fontes_complementares ou para_ir_alem, "
          + "ou corrija o id aqui.");
      }
    }
    if (ehLista(edicao.caixas)) {
      for (i = 0; i < edicao.caixas.length; i++) {
        c = edicao.caixas[i];
        if (!ehObjeto(c)) { continue; }
        if (!ehTexto(c.ancora)) {
          p.add("caixas[" + i + "].ancora", "Falta o campo “ancora” da caixa.",
            "Dica: a âncora é o id da manchete ou de uma matéria: " + idsDeAncora.join(", ") + ".");
        } else if (idsDeAncora.indexOf(c.ancora) === -1) {
          p.add("caixas[" + i + "].ancora", "A âncora “" + c.ancora + "” não é o id da manchete nem de uma matéria.",
            "Dica: use um destes ids: " + idsDeAncora.join(", ") + ".");
        }
      }
    }
    return p;
  }

  function validarClassificar(p, c, cc) {
    exigeTexto(p, c, "instrucao", cc);
    exigeTexto(p, c, "fecho", cc);
    var tiposConhecidos = [];
    var i;
    if (!ehLista(c.tipos)) {
      p.add(cc + ".tipos", "Falta a lista “tipos”.",
        "Dica: tipos: [ { id, nome }, … ] — exatamente 4 tipos de pergunta.");
    } else {
      if (c.tipos.length !== 4) {
        p.add(cc + ".tipos", "A lista “tipos” precisa ter exatamente 4 tipos, e tem " + c.tipos.length + ".",
          "Dica: os quatro tipos de pergunta: existência, associação, previsão e causa.");
      }
      for (i = 0; i < c.tipos.length; i++) {
        var ct = cc + ".tipos[" + i + "]";
        if (!ehObjeto(c.tipos[i])) {
          p.add(ct, "Este tipo precisa ser um bloco { id, nome }.", "Dica: { id: \"causa\", nome: \"Causa\" }.");
          continue;
        }
        exigeTexto(p, c.tipos[i], "id", ct);
        exigeTexto(p, c.tipos[i], "nome", ct);
        if (ehTexto(c.tipos[i].id)) { tiposConhecidos.push(c.tipos[i].id); }
      }
    }
    if (!ehLista(c.perguntas)) {
      p.add(cc + ".perguntas", "Falta a lista “perguntas”.",
        "Dica: perguntas: [ { texto, tipo, explicacao } ] — de 5 a 6 perguntas.");
      return;
    }
    if (c.perguntas.length < 5 || c.perguntas.length > 6) {
      p.add(cc + ".perguntas", "A lista “perguntas” precisa ter de 5 a 6 perguntas, e tem " + c.perguntas.length + ".",
        "Dica: acrescente ou tire perguntas até ficar entre 5 e 6.");
    }
    for (i = 0; i < c.perguntas.length; i++) {
      var cp = cc + ".perguntas[" + i + "]";
      var q = c.perguntas[i];
      if (!ehObjeto(q)) {
        p.add(cp, "Esta pergunta precisa ser um bloco { texto, tipo, explicacao }.",
          "Dica: confira as chaves { } e as vírgulas.");
        continue;
      }
      exigeTexto(p, q, "texto", cp);
      exigeTexto(p, q, "explicacao", cp, "Dica: explique por que a resposta é essa.");
      if (!ehTexto(q.tipo)) {
        p.add(cp + ".tipo", "Falta o campo “tipo” da pergunta.",
          "Dica: o tipo é um dos ids de tipos: " + tiposConhecidos.join(", ") + ".");
      } else if (tiposConhecidos.length && tiposConhecidos.indexOf(q.tipo) === -1) {
        p.add(cp + ".tipo", "O tipo “" + q.tipo + "” não está na lista de tipos desta caixa.",
          "Dica: use um destes: " + tiposConhecidos.join(", ") + " (sem acento).");
      }
    }
  }

  function validarRevelar(p, c, cc) {
    exigeTexto(p, c, "variavel_escondida", cc);
    exigeTexto(p, c, "botao", cc, "Dica: é o texto escrito no botão. Exemplo: \"Revelar a terceira variável\".");
    exigeTexto(p, c, "explicacao", cc);
    if (!ehLista(c.variaveis) || c.variaveis.length !== 2
        || !ehTexto(c.variaveis[0]) || !ehTexto(c.variaveis[1])) {
      p.add(cc + ".variaveis", "O campo “variaveis” precisa ser uma lista com exatamente 2 textos.",
        "Dica: variaveis: [ \"Consumo de sorvete\", \"Afogamentos nas praias\" ].");
    }
    ["antes", "revelacao"].forEach(function (chave) {
      if (!ehObjeto(c[chave])) {
        p.add(cc + "." + chave, "Falta o bloco “" + chave + "”.",
          "Dica: " + chave + ": { titulo: \"…\", texto: \"…\" }.");
        return;
      }
      exigeTexto(p, c[chave], "titulo", cc + "." + chave);
      exigeTexto(p, c[chave], "texto", cc + "." + chave);
    });
  }

  function validarComparar(p, c, cc) {
    exigeTexto(p, c, "introducao", cc);
    if (!ehLista(c.caminhos)) {
      p.add(cc + ".caminhos", "Falta a lista “caminhos”.",
        "Dica: caminhos: [ { id, nome, exemplo, ganha, perde } ] — exatamente 3.");
      return;
    }
    if (c.caminhos.length !== 3) {
      p.add(cc + ".caminhos", "A lista “caminhos” precisa ter exatamente 3 caminhos, e tem " + c.caminhos.length + ".",
        "Dica: observar, experimentar e perguntar.");
    }
    var i;
    for (i = 0; i < c.caminhos.length; i++) {
      var ck = cc + ".caminhos[" + i + "]";
      if (!ehObjeto(c.caminhos[i])) {
        p.add(ck, "Este caminho precisa ser um bloco { id, nome, exemplo, ganha, perde }.",
          "Dica: confira as chaves { } e as vírgulas.");
        continue;
      }
      exigeTexto(p, c.caminhos[i], "id", ck, "Dica: o id costuma ser observar, experimentar ou perguntar.");
      exigeTexto(p, c.caminhos[i], "nome", ck);
      exigeTexto(p, c.caminhos[i], "exemplo", ck);
      exigeTexto(p, c.caminhos[i], "ganha", ck);
      exigeTexto(p, c.caminhos[i], "perde", ck);
    }
  }

  // ===================================================================
  // 6. O AVISO DE ERRO (nunca página em branco)
  // ===================================================================

  /**
   * Monta div.aviso-erro e põe como PRIMEIRO filho de .jornal
   * (ou do <body>, se a folha não existir).
   */
  function mostrarErro(itens) {
    var aviso = el("div", "aviso-erro");
    aviso.setAttribute("role", "alert");

    var marca = el("div", "aviso-erro__marca", "!");
    marca.setAttribute("aria-hidden", "true");
    aviso.appendChild(marca);

    var conteudo = el("div", "aviso-erro__conteudo");
    conteudo.appendChild(el("p", "rotulo aviso-erro__rotulo", "Erro na edição"));
    conteudo.appendChild(el("h2", "aviso-erro__titulo", "Esta edição não pôde ser montada"));

    var texto = el("p", "aviso-erro__texto", "O arquivo ");
    texto.appendChild(el("code", null, "edicao.js"));
    texto.appendChild(document.createTextNode(
      " tem problemas. Corrija o que está listado abaixo, salve o arquivo e recarregue a página."));
    conteudo.appendChild(texto);

    var ul = el("ul", "aviso-erro__lista");
    var i;
    for (i = 0; i < itens.length; i++) {
      var li = el("li", "aviso-erro__item");
      if (itens[i].caminho) {
        li.appendChild(el("code", null, itens[i].caminho));
        li.appendChild(document.createTextNode(" "));
      }
      li.appendChild(document.createTextNode(itens[i].texto));
      if (itens[i].dica) {
        li.appendChild(el("span", "aviso-erro__dica", itens[i].dica));
      }
      ul.appendChild(li);
    }
    conteudo.appendChild(ul);
    aviso.appendChild(conteudo);

    var folha = document.querySelector(".jornal") || document.body;
    if (folha.firstChild) { folha.insertBefore(aviso, folha.firstChild); }
    else { folha.appendChild(aviso); }
    return aviso;
  }

  // O <script> inline do <head> do index.html guarda aqui os erros de
  // sintaxe de edicao.js (que impedem window.EDICAO de existir).
  //
  // Sobre o número da linha: quando a página é aberta por duplo clique
  // (file://), Chrome e Edge escondem o arquivo e a linha do erro por
  // política de segurança, e mandam só "Script error.". O Firefox informa
  // a linha. Por isso a mensagem tem duas formas: com a linha, quando o
  // navegador conta; e sem ela, com o caminho para descobrir, quando não.
  function erroDeSintaxe() {
    var e = window.__JORNAL_ERRO_DE_SCRIPT__;
    if (!e) { return null; }
    var arquivo = e.arquivo || "edicao.js";
    var dicaComum = "Dica: quase sempre é uma vírgula a mais, uma vírgula a menos, uma chave { } "
      + "ou um colchete [ ] sem par, ou uma aspa dupla \" dentro do texto. "
      + "Dentro do texto, use aspas curvas “ ”.";

    if (e.linha) {
      return {
        caminho: arquivo + ", perto da linha " + e.linha,
        texto: "Há um erro de sintaxe perto da linha " + e.linha + " de " + arquivo
          + ": confira vírgulas e aspas."
          + (e.mensagem ? " O navegador disse: " + e.mensagem : ""),
        dica: dicaComum
      };
    }
    return {
      caminho: arquivo,
      texto: "Há um erro de sintaxe em " + arquivo + ": confira vírgulas e aspas. "
        + "Neste navegador, a linha do erro não é informada quando a página é aberta por duplo clique.",
      dica: dicaComum + " Para ver a linha: abra a página no Firefox, ou aperte F12 e olhe a aba Console."
    };
  }

  // ===================================================================
  // 7. MONTAGEM DA PÁGINA
  // ===================================================================

  /** Índice id → nome curto, para a linha de fontes e as chamadas. */
  function mapaDeNomesCurtos(edicao) {
    var curtos = {};
    function registrar(lista) {
      var i;
      if (!ehLista(lista)) { return; }
      for (i = 0; i < lista.length; i++) {
        if (ehObjeto(lista[i]) && ehTexto(lista[i].id)) {
          curtos[lista[i].id] = nomeCurto(lista[i]);
        }
      }
    }
    registrar(edicao.fontes_da_disciplina);
    registrar(edicao.fontes_complementares);
    registrar(edicao.para_ir_alem);
    return curtos;
  }

  /** Cabeçalho do jornal. */
  function cabecalho(J) {
    var cab = el("header", "jornal__cabecalho");
    var h1 = el("h1", "jornal__nome", J.nome);
    cab.appendChild(h1);
    cab.appendChild(el("p", "jornal__lema", J.lema));
    var faixa = el("div", "jornal__faixa");
    faixa.appendChild(el("p", "jornal__numero", "Edição nº " + J.numero));
    faixa.appendChild(el("p", "jornal__data", J.data));
    if (J.local) { faixa.appendChild(el("p", "jornal__local", J.local)); }
    cab.appendChild(faixa);
    return cab;
  }

  /** Rodapé com o expediente. */
  function rodape(X) {
    var pe = el("footer", "jornal__rodape");
    var h2 = el("h2", "rotulo expediente__titulo", "Expediente");
    pe.appendChild(h2);
    var dl = el("dl", "expediente__lista");
    var campos = [
      ["Autoria", X.autoria],
      ["Disciplina", X.disciplina],
      ["Instituição", X.instituicao],
      ["Docente", X.docente]
    ];
    var i, div;
    for (i = 0; i < campos.length; i++) {
      div = el("div");
      div.appendChild(el("dt", "rotulo", campos[i][0]));
      div.appendChild(el("dd", null, campos[i][1]));
      dl.appendChild(div);
    }
    pe.appendChild(dl);
    pe.appendChild(el("p", "expediente__origem", X.origem));
    pe.appendChild(el("p", "expediente__nota", X.licenca));
    return pe;
  }

  /**
   * Ordem e largura dos blocos, a partir do campo "ancora" de cada caixa
   * (regra da T3 §3, item 10):
   *   - manchete, e logo depois a caixa "revelar" ancorada nela;
   *   - cada matéria, na ordem; matéria com "classificar" fica com meia
   *     largura e a caixa entra ao lado; matéria com "destaque" fica com
   *     dois terços e as destaques vão num .trilho ao lado;
   *   - a caixa "comparar" entra em faixa de largura total logo depois
   *     da matéria a que se ancora.
   * As classes .largura--* vão nos FILHOS DIRETOS de .jornal__corpo
   * (o CSS usa .jornal__corpo > .largura--x). O .trilho também é filho direto.
   */
  function montarCorpo(edicao, curtos) {
    var corpo = el("main", "jornal__corpo");
    corpo.id = "conteudo";
    var caixas = edicao.caixas;
    var i, n, c;

    corpo.appendChild(manchete(edicao.manchete, curtos));
    for (i = 0; i < caixas.length; i++) {
      c = caixas[i];
      if (c.ancora === edicao.manchete.id && c.tipo === "revelar") {
        corpo.appendChild(caixaRevelar(c, curtos));
      }
    }

    for (n = 0; n < edicao.materias.length; n++) {
      var m = edicao.materias[n];
      var dela = [];
      for (i = 0; i < caixas.length; i++) {
        if (caixas[i].ancora === m.id) { dela.push(caixas[i]); }
      }
      var temClassificar = false;
      var destaques = [];
      for (i = 0; i < dela.length; i++) {
        if (dela[i].tipo === "classificar") { temClassificar = true; }
        if (dela[i].tipo === "destaque") { destaques.push(dela[i]); }
      }
      var largura = temClassificar ? " largura--metade" : (destaques.length ? " largura--dois-tercos" : "");
      var extra = largura + (n === 1 ? " materia--capitular" : "");
      corpo.appendChild(materia(m, extra, curtos));

      for (i = 0; i < dela.length; i++) {
        if (dela[i].tipo === "classificar") { corpo.appendChild(caixaClassificar(dela[i], curtos)); }
      }
      if (destaques.length) {
        var trilho = el("div", "trilho");
        for (i = 0; i < destaques.length; i++) { trilho.appendChild(caixaDestaque(destaques[i], curtos)); }
        corpo.appendChild(trilho);
      }
      for (i = 0; i < dela.length; i++) {
        if (dela[i].tipo === "comparar") { corpo.appendChild(caixaComparar(dela[i], curtos)); }
      }
    }

    corpo.appendChild(editorial(edicao.editorial, curtos));
    corpo.appendChild(paraIrAlem(edicao.para_ir_alem, curtos));
    corpo.appendChild(referencias(edicao));
    return corpo;
  }

  /** Monta a página inteira dentro de div.jornal. */
  function montar(edicao) {
    var curtos = mapaDeNomesCurtos(edicao);
    var folha = document.querySelector(".jornal");
    var avisoModelo = el("p", "jornal__aviso-modelo", edicao.aviso_modelo);
    avisoModelo.setAttribute("role", "note");
    folha.appendChild(avisoModelo);
    folha.appendChild(cabecalho(edicao.jornal));
    folha.appendChild(montarCorpo(edicao, curtos));
    folha.appendChild(rodape(edicao.expediente));
    document.title = edicao.jornal.nome + " — Edição nº " + edicao.jornal.numero;
  }

  // ===================================================================
  // 8. PARTIDA
  // ===================================================================

  function partir() {
    var itens = [];
    var sintaxe = erroDeSintaxe();
    if (sintaxe) { itens.push(sintaxe); }

    if (!window.EDICAO) {
      if (!sintaxe) {
        itens.push({
          caminho: "edicao.js",
          texto: "O arquivo edicao.js não foi carregado ou não definiu o conteúdo da edição.",
          dica: "Dica: confira se o arquivo edicao.js está na mesma pasta do index.html e se ele começa com "
            + "window.EDICAO = { … };"
        });
      }
      mostrarErro(itens);
      return;
    }

    var problemas = validar(window.EDICAO);
    if (sintaxe || problemas.temAlgum()) {
      mostrarErro(itens.concat(problemas.itens));
      return;
    }

    // Tudo certo: monta. Se algo inesperado explodir aqui, o leitor
    // ainda vê uma mensagem em português em vez de uma página em branco.
    try {
      montar(window.EDICAO);
    } catch (e) {
      mostrarErro([{
        caminho: "edicao.js",
        texto: "A edição passou na conferência, mas a página não pôde ser montada: " + (e && e.message ? e.message : e),
        dica: "Dica: desfaça a última mudança em edicao.js e recarregue a página."
      }]);
      return;
    }

    // Só agora a página vira "com JavaScript": até aqui, tudo o que o
    // CSS mostra é o estado resolvido (que é o certo sem JS e no papel).
    document.documentElement.className += (document.documentElement.className ? " " : "") + "com-js";

    // A T5 (js/interacoes.js) escuta este evento para ligar I1, I2 e I3.
    document.dispatchEvent(new CustomEvent("jornal:montado", { detail: { edicao: window.EDICAO } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", partir);
  } else {
    partir();
  }
})();
