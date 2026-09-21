// =====================================================================
// EDIÇÃO EM BRANCO — modelo para copiar
//
// COMO USAR (você não precisa saber programar)
//  1. Copie este arquivo para a pasta principal, ao lado do index.html,
//     e troque o nome dele para  edicao.js  (guarde o edicao.js antigo
//     com outro nome, por exemplo edicao-01.js, para não perdê-lo).
//  2. Troque os textos pelos seus.
//  3. Salve e abra o index.html com dois cliques.
//
// Se alguma coisa estiver errada, a página NÃO fica em branco: ela mostra,
// no topo, em português, o que falta e em qual campo. Corrija, salve e
// recarregue.
//
// ---------------------------------------------------------------------
// AS CINCO REGRAS DE OURO
//  - Mexa só no texto que fica entre aspas duplas ("...").
//  - Dentro do texto NÃO use aspas duplas retas. Use aspas curvas “ ” ou ‘ ’.
//  - Não apague as vírgulas do fim das linhas, nem as chaves { } e os
//    colchetes [ ]. Eles são o esqueleto do arquivo.
//  - Marcação permitida dentro do texto: **negrito** e *itálico*. Nada de HTML.
//  - Datas em texto por extenso, do jeito que você quer que apareçam.
//
// =====================================================================
// O ESQUEMA (o que cada campo significa)
// Isto é o mesmo contrato que o motor (js/jornal.js) implementa.
//
//  1. jornal { nome, lema, numero, data }
//     - data é texto de exibição, mostrado como está (não é data ISO).
//     - local: OPCIONAL. Se você apagar a linha, a faixa mostra só
//       edição e data.
//
//  2. aviso_modelo: texto exibido na página e no PDF. É a nota que avisa
//     que isto é um modelo de página, e não um veículo oficial.
//
//  3. manchete { id, chapeu, titulo, linha_fina, autoria, corpo[], fontes[] }
//     - autoria aqui é assinatura genérica (“Redação”). O nome da pessoa
//       fica SÓ no expediente.
//
//  4. materias[] { id, secao, titulo, linha_fina, corpo[], fontes[] }
//     - linha_fina: UMA frase, obrigatória em toda matéria.
//     - fontes: lista de { id, paginas? }. O id aponta para
//       fontes_da_disciplina, fontes_complementares ou para_ir_alem.
//       paginas é texto livre (“p. 58–59”) e é opcional.
//       Uma string solta ("gunther") também vale, como atalho de { id }.
//
//  5. caixas[]: campos comuns { id, tipo, ancora, titulo, fontes[] }
//     - ancora: o id da manchete ou de uma matéria. É onde a caixa se
//       apoia; o motor decide o lugar exato na página.
//     - Os quatro tipos estão exemplificados lá embaixo:
//       “classificar”, “revelar”, “comparar” e “destaque”.
//
//  6. editorial { id, titulo, corpo[], fontes[] }
//
//  7. fontes_da_disciplina[] { id, referencia_abnt }
//     Os livros e capítulos que são a base do que você escreveu.
//
//  8. fontes_complementares[] { id, referencia_abnt }
//     Fontes que aparecem só numa caixa. Pode ficar vazia: [ ].
//
//  9. para_ir_alem[] { id, doi, referencia_abnt, o_que_diz, cuidado }
//     - doi: só o código, sem endereço. Exemplo: 10.1126/science.aac4716.
//     - o_que_diz em até 40 palavras; cuidado em até 25.
//     - “cuidado” é o que a fonte NÃO autoriza concluir. É o que separa
//       divulgação honesta de exagero.
//
// 10. expediente { autoria, disciplina, instituicao, docente, origem, licenca }
//     - autoria é o único lugar do arquivo com o nome de quem assina.
//
// CAMPO OPCIONAL ÚTIL: qualquer fonte aceita `nome_curto`. É o nome que
// aparece na linha “Fontes:” e no título das chamadas de “Para ir além”.
// Sem ele, o motor tenta deduzir da referência ABNT, e nem sempre acerta
// em capítulo de livro. Escrever o nome_curto resolve de uma vez.
//
// O QUE O CONFERIDOR EXIGE (se faltar, ele avisa em português)
//  - a caixa “classificar” tem de 5 a 6 perguntas e exatamente 4 tipos,
//    e o tipo de cada pergunta precisa estar na lista de tipos;
//  - a caixa “comparar” tem exatamente 3 caminhos;
//  - toda matéria tem linha_fina;
//  - todo id usado em “fontes” existe em uma das três listas de fontes;
//  - toda “ancora” é o id da manchete ou de uma matéria;
//  - cada item de para_ir_alem tem id, doi, referencia_abnt, o_que_diz
//    e cuidado.
// =====================================================================

window.EDICAO = {

  // -------------------------------------------------------------------
  // 1. O CABEÇALHO DO JORNAL
  // -------------------------------------------------------------------
  jornal: {
    nome: "Nome do Seu Jornal",
    lema: "Uma frase curta que diz a que o jornal veio.",
    numero: "01",
    data: "1º de março de 2027"
    // local: "Natal, RN",   ← opcional: tire o // da frente para usar
  },

  // A nota de modelo. Aparece na tela e no papel. Não apague.
  aviso_modelo: "Modelo de página de jornal digital, feito como trabalho de disciplina. Não é um veículo oficial da instituição.",

  // -------------------------------------------------------------------
  // 2. A MANCHETE — a matéria principal, no topo
  // -------------------------------------------------------------------
  manchete: {
    id: "manchete",
    chapeu: "Assunto da editoria",
    titulo: "O título principal da edição",
    linha_fina: "Uma frase que completa o título e dá o recado em poucas palavras.",
    autoria: "Redação Nome do Seu Jornal",
    corpo: [
      "O primeiro parágrafo entrega logo o mais importante. Você pode marcar uma palavra em **negrito** quando ela for um conceito que o texto acabou de definir.",
      "O segundo parágrafo desenvolve. Um trecho em *itálico* serve para título de obra ou para uma expressão citada.",
      "**Um parágrafo assim.** Quando o parágrafo começa com um rótulo em negrito seguido de ponto, ele ganha um destaque visual próprio, como numa lista de definições."
    ],
    fontes: [
      { id: "fonte-principal", paginas: "p. 10–12" }
    ]
  },

  // -------------------------------------------------------------------
  // 3. AS MATÉRIAS — quantas você quiser
  // -------------------------------------------------------------------
  materias: [

    {
      id: "materia-um",
      secao: "Conceitos",
      titulo: "O título da primeira matéria",
      linha_fina: "A linha fina é obrigatória: uma frase que explica o título.",
      corpo: [
        "Escreva como se estivesse explicando para alguém que nunca ouviu falar do assunto. Termo técnico na primeira vez que aparece vem com a tradução ao lado.",
        "Cada parágrafo é um texto entre aspas, separado do seguinte por vírgula."
      ],
      fontes: [
        { id: "fonte-principal", paginas: "p. 20" }
      ]
    },

    {
      id: "materia-dois",
      secao: "Métodos",
      titulo: "O título da segunda matéria",
      linha_fina: "Esta matéria é a âncora da caixa de comparar e da caixa de destaque.",
      corpo: [
        "Uma matéria com caixa de comparar ou de destaque ancorada nela ocupa uma largura maior na página, e a caixa entra ao lado.",
        "Você não precisa se preocupar com isso: o motor arruma sozinho, a partir do campo ancora de cada caixa."
      ],
      fontes: [
        { id: "fonte-externa", paginas: null }
      ]
    }
  ],

  // -------------------------------------------------------------------
  // 4. AS CAIXAS — os quatro tipos, um exemplo mínimo de cada
  // -------------------------------------------------------------------
  caixas: [

    // ---------------------------------------------------------------
    // TIPO 1 de 4 — "revelar": o leitor aperta um botão e aparece a
    // resposta. Serve para mostrar uma variável escondida, uma causa que
    // não está à vista, um dado que contraria a primeira impressão.
    // No papel, já sai revelada.
    // ---------------------------------------------------------------
    {
      id: "caixa-revelar",
      tipo: "revelar",
      ancora: "manchete",
      titulo: "O título da caixa de revelar",
      variaveis: ["A primeira coisa que se vê", "A segunda coisa que se vê"],
      variavel_escondida: "A terceira coisa, que explica as duas",
      botao: "Revelar a terceira variável",
      antes: {
        titulo: "O que se vê",
        texto: "Descreva aqui só o que está à vista, e termine com a pergunta que o leitor vai querer responder."
      },
      revelacao: {
        titulo: "O que estava escondido",
        texto: "Aqui entra a resposta: a **terceira coisa** que explica as outras duas."
      },
      explicacao: "E aqui o porquê, com o nome do conceito, para o leitor levar o aprendizado embora.",
      fontes: [
        { id: "fonte-principal", paginas: "p. 30" }
      ]
    },

    // ---------------------------------------------------------------
    // TIPO 2 de 4 — "classificar": um pequeno quiz. O leitor escolhe o
    // tipo de cada pergunta e lê por que a resposta é aquela.
    // São EXATAMENTE 4 tipos e de 5 a 6 perguntas.
    // O campo tipo de cada pergunta tem de ser um dos ids de tipos.
    // No papel, todas as respostas já saem visíveis.
    // ---------------------------------------------------------------
    {
      id: "caixa-classificar",
      tipo: "classificar",
      ancora: "materia-um",
      titulo: "O título do quiz",
      instrucao: "Uma frase dizendo o que o leitor deve fazer.",
      tipos: [
        { id: "tipo-a", nome: "Primeiro tipo" },
        { id: "tipo-b", nome: "Segundo tipo" },
        { id: "tipo-c", nome: "Terceiro tipo" },
        { id: "tipo-d", nome: "Quarto tipo" }
      ],
      perguntas: [
        {
          texto: "O enunciado da primeira pergunta?",
          tipo: "tipo-a",
          explicacao: "Por que a resposta é o primeiro tipo, em uma ou duas frases."
        },
        {
          texto: "O enunciado da segunda pergunta?",
          tipo: "tipo-b",
          explicacao: "Por que a resposta é o segundo tipo."
        },
        {
          texto: "O enunciado da terceira pergunta?",
          tipo: "tipo-c",
          explicacao: "Por que a resposta é o terceiro tipo."
        },
        {
          texto: "O enunciado da quarta pergunta?",
          tipo: "tipo-d",
          explicacao: "Por que a resposta é o quarto tipo."
        },
        {
          texto: "O enunciado da quinta pergunta?",
          tipo: "tipo-a",
          explicacao: "Pode repetir um tipo: o que importa é a explicação."
        }
      ],
      fecho: "Uma frase final que costura o quiz ao que a matéria ensinou.",
      fontes: [
        { id: "fonte-principal", paginas: "p. 40–45" }
      ]
    },

    // ---------------------------------------------------------------
    // TIPO 3 de 4 — "comparar": três opções lado a lado, cada uma com o
    // que ganha e o que perde. São EXATAMENTE 3 caminhos.
    // No papel, saem os três lado a lado.
    // ---------------------------------------------------------------
    {
      id: "caixa-comparar",
      tipo: "comparar",
      ancora: "materia-dois",
      titulo: "O título da comparação",
      introducao: "Uma frase dizendo o que está sendo comparado.",
      caminhos: [
        {
          id: "observar",
          nome: "Primeiro caminho",
          exemplo: "Um exemplo concreto, de preferência um estudo real, com autor e ano.",
          ganha: "**O que ganha.** Escreva a vantagem começando com o rótulo em negrito.",
          perde: "**O que perde.** E aqui a desvantagem, no mesmo formato."
        },
        {
          id: "experimentar",
          nome: "Segundo caminho",
          exemplo: "Outro exemplo concreto.",
          ganha: "**O que ganha.** A vantagem deste caminho.",
          perde: "**O que perde.** A desvantagem deste caminho."
        },
        {
          id: "perguntar",
          nome: "Terceiro caminho",
          exemplo: "Mais um exemplo concreto.",
          ganha: "**O que ganha.** A vantagem do terceiro.",
          perde: "**O que perde.** A desvantagem do terceiro."
        }
      ],
      fontes: [
        { id: "fonte-principal", paginas: "p. 50" }
      ]
    },

    // ---------------------------------------------------------------
    // TIPO 4 de 4 — "destaque": uma caixa lateral, sem interação, com
    // título e um ou mais parágrafos. Serve para um recorte que não cabe
    // no fio da matéria: uma ressalva, um contraponto, uma nota de ética.
    // ---------------------------------------------------------------
    {
      id: "caixa-destaque",
      tipo: "destaque",
      ancora: "materia-dois",
      titulo: "O título da caixa de destaque",
      corpo: [
        "Um ou mais parágrafos. É o lugar certo para a ressalva que o texto principal não comporta sem perder o fio.",
        "Duas ou três caixas de destaque ancoradas na mesma matéria entram juntas, numa coluna ao lado dela."
      ],
      fontes: [
        { id: "fonte-externa" }
      ]
    }
  ],

  // -------------------------------------------------------------------
  // 5. O EDITORIAL — a opinião da redação, que fecha a edição
  // -------------------------------------------------------------------
  editorial: {
    id: "editorial",
    titulo: "O título do editorial",
    corpo: [
      "O editorial é o único lugar da página onde a redação fala em nome próprio. Diga por que este assunto importa.",
      "Feche com o que você quer que o leitor faça com o que acabou de ler."
    ],
    fontes: [
      { id: "fonte-principal", paginas: "p. 60" }
    ]
  },

  // -------------------------------------------------------------------
  // 6. AS FONTES DA DISCIPLINA — a base do que você escreveu
  // -------------------------------------------------------------------
  fontes_da_disciplina: [
    {
      id: "fonte-principal",
      nome_curto: "Sobrenome e Sobrenome",
      referencia_abnt: "SOBRENOME, Nome; SOBRENOME, Nome. Título do capítulo. In: ORGANIZADOR, Nome (org.). *Título do livro*. Cidade: Editora, 2020. p. 10–60."
    }
  ],

  // -------------------------------------------------------------------
  // 7. FONTES QUE APARECEM SÓ EM CAIXA
  // Pode ficar vazia:  fontes_complementares: [],
  // -------------------------------------------------------------------
  fontes_complementares: [
    {
      id: "fonte-externa",
      nome_curto: "Autor et al. (2021)",
      referencia_abnt: "AUTOR, Nome et al. Título do artigo. *Nome da Revista*, v. 1, n. 1, p. 1–10, 2021. DOI: 10.0000/exemplo."
    }
  ],

  // -------------------------------------------------------------------
  // 8. PARA IR ALÉM — as leituras que o leitor pode procurar depois
  // Cada uma precisa de "o que diz" E de "cuidado". O cuidado não é
  // enfeite: é o que impede a leitura apressada de virar exagero.
  // O DOI entra como texto, não como link.
  // -------------------------------------------------------------------
  para_ir_alem: [
    {
      id: "leitura-um",
      nome_curto: "Sobrenome et al. (2019)",
      doi: "10.0000/exemplo-um",
      referencia_abnt: "SOBRENOME, Nome et al. Título do artigo que vale a pena ler. *Nome da Revista*, v. 10, n. 2, p. 100–120, 2019. DOI: 10.0000/exemplo-um.",
      o_que_diz: "Em até 40 palavras, o que o estudo mostrou. Use o que está no resumo oficial do artigo, e nada além disso.",
      cuidado: "Em até 25 palavras, o que este estudo NÃO autoriza concluir."
    },
    {
      id: "leitura-dois",
      nome_curto: "Sobrenome e Sobrenome (2022)",
      doi: "10.0000/exemplo-dois",
      referencia_abnt: "SOBRENOME, Nome; SOBRENOME, Nome. Outro título. *Outra Revista*, v. 3, n. 4, p. 200–215, 2022. DOI: 10.0000/exemplo-dois.",
      o_que_diz: "O que a segunda leitura mostrou, também em até 40 palavras.",
      cuidado: "O limite da segunda leitura: tipo de estudo, população, país."
    }
  ],

  // -------------------------------------------------------------------
  // 9. O EXPEDIENTE — quem assina e de onde vem
  // -------------------------------------------------------------------
  expediente: {
    autoria: "Seu Nome Completo",
    disciplina: "CÓDIGO — Nome da Disciplina",
    instituicao: "Nome da Instituição, período 2027.1",
    docente: "Nome de quem ministra a disciplina",
    origem: "Produzido como atividade avaliativa da disciplina. Não é um veículo oficial da instituição.",
    licenca: "Código do molde sob licença MIT; texto desta edição sob licença CC BY 4.0."
  }
};
