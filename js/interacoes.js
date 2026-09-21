/* =====================================================================
   TODO MUNDO ACHA — interações (I1, I2, I3)
   Script CLÁSSICO (sem import/export), dentro de uma IIFE. Licença MIT.

   O que este arquivo faz e o que NÃO faz
   --------------------------------------
   Faz: liga o comportamento das três caixas interativas que o motor
   (js/jornal.js) já montou no DOM.
     I1  .caixa--classificar  Classifique a pergunta
     I2  .caixa--revelar      A variável escondida
     I3  .caixa--comparar     Três caminhos, lado a lado

   NÃO faz: não monta página, não lê window.EDICAO, não inventa texto.
   Todo texto sai do DOM já montado (atributos data-* ou conteúdo existente).
   A única frase escrita aqui é o rótulo do botão de responder do I1, e ela
   pode ser trocada pelo motor via data-rotulo-responder (ver §1).

   Regras duras respeitadas
     - Nada de innerHTML / outerHTML / insertAdjacentHTML / document.write /
       eval / new Function. Só textContent e createElement.
     - Zero requisição externa, zero biblioteca.
     - Não move o foco ao dar feedback (WCAG 4.1.3): o texto entra em
       role="status" e o leitor de tela anuncia sozinho.
     - Nada de outline: none. O foco visível é do CSS (:focus-visible).
     - NADA para impressão. O @media print do CSS já mostra tudo resolvido;
       não existe beforeprint aqui. Ver §5.

   Quando inicializa
     - no evento 'jornal:montado' disparado pelo motor (T4);
     - ou na hora, se o DOM já estiver montado quando o script carregar.
     Inicializar duas vezes é inofensivo: cada caixa carrega a marca
     data-t5-ligado e é ignorada na segunda passagem.
     Se uma das três caixas não existir, as outras duas funcionam.
   ===================================================================== */

(function () {
  "use strict";

  /* -------------------------------------------------------------------
     0. Utilidades mínimas
     ------------------------------------------------------------------- */

  /* Escreve texto simples, apagando o que havia. Sem innerHTML. */
  function porTexto(no, texto) {
    no.textContent = texto == null ? "" : String(texto);
  }

  /* Escreve "<b>rotulo</b> resto" sem innerHTML: dois nós, um <b> e um texto.
     Usado no feedback do I1 e no placar, que a T3 desenhou com <b>. */
  function porTextoComRotulo(no, rotulo, resto) {
    no.textContent = "";
    if (rotulo) {
      var forte = document.createElement("b");
      forte.textContent = rotulo;
      no.appendChild(forte);
    }
    if (resto) {
      no.appendChild(document.createTextNode(resto));
    }
  }

  /* Lê um texto do DOM por atributo data-*, com alternativa. Nunca inventa. */
  function dado(elemento, nome, alternativa) {
    if (!elemento) { return alternativa; }
    var v = elemento.getAttribute(nome);
    return (v === null || v === "") ? alternativa : v;
  }

  function lista(raiz, seletor) {
    return Array.prototype.slice.call(raiz.querySelectorAll(seletor));
  }

  /* Marca a caixa como já ligada; devolve false se já estava. */
  function marcarLigado(caixa) {
    if (caixa.getAttribute("data-t5-ligado") === "sim") { return false; }
    caixa.setAttribute("data-t5-ligado", "sim");
    return true;
  }

  /* -------------------------------------------------------------------
     1. I1 — Classifique a pergunta
     -------------------------------------------------------------------
     DECISÃO (registrada em relatorios/T5.md): cada pergunta ganha um botão
     "Responder". Rádio nativo muda a seleção com as setas do teclado; se o
     feedback saísse na mudança de seleção, quem navega por teclado
     descobriria a resposta certa só de atravessar o grupo. O botão separa
     escolher de confirmar, e vale igual para mouse e teclado.

     Estado depois de responder (contrato da T3, §4.1):
       fieldset.pergunta  data-estado = "certa" | "errada"
       .opcao             .opcao--selecionada / --correta / --incorreta
                          (a correta recebe --correta mesmo se não foi a escolhida)
       .opcao__estado     "Correta" / "Incorreta"     ← texto, não só cor
       .pergunta__feedback[role=status]  "Correto. É uma pergunta de X." /
                          "Ainda não. Você marcou X; esta pergunta é de Y."
       .placar[role=status] + .ponto--certo / --errado
       botão "Recomeçar" deixa de estar disabled

     O texto dos tipos ("Associação") sai do próprio DOM: do .opcao__texto
     da opção cujo value é o tipo. Nada é escrito em código.
     ------------------------------------------------------------------- */

  /* Único texto introduzido por este arquivo. O motor pode substituí-lo
     pondo data-rotulo-responder na .caixa--classificar. */
  var ROTULO_RESPONDER = "Responder";

  function ligarClassificar(caixa) {
    if (!marcarLigado(caixa)) { return; }

    var rotuloResponder = dado(caixa, "data-rotulo-responder", ROTULO_RESPONDER);
    var perguntas = lista(caixa, ".pergunta");
    if (!perguntas.length) { return; }

    var placar = caixa.querySelector(".placar");
    var placarTexto = placar ? placar.querySelector(".placar__texto") : null;
    var pontos = placar ? lista(placar, ".ponto") : [];
    var recomecar = placar ? placar.querySelector(".botao--secundario") : null;

    /* Guarda o texto inicial do placar para poder voltar a ele em "Recomeçar"
       sem inventar frase nova. */
    var placarInicial = null;
    if (placarTexto) {
      placarInicial = {
        antes: "",
        forte: "",
        depois: ""
      };
      var forteInicial = placarTexto.querySelector("b");
      if (forteInicial) {
        placarInicial.forte = forteInicial.textContent;
        var partes = placarTexto.textContent.split(placarInicial.forte);
        placarInicial.antes = partes[0] || "";
        placarInicial.depois = partes.length > 1 ? partes.slice(1).join(placarInicial.forte) : "";
      } else {
        placarInicial.antes = placarTexto.textContent;
      }
    }

    var itens = [];

    perguntas.forEach(function (fieldset, indice) {
      var opcoes = lista(fieldset, ".opcao");
      if (!opcoes.length) { return; }

      var feedback = fieldset.querySelector(".pergunta__feedback");
      var resolucao = fieldset.querySelector(".pergunta__resolucao");

      /* O tipo certo vem do texto já impresso em .pergunta__tipo
         ("Tipo: associação") — comparado contra o value de cada opção.
         Estratégia sem adivinhação: o motor pode declarar data-tipo no
         fieldset; sem isso, deduzimos do .pergunta__tipo casando o value
         das opções com o texto (que a T6 escreve acentuado e minúsculo). */
      var tipoCerto = fieldset.getAttribute("data-tipo");
      if (!tipoCerto) {
        tipoCerto = deduzirTipoCerto(fieldset, opcoes);
      }
      if (!tipoCerto) { return; }   /* sem gabarito no DOM, deixa estático */

      var area = fieldset.querySelector(".pergunta__opcoes");
      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "botao pergunta__responder";
      porTexto(botao, rotuloResponder);
      /* aria-disabled, e NÃO o atributo disabled: um botão com `disabled`
         sai da ordem de tabulação, e desabilitá-lo enquanto ele tem o foco
         joga o foco no <body> — o leitor de teclado se perde. Com
         aria-disabled o botão continua focável e anunciado como
         indisponível; o clique é ignorado no próprio tratador.
         O CSS já estiliza .botao[aria-disabled="true"] igual a [disabled]. */
      botao.setAttribute("aria-disabled", "true");
      /* O botão entra depois das opções e antes do feedback. */
      if (area && area.parentNode) {
        area.parentNode.insertBefore(botao, area.nextSibling);
      } else {
        fieldset.appendChild(botao);
      }

      var item = {
        fieldset: fieldset,
        opcoes: opcoes,
        feedback: feedback,
        resolucao: resolucao,
        botao: botao,
        tipoCerto: tipoCerto,
        indice: indice,
        respondida: false,
        acertou: false
      };
      itens.push(item);

      /* Habilita o botão assim que houver escolha; nenhum feedback aqui. */
      opcoes.forEach(function (opcao) {
        var campo = opcao.querySelector(".opcao__campo");
        if (!campo) { return; }
        campo.addEventListener("change", function () {
          if (item.respondida) {
            /* Já respondida: a resposta não muda mais. Devolve a marca à
               opção que o leitor escolheu, sem mexer no foco. */
            item.opcoes.forEach(function (outra) {
              var c = outra.querySelector(".opcao__campo");
              if (c) { c.checked = outra.classList.contains("opcao--selecionada"); }
            });
            return;
          }
          botao.setAttribute("aria-disabled", "false");
          opcoes.forEach(function (outra) {
            outra.classList.toggle("opcao--selecionada", outra === opcao);
          });
        });
      });

      botao.addEventListener("click", function () {
        if (botao.getAttribute("aria-disabled") === "true") { return; }
        responder(item);
      });
    });

    if (!itens.length) { return; }

    /* Deduz o tipo certo comparando o value de cada opção com o texto de
       .pergunta__tipo. Só usa o que já está escrito na página. */
    function deduzirTipoCerto(fieldset, opcoes) {
      var alvo = fieldset.querySelector(".pergunta__tipo");
      if (!alvo) { return null; }
      var texto = normalizar(alvo.textContent);
      var achado = null;
      opcoes.forEach(function (opcao) {
        var campo = opcao.querySelector(".opcao__campo");
        var rotulo = opcao.querySelector(".opcao__texto");
        if (!campo || !rotulo) { return; }
        var nome = normalizar(rotulo.textContent);
        var valor = normalizar(campo.value);
        /* "Tipo: associação" contém "associacao" depois de normalizar. */
        if (nome && texto.indexOf(nome) !== -1) { achado = campo.value; }
        else if (valor && texto.indexOf(valor) !== -1 && !achado) { achado = campo.value; }
      });
      return achado;
    }

    /* minúsculas sem acento, para comparar "Associação" com "associacao". */
    function normalizar(texto) {
      if (!texto) { return ""; }
      var s = String(texto).toLowerCase();
      if (String.prototype.normalize) {
        s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
      }
      return s.trim();
    }

    /* Nome legível de um tipo, lido do .opcao__texto da própria pergunta. */
    function nomeDoTipo(item, valor) {
      var nome = null;
      item.opcoes.forEach(function (opcao) {
        var campo = opcao.querySelector(".opcao__campo");
        var rotulo = opcao.querySelector(".opcao__texto");
        if (campo && rotulo && campo.value === valor) { nome = rotulo.textContent; }
      });
      return nome;
    }

    function responder(item) {
      if (item.respondida) { return; }
      var escolhida = null;
      item.opcoes.forEach(function (opcao) {
        var campo = opcao.querySelector(".opcao__campo");
        if (campo && campo.checked) { escolhida = { opcao: opcao, valor: campo.value }; }
      });
      if (!escolhida) { return; }

      item.respondida = true;
      item.acertou = escolhida.valor === item.tipoCerto;

      item.fieldset.setAttribute("data-estado", item.acertou ? "certa" : "errada");

      /* Marca as opções e escreve a palavra em .opcao__estado.
         O estado não é só cor: há texto e forma (CSS desenha ✓ e ×). */
      item.opcoes.forEach(function (opcao) {
        var campo = opcao.querySelector(".opcao__campo");
        var marcaEstado = opcao.querySelector(".opcao__estado");
        if (!campo) { return; }
        var ehCorreta = campo.value === item.tipoCerto;
        var foiEscolhida = opcao === escolhida.opcao;

        opcao.classList.toggle("opcao--selecionada", foiEscolhida);
        opcao.classList.toggle("opcao--correta", ehCorreta);
        opcao.classList.toggle("opcao--incorreta", foiEscolhida && !ehCorreta);

        if (marcaEstado) {
          if (ehCorreta) { porTexto(marcaEstado, PALAVRA_CORRETA); }
          else if (foiEscolhida) { porTexto(marcaEstado, PALAVRA_INCORRETA); }
          else { porTexto(marcaEstado, ""); }
        }

        /* Trava o grupo: depois de responder não se muda a resposta.
           NÃO usamos `disabled` — desabilitar o rádio que tem o foco jogaria
           o foco no <body>, e o grupo sumiria da ordem de tabulação, tirando
           do leitor de teclado a chance de reler as opções marcadas.
           Marcamos aria-disabled (anunciado) e revertemos qualquer mudança
           no tratador de change abaixo. */
        campo.setAttribute("aria-disabled", "true");
      });

      /* Feedback em role="status": o leitor de tela anuncia sem que o foco
         se mexa. Nenhum .focus() aqui, de propósito (WCAG 4.1.3). */
      if (item.feedback) {
        var nomeCerto = nomeDoTipo(item, item.tipoCerto);
        if (item.acertou) {
          porTextoComRotulo(item.feedback, FEEDBACK_CERTO,
            " É uma pergunta de " + minuscula(nomeCerto) + ".");
        } else {
          var nomeMarcado = nomeDoTipo(item, escolhida.valor);
          porTextoComRotulo(item.feedback, FEEDBACK_ERRADO,
            " Você marcou " + minuscula(nomeMarcado) +
            "; esta pergunta é de " + minuscula(nomeCerto) + ".");
        }
      }

      /* A resolução (tipo + explicação) já está no DOM; o CSS a esconde só
         enquanto data-estado="repouso". Mudar o estado já a revela. */

      /* O botão fica onde está, focável e marcado como indisponível: quem
         acabou de apertá-lo por teclado continua com o foco nele. Escondê-lo
         ou usar `disabled` jogaria o foco no <body>. */
      item.botao.setAttribute("aria-disabled", "true");

      atualizarPlacar();
    }

    function minuscula(texto) {
      if (!texto) { return ""; }
      var s = String(texto);
      return s.charAt(0).toLowerCase() + s.slice(1);
    }

    function atualizarPlacar() {
      var respondidas = 0;
      var acertos = 0;
      itens.forEach(function (item) {
        if (item.respondida) {
          respondidas += 1;
          if (item.acertou) { acertos += 1; }
        }
      });

      pontos.forEach(function (ponto, i) {
        var item = itens[i];
        ponto.classList.remove("ponto--certo", "ponto--errado");
        if (item && item.respondida) {
          ponto.classList.add(item.acertou ? "ponto--certo" : "ponto--errado");
        }
      });

      if (placarTexto) {
        if (respondidas === 0 && placarInicial) {
          /* Volta exatamente à frase que a T4 montou. */
          placarTexto.textContent = "";
          if (placarInicial.antes) {
            placarTexto.appendChild(document.createTextNode(placarInicial.antes));
          }
          if (placarInicial.forte) {
            var f = document.createElement("b");
            f.textContent = String(itens.length);
            placarTexto.appendChild(f);
          }
          if (placarInicial.depois) {
            placarTexto.appendChild(document.createTextNode(placarInicial.depois));
          }
        } else {
          escreverPlacarParcial(acertos, respondidas);
        }
      }

      if (recomecar) { recomecar.disabled = respondidas === 0; }
    }

    /* "Você acertou <b>4</b> de <b>5</b>." — a forma que a T3 desenhou na
       galeria de estados. O fecho ("Muito bem.") só entra quando todas
       foram respondidas, e é o texto que a galeria já usa. */
    function escreverPlacarParcial(acertos, respondidas) {
      placarTexto.textContent = "";
      placarTexto.appendChild(document.createTextNode(PLACAR_ABRE));
      var a = document.createElement("b");
      a.textContent = String(acertos);
      placarTexto.appendChild(a);
      placarTexto.appendChild(document.createTextNode(PLACAR_DE));
      var b = document.createElement("b");
      b.textContent = String(itens.length);
      placarTexto.appendChild(b);
      placarTexto.appendChild(document.createTextNode("."));
      /* "Muito bem." só quando todas foram respondidas E a maioria está
         certa. Elogiar 1 de 5 soa falso e tira o sentido do placar. Abaixo
         disso o placar fala só o número — e quem quiser tentar de novo tem
         o "Recomeçar" ao lado. */
      if (respondidas === itens.length && PLACAR_FECHO &&
          acertos * 2 > itens.length) {
        placarTexto.appendChild(document.createTextNode(" " + PLACAR_FECHO));
      }
    }

    if (recomecar) {
      recomecar.addEventListener("click", function () {
        itens.forEach(function (item) {
          item.respondida = false;
          item.acertou = false;
          item.fieldset.setAttribute("data-estado", "repouso");
          item.opcoes.forEach(function (opcao) {
            opcao.classList.remove("opcao--selecionada", "opcao--correta", "opcao--incorreta");
            var campo = opcao.querySelector(".opcao__campo");
            var marcaEstado = opcao.querySelector(".opcao__estado");
            if (campo) { campo.removeAttribute("aria-disabled"); campo.checked = false; }
            if (marcaEstado) { porTexto(marcaEstado, ""); }
          });
          if (item.feedback) { porTexto(item.feedback, ""); }
          item.botao.setAttribute("aria-disabled", "true");
        });
        atualizarPlacar();
        /* Mover o foco aqui É intencional e correto: o leitor acabou de
           acionar "Recomeçar" e o botão fica desabilitado; sem isso o foco
           cairia no <body>. Vai para a primeira pergunta, que é o início
           lógico da tarefa. WCAG 2.4.3. */
        var primeiroCampo = itens[0].opcoes[0].querySelector(".opcao__campo");
        if (primeiroCampo && typeof primeiroCampo.focus === "function") {
          primeiroCampo.focus();
        }
      });
    }

    /* Estado inicial coerente: repouso, botões desabilitados, placar zerado. */
    itens.forEach(function (item) {
      item.fieldset.setAttribute("data-estado", "repouso");
    });
    atualizarPlacar();
  }

  /* Palavras de estado e de feedback. Todas já existem no vocabulário da T3
     (prototipo-visual/estados.html) — não são invenção deste arquivo.
     O motor pode sobrescrevê-las por data-* na .caixa--classificar. */
  var PALAVRA_CORRETA = "Correta";
  var PALAVRA_INCORRETA = "Incorreta";
  var FEEDBACK_CERTO = "Correto.";
  var FEEDBACK_ERRADO = "Ainda não.";
  var PLACAR_ABRE = "Você acertou ";
  var PLACAR_DE = " de ";
  var PLACAR_FECHO = "Muito bem.";

  /* -------------------------------------------------------------------
     2. I2 — A variável escondida
     -------------------------------------------------------------------
     Alterna .esta-revelado na .caixa--revelar e aria-expanded no botão, e
     troca o texto do botão. A animação do surgir é do CSS e só existe fora
     de prefers-reduced-motion: reduce — nada de animação em JS.

     O rótulo do estado aberto vem do DOM:
       1º  data-rotulo-esconder no botão (o motor pode declarar);
       2º  senão, troca só a primeira palavra do rótulo atual pelo par que a
           T3 já usa na galeria: "Revelar …" → "Esconder …".
     Se nada disso valer, o rótulo fica como está (nunca vira inglês nem
     frase inventada).
     ------------------------------------------------------------------- */

  var VERBO_REVELAR = "Revelar";
  var VERBO_ESCONDER = "Esconder";

  function ligarRevelar(caixa) {
    if (!marcarLigado(caixa)) { return; }

    var botao = caixa.querySelector(".botao--revelar");
    if (!botao) { return; }

    var rotuloFechado = botao.textContent;
    var rotuloAberto = dado(botao, "data-rotulo-esconder", null);
    if (!rotuloAberto && rotuloFechado.indexOf(VERBO_REVELAR) === 0) {
      rotuloAberto = VERBO_ESCONDER + rotuloFechado.slice(VERBO_REVELAR.length);
    }

    /* Repouso coerente, caso o motor não tenha posto os atributos. */
    caixa.classList.remove("esta-revelado");
    botao.setAttribute("aria-expanded", "false");

    botao.addEventListener("click", function () {
      var revelado = caixa.classList.toggle("esta-revelado");
      botao.setAttribute("aria-expanded", revelado ? "true" : "false");
      if (rotuloAberto) {
        porTexto(botao, revelado ? rotuloAberto : rotuloFechado);
      }
      /* Sem .focus(): o foco fica no próprio botão, que continua na tela.
         A resposta que surge é logo abaixo e está ligada por aria-controls. */
    });
  }

  /* -------------------------------------------------------------------
     3. I3 — Três caminhos (abas WAI-ARIA)
     -------------------------------------------------------------------
     Padrão de abas com ativação automática:
       Tab entra no tablist por uma única aba (tabindex roving: a ativa em 0,
       as outras em -1) e sai para o painel;
       ← e → andam entre as abas e já trocam o painel;
       Home e End vão para a primeira e a última;
       Enter e Espaço são o clique nativo do <button>.
     aria-selected marca a aba; .esta-ativo marca o .caminho.
     ------------------------------------------------------------------- */

  function ligarComparar(caixa) {
    if (!marcarLigado(caixa)) { return; }

    var tablist = caixa.querySelector('[role="tablist"]');
    if (!tablist) { return; }
    var abas = lista(tablist, '[role="tab"]');
    var paineis = lista(caixa, '[role="tabpanel"]');
    if (abas.length < 2 || !paineis.length) { return; }

    function painelDe(aba) {
      var id = aba.getAttribute("aria-controls");
      if (!id) { return null; }
      return document.getElementById(id);
    }

    function selecionar(indice, moverFoco) {
      if (indice < 0) { indice = abas.length - 1; }
      if (indice >= abas.length) { indice = 0; }

      abas.forEach(function (aba, i) {
        var ativa = i === indice;
        aba.setAttribute("aria-selected", ativa ? "true" : "false");
        aba.setAttribute("tabindex", ativa ? "0" : "-1");
        var painel = painelDe(aba);
        if (painel) { painel.classList.toggle("esta-ativo", ativa); }
      });

      /* .caminho sem aba correspondente (se houver) fica fora do ativo. */
      paineis.forEach(function (painel) {
        var ligado = false;
        abas.forEach(function (aba) { if (painelDe(aba) === painel) { ligado = true; } });
        if (!ligado) { painel.classList.remove("esta-ativo"); }
      });

      var painelAtivo = painelDe(abas[indice]);
      if (painelAtivo) {
        var id = painelAtivo.getAttribute("id");
        /* Informativo, como a T3 previu em data-caminho-ativo. */
        var marca = abas[indice].getAttribute("id");
        if (id && marca) { caixa.setAttribute("data-caminho-ativo", deduzirNome(abas[indice])); }
      }

      if (moverFoco) { abas[indice].focus(); }
      return indice;
    }

    /* "…-aba-observar" → "observar"; se não casar, usa a classe metodo--X. */
    function deduzirNome(aba) {
      var id = aba.getAttribute("id") || "";
      var corte = id.lastIndexOf("-aba-");
      if (corte !== -1) { return id.slice(corte + 5); }
      var classes = (aba.className || "").split(/\s+/);
      for (var i = 0; i < classes.length; i += 1) {
        if (classes[i].indexOf("metodo--") === 0) { return classes[i].slice(8); }
      }
      return "";
    }

    var atual = 0;
    abas.forEach(function (aba, i) {
      if (aba.getAttribute("aria-selected") === "true") { atual = i; }
    });
    atual = selecionar(atual, false);

    abas.forEach(function (aba, i) {
      aba.addEventListener("click", function () {
        atual = selecionar(i, false);
      });

      aba.addEventListener("keydown", function (evento) {
        var destino = null;
        switch (evento.key) {
          case "ArrowRight":
          case "Right":
            destino = atual + 1;
            break;
          case "ArrowLeft":
          case "Left":
            destino = atual - 1;
            break;
          case "Home":
            destino = 0;
            break;
          case "End":
            destino = abas.length - 1;
            break;
          default:
            return;
        }
        evento.preventDefault();
        atual = selecionar(destino, true);
      });
    });

    /* O painel é focável (tabindex="0" no protótipo) para quem navega por
       teclado alcançar o texto: Tab da aba ativa cai no painel. Mantemos o
       tabindex="0" só no painel ativo, para não criar paradas mortas. */
    function ajustarTabindexDosPaineis() {
      paineis.forEach(function (painel) {
        if (painel.classList.contains("esta-ativo")) {
          painel.setAttribute("tabindex", "0");
        } else {
          painel.removeAttribute("tabindex");
        }
      });
    }
    ajustarTabindexDosPaineis();
    tablist.addEventListener("click", ajustarTabindexDosPaineis);
    tablist.addEventListener("keyup", ajustarTabindexDosPaineis);
  }

  /* -------------------------------------------------------------------
     4. Arranque
     ------------------------------------------------------------------- */

  function iniciar() {
    var classificar = document.querySelector(".caixa--classificar");
    var revelar = document.querySelector(".caixa--revelar");
    var comparar = document.querySelector(".caixa--comparar");

    /* Tolerante: cada caixa é independente. Falta de uma não derruba as outras.
       Um erro dentro de uma caixa é registrado e não impede as demais —
       mas NÃO é engolido: vai para o console com contexto. */
    if (classificar) { comAviso("I1 (classificar)", function () { ligarClassificar(classificar); }); }
    if (revelar) { comAviso("I2 (revelar)", function () { ligarRevelar(revelar); }); }
    if (comparar) { comAviso("I3 (comparar)", function () { ligarComparar(comparar); }); }
  }

  function comAviso(nome, tarefa) {
    try {
      tarefa();
    } catch (erro) {
      /* Falha alto e com contexto: quem estiver depurando vê qual interação
         quebrou e por quê. A página segue utilizável no estado resolvido. */
      if (window.console && typeof window.console.error === "function") {
        window.console.error("Todo Mundo Acha — falhou ao ligar " + nome + ".", erro);
      }
    }
  }

  document.addEventListener("jornal:montado", iniciar);

  /* Se o DOM já está montado quando este script carrega (ordem de <script>
     diferente, ou uso fora do motor, como na página de teste da T5),
     inicializa na hora. */
  function jaMontado() {
    if (document.documentElement.classList.contains("com-js")) { return true; }
    return !!(document.querySelector(".caixa--classificar") ||
              document.querySelector(".caixa--revelar") ||
              document.querySelector(".caixa--comparar"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (jaMontado()) { iniciar(); }
    });
  } else if (jaMontado()) {
    iniciar();
  }

  /* -------------------------------------------------------------------
     5. Impressão
     -------------------------------------------------------------------
     Nada aqui. Nenhum beforeprint, nenhum afterprint, nenhuma classe posta
     para imprimir. O @media print de css/estilo.css já força o estado
     resolvido das três interações com !important:
       I1  .pergunta__resolucao { display: block !important; } — inclusive
           sob .com-js .pergunta[data-estado="repouso"]
       I2  .revelar__resposta e .grafico__terceira { display: block !important; }
       I3  .caminho { display: block !important; }, inclusive
           .com-js .caixa--comparar .caminho:not(.esta-ativo)
     Este arquivo só escreve data-estado, .esta-revelado e .esta-ativo —
     todos eles vencidos pelas regras acima. Nada que ele faça esconde
     conteúdo no papel. Verificado no PDF: ver relatorios/T5.md, aceite 4.
     ------------------------------------------------------------------- */
})();
