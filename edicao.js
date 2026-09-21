// =====================================================================
// TODO MUNDO ACHA — EDIÇÃO 01 — conteúdo
// Este é o ÚNICO arquivo que o editor mexe. Ele atribui a window.EDICAO.
// Texto da edição 01: licença CC BY 4.0. Código do molde: licença MIT.
//
// ---------------------------------------------------------------------
// COMO EDITAR (para quem nunca abriu um arquivo de código)
//  - Mexa só no texto que fica entre aspas duplas ("...").
//  - Dentro do texto NÃO use aspas duplas retas. Use aspas curvas “ ” ou ‘ ’.
//  - Não apague vírgulas no fim das linhas nem as chaves { } e colchetes [ ].
//  - Marcação permitida dentro do texto: **negrito** e *itálico*. Nada de HTML.
//
// ---------------------------------------------------------------------
// DECISÕES DE ESQUEMA (o motor jornal.js implementa em cima disto)
// Tudo aqui completa o contrato do PLANO §4. Onde o contrato mudou, está marcado.
//
//  1. jornal { nome, lema, numero, data }
//     - data é texto de exibição, mostrado como está (não é data ISO).
//     - local: OPCIONAL, omitido nesta edição.
//
//  2. aviso_modelo: texto exibido na página e no PDF (R2, DP13).
//
//  3. manchete { id, chapeu, titulo, linha_fina, autoria, corpo[], fontes[] }
//     - MUDANÇA: acrescentados id, corpo[] (parágrafos) e fontes[].
//     - MUDANÇA: autoria aqui é assinatura genérica (“Redação”). O nome da
//       pessoa fica SÓ em expediente.autoria (R5).
//
//  4. materias[] { id, secao, titulo, linha_fina, corpo[], fontes[] }
//     - linha_fina: UMA frase (obrigatória em toda matéria).
//     - MUDANÇA: fontes deixa de ser lista de textos e vira lista de objetos
//       { id, paginas? }. O id aponta para fontes_da_disciplina,
//       fontes_complementares ou para_ir_alem. paginas é texto livre
//       (“p. 58–59”); só existe para os livros da disciplina.
//       O motor pode aceitar também uma string solta como atalho de { id }.
//
//  5. caixas[]: campos comuns { id, tipo, ancora, titulo, fontes[] }
//     - ancora: id da manchete ou da matéria em que a caixa se apoia.
//       O motor decide o lugar exato; é uma sugestão de posição.
//     - tipo “classificar” (I1):
//         instrucao (texto), tipos[] { id, nome }, fecho (texto),
//         perguntas[] { texto, tipo, explicacao }
//         tipo ∈ existencia | associacao | previsao | causa (sem acento).
//       Impresso: todas as perguntas mostram o tipo certo e a explicação.
//     - tipo “revelar” (I2):
//         variaveis[2] (as duas variáveis que parecem ligadas),
//         variavel_escondida (a terceira), botao (rótulo do botão),
//         antes { titulo, texto }, revelacao { titulo, texto }, explicacao.
//         Não há números: o gráfico, se houver, é só um esquema.
//       Impresso: já revelada (antes + revelacao + explicacao).
//     - tipo “comparar” (I3):
//         introducao (texto), caminhos[3] { id, nome, exemplo, ganha, perde }.
//         id ∈ observar | experimentar | perguntar
//         (o motor pode ligar cada id a uma cor).
//       Impresso: os três lado a lado.
//     - tipo “destaque”: corpo[] (parágrafos). Sem interação.
//
//  6. editorial { id, titulo, corpo[], fontes[] }   (acrescentados id e fontes)
//
//  7. NOVO fontes_da_disciplina[] { id, referencia_abnt }
//     Livros de Günther e de Pereira, Sindic e Camino: fonte primária (R4).
//
//  8. NOVO fontes_complementares[] { id, referencia_abnt }
//     Fontes que aparecem só numa caixa (Gilbert e Anderson, 2016).
//
//  9. para_ir_alem[] { id, doi, referencia_abnt, o_que_diz, cuidado }
//     - MUDANÇA: acrescentado doi (só o código, sem endereço).
//     - Só as seis fontes externas. o_que_diz ≤ 40 palavras, cuidado ≤ 25.
//
// 10. expediente { autoria, disciplina, instituicao, docente, origem, licenca }
//     - MUDANÇA: acrescentado origem (texto de origem acadêmica, R2).
//     - autoria é o único lugar do arquivo com o nome do autor (R5); o
//       docente também é nomeado no expediente (decisão do autor no G3).
//
// Regra do resumo (R3): as fontes externas só sustentam o que o resumo
// oficial do artigo diz. Cada afirmação factual está em claims.md.
// =====================================================================

window.EDICAO = {

  jornal: {
    nome: "Todo Mundo Acha",
    lema: "Todo mundo tem opinião. A pesquisa tem método.",
    numero: "01",
    data: "21 de setembro de 2026"
  },

  aviso_modelo: "Modelo de página de jornal digital, feito como trabalho de disciplina. Não é um veículo oficial da UFRN.",

  // -------------------------------------------------------------------
  // MANCHETE
  // -------------------------------------------------------------------
  manchete: {
    id: "manchete",
    chapeu: "Alfabetização científica",
    titulo: "Como ler uma manchete de pesquisa sem ser enganado",
    linha_fina: "“Estudo aponta ligação” não é o mesmo que “uma coisa causa a outra”.",
    autoria: "Redação Todo Mundo Acha",
    corpo: [
      "Imagine esta manchete, **inventada para este exemplo**: *“Estudo mostra que, quanto mais sorvete, mais afogamentos”*. Mas um estudo assim só mostraria que duas coisas andam juntas.",
      "Duas coisas que variam (as **variáveis**) podem andar juntas, o que se chama correlação, sem que uma cause a outra. Para afirmar causa, Pereira, Sindic e Camino apresentam três condições necessárias.",
      "**Antecedência temporal.** A causa vem antes do efeito.",
      "**Relação entre as variáveis.** Saber uma informa algo sobre a outra, e não por acaso.",
      "**Ausência de relação espúria.** É espúria a relação em que uma terceira variável, escondida, causa as duas coisas.",
      "As duas primeiras não bastam sozinhas. O quadro *A variável escondida* mostra a terceira em ação.",
      "O exagero pode nascer antes da notícia. Um estudo de 2014, na revista *BMJ*, comparou 462 comunicados de imprensa de 20 universidades britânicas com 668 notícias associadas, sobre pesquisa em saúde. Em 33% dos comunicados, um dado de correlação virava afirmação causal exagerada. Quando o comunicado exagerava, 81% das notícias repetiam o exagero; quando não, 18%.",
      "Na próxima manchete, pergunte: quem veio antes? As duas coisas andam mesmo juntas? Existe uma terceira, escondida?"
    ],
    fontes: [
      { id: "pereira", paginas: "p. 159–161" },
      { id: "sumner-2014" }
    ]
  },

  // -------------------------------------------------------------------
  // MATÉRIAS
  // -------------------------------------------------------------------
  materias: [

    {
      id: "m1-tipos-de-pergunta",
      secao: "Conceitos",
      titulo: "Nem toda pergunta é uma pesquisa",
      linha_fina: "Para virar pesquisa, a pergunta precisa de algo que varie, e o tipo de pergunta pesa na escolha do método.",
      corpo: [
        "*“Devo me casar ou comprar uma bicicleta?”* *“Ser, ou não ser?”* *“Tanto fará indo como voltando?”* Segundo Pereira, Sindic e Camino, nenhuma, como está formulada, é objeto de investigação científica. Falta a elas uma **variável** clara, algo que dê para observar.",
        "Variável costuma ser definida como uma coisa que varia; **constante**, uma coisa que não varia. Numa tabela de participantes, a idade é variável; o sexo é constante se todos forem do mesmo sexo.",
        "Um **problema de pesquisa** é uma pergunta sobre variáveis. Os autores o separam em quatro tipos (nomes nossos), como *“mera estratégia de simplificação”*.",
        "**Existência.** Se um fenômeno existe ou como ele é: grau, nível, características.",
        "**Associação.** Se duas variáveis se relacionam, sem dizer qual vem antes nem se uma causa a outra.",
        "**Previsão.** Supõe uma posição: uma variável entra como a que ajuda a prever a outra, sem afirmar causa.",
        "**Causa.** Se uma variável influencia a outra. A suposta causa é a variável **independente**; o suposto efeito, a **dependente**.",
        "As três primeiras se respondem sem experimento. O experimental é eficaz apenas para a de causa, embora os autores ressalvem que nem é o único caminho para ela nem garante a resposta. O que mais pesa na escolha do método, sugerem, é o tipo de problema colocado."
      ],
      fontes: [
        { id: "pereira", paginas: "p. 148–155, 162, 185" }
      ]
    },

    {
      id: "m2-tres-caminhos",
      secao: "Métodos",
      titulo: "Três caminhos para estudar gente",
      linha_fina: "Observar, experimentar ou perguntar: cada caminho ganha algo e perde algo.",
      corpo: [
        "Segundo Günther, são três os caminhos principais para estudar o comportamento humano na psicologia social: **observar** o que acontece naturalmente na vida real, **experimentar** (criar situações artificiais e registrar o que as pessoas fazem) e fazer um **levantamento**, ou *survey* (perguntar às pessoas o que fazem, pensam ou sentem).",
        "Para mostrar o que cada um enxerga, ele usa um só tema, o **comportamento de ajuda**: ceder o lugar no ônibus, doar sangue, interferir numa briga.",
        "Um experimento clássico citado no capítulo é o de Darley e Latané (1968). A hipótese, o palpite a testar: quanto maior o número de pessoas por perto, menor a probabilidade de ajuda por parte de qualquer pessoa. A **variável independente**, a que o pesquisador controla (a suposta causa), foi o número de pessoas presentes além do participante.",
        "Pelo resumo do artigo, os participantes ouviam o que parecia uma crise epiléptica de outra pessoa e achavam estar sozinhos ou com mais uma ou quatro pessoas, que não viam. **A vítima era ouvida, não vista.** Mais gente presente reduziu o sentimento de responsabilidade pessoal e a rapidez de quem avisava.",
        "Em 2020, câmeras de vigilância deram outro ângulo: Philpot e colegas analisaram 219 conflitos em locais públicos do Reino Unido, da Holanda e da África do Sul. Em 9 de cada 10, pelo menos um espectador ajudou; mais espectadores se associaram a mais chance de *alguém* intervir. Os dois estudos medem coisas diferentes: o de 1968, a rapidez de cada participante, numa situação encenada; o de 2020, se alguém ajudou, em campo."
      ],
      fontes: [
        { id: "gunther", paginas: "p. 58–59, 70–71" },
        { id: "darley-latane-1968" },
        { id: "philpot-2020" }
      ]
    },

    {
      id: "m3-quando-a-ciencia-nao-se-repete",
      secao: "Ciência em revisão",
      titulo: "Quando um estudo não se repete",
      linha_fina: "Em 2015, cem estudos de psicologia foram refeitos, e os números abriram um debate.",
      corpo: [
        "Günther lembra que o método deve ser descrito com detalhe suficiente para que outros pesquisadores possam **replicar** o estudo, isto é, refazê-lo.",
        "Em 2015, a Open Science Collaboration publicou na revista *Science* a replicação de 100 estudos de três revistas científicas de psicologia. Entre os originais, 97% tinham resultado “significativo” (que o teste estatístico não atribui só ao acaso); entre as réplicas, 36%.",
        "Mas 36% é um indicador entre vários. O resumo do artigo traz outros; um deles: 39% das réplicas foram avaliadas, subjetivamente, como bem-sucedidas. Dizer que “a maioria dos estudos estava errada” iria além do resumo.",
        "Em português, Massola, Crochík e Svartman (2016) discutem a “crise da replicação” num editorial, com posição própria.",
        "Refazer um estudo é levar a sério o que Pereira, Sindic e Camino chamam de dúvida fundamental: aquilo que observamos pode não ser tal como o vemos."
      ],
      fontes: [
        { id: "gunther", paginas: "p. 63, 66" },
        { id: "pereira", paginas: "p. 148" },
        { id: "osc-2015" },
        { id: "massola-2016" }
      ]
    }
  ],

  // -------------------------------------------------------------------
  // CAIXAS
  // -------------------------------------------------------------------
  caixas: [

    // I2 — a variável escondida (sorvete e afogamentos)
    {
      id: "c-variavel-escondida",
      tipo: "revelar",
      ancora: "manchete",
      titulo: "A variável escondida",
      variaveis: ["Consumo de sorvete", "Afogamentos nas praias"],
      variavel_escondida: "Estação do ano (meses mais quentes)",
      botao: "Revelar a terceira variável",
      antes: {
        titulo: "O que se vê",
        texto: "Exemplo imaginado pelos autores, não um dado real. Conta-se o sorvete consumido nas cidades de praia de janeiro a junho de 2000 e os afogamentos nos mesmos meses de 2010. Em ambos há mais de janeiro a março do que de abril a junho. A associação é considerável, e o sorvete veio antes. O sorvete provoca afogamentos?"
      },
      revelacao: {
        titulo: "O que estava escondido",
        texto: "A terceira variável pode ser a **estação do ano**. Nos meses mais quentes, sobe o consumo de sorvete e aumenta o fluxo de pessoas nas praias, o que aumenta a probabilidade de alguém se afogar."
      },
      explicacao: "É uma **relação espúria**: as duas variáveis se relacionam porque uma terceira causa ambas. Se controlássemos a estação do ano, dizem os autores, a relação desapareceria.",
      fontes: [
        { id: "pereira", paginas: "p. 160–161" }
      ]
    },

    // I1 — classifique a pergunta
    {
      id: "c-classifique-a-pergunta",
      tipo: "classificar",
      ancora: "m1-tipos-de-pergunta",
      titulo: "Classifique a pergunta",
      instrucao: "Escolha o tipo de cada pergunta e leia o porquê. Exemplos do capítulo de Pereira, Sindic e Camino.",
      tipos: [
        { id: "existencia", nome: "Existência" },
        { id: "associacao", nome: "Associação" },
        { id: "previsao", nome: "Previsão" },
        { id: "causa", nome: "Causa" }
      ],
      perguntas: [
        {
          texto: "Existe racismo no Brasil?",
          tipo: "existencia",
          explicacao: "Pergunta se o fenômeno existe. Dá para responder observando indicadores de racismo de forma sistemática."
        },
        {
          texto: "Quais são as expectativas dos jovens sobre o seu futuro na sociedade atual?",
          tipo: "existencia",
          explicacao: "Também é existência: pergunta pelas características de um fenômeno."
        },
        {
          texto: "Existirá alguma relação entre o racismo e a oposição às políticas de ação afirmativa no Brasil?",
          tipo: "associacao",
          explicacao: "Só pergunta se há relação, sem supor causa."
        },
        {
          texto: "Estará o racismo na base da oposição às políticas de ação afirmativa no Brasil?",
          tipo: "previsao",
          explicacao: "Traz uma hipótese sobre a posição das variáveis: o racismo é a variável explicativa (a que prevê) e a oposição, a variável-critério (a prevista). Não afirma causa."
        },
        {
          texto: "Será que o racismo influencia a oposição às políticas de ação afirmativa no Brasil?",
          tipo: "causa",
          explicacao: "A dúvida é específica: existe relação causal? O racismo é a variável independente (suposta causa); a oposição, a dependente (suposto efeito)."
        }
      ],
      fecho: "As três últimas são quase iguais. O que muda é o que se quer saber sobre as variáveis, e isso pesa na escolha do método.",
      fontes: [
        { id: "pereira", paginas: "p. 150–154" }
      ]
    },

    // I3 — três caminhos, lado a lado
    {
      id: "c-tres-caminhos-lado-a-lado",
      tipo: "comparar",
      ancora: "m2-tres-caminhos",
      titulo: "Três caminhos, lado a lado",
      introducao: "O mesmo tema, o comportamento de ajuda, visto por três caminhos.",
      caminhos: [
        {
          id: "observar",
          nome: "Observar",
          exemplo: "Silva e Günther (2001) criaram “oportunidades de ajudar” num ônibus lotado: quem, entre os sentados, se ofereceria para segurar o pacote de um passageiro em pé?",
          ganha: "**Realismo.** Você está diante do comportamento que interessa, sem perguntar sobre pensamentos.",
          perde: "**Tempo e controle.** Pode demorar até o comportamento aparecer; sem controle da situação, não há sorteio dos participantes nem como estender o resultado a outras pessoas."
        },
        {
          id: "experimentar",
          nome: "Experimentar",
          exemplo: "Darley e Latané (1968): o pesquisador varia quantas pessoas o participante acredita ter por perto.",
          ganha: "**Causa.** Sorteando os participantes entre as condições (a randomização), dá para atribuir o comportamento à situação; sem sorteio, não.",
          perde: "**Naturalidade.** A situação é artificial, muitas vezes com encenação, e o participante se pergunta: o que o experimentador quer de mim, realmente?"
        },
        {
          id: "perguntar",
          nome: "Perguntar",
          exemplo: "No estudo imaginário de Günther, seriam perguntas sobre as motivações para se engajar numa ação de solidariedade.",
          ganha: "**Motivos e alcance.** Explora atitudes, opiniões e razões para fazer ou não fazer algo. Com amostra sorteada, generaliza para além das pessoas estudadas.",
          perde: "**Sinceridade.** Perguntas sobre assuntos sensíveis nem sempre produzem respostas autênticas."
        }
      ],
      fontes: [
        { id: "gunther", paginas: "p. 58, 68–73" }
      ]
    },

    // Destaque — ética
    {
      id: "c-preco-do-experimento",
      tipo: "destaque",
      ancora: "m2-tres-caminhos",
      titulo: "O preço do experimento",
      corpo: [
        "Muitos experimentos incluem **engano**: uma encenação que esconde o objetivo real. O exemplo mais famoso, diz Günther, é o de Milgram (1963). O argumento a favor: esses estudos tratam de comportamentos regidos por normas sociais, como ajudar ou agredir, e não seriam viáveis se o participante soubesse o objetivo.",
        "O contrapeso: respeitar a dignidade e a integridade física e psicológica dos participantes, explicar a pesquisa (se não antes, sem dúvida depois) e não expor ninguém a desconforto desnecessário. Essa explicação depois do estudo é o **esclarecimento pós-experimental**.",
        "O fim científico não justifica os meios, resume Günther, remetendo ao Artigo 16 do Código de Ética do Conselho Federal de Psicologia (2005)."
      ],
      fontes: [
        { id: "gunther", paginas: "p. 71" }
      ]
    },

    // Destaque — onde os cientistas discordam
    {
      id: "c-onde-os-cientistas-discordam",
      tipo: "destaque",
      ancora: "m3-quando-a-ciencia-nao-se-repete",
      titulo: "Onde os cientistas discordam",
      corpo: [
        "O resultado de 2015 gerou um debate na própria *Science*. Gilbert e colegas comentaram que o artigo tem três erros estatísticos e que os dados são compatíveis com alta reprodutibilidade (o quanto os resultados se repetem). Anderson e colegas responderam que a leitura otimista é limitada por equívocos estatísticos e que nenhuma das duas conclusões, otimista ou pessimista, se justifica ainda."
      ],
      fontes: [
        { id: "gilbert-2016" },
        { id: "anderson-2016" }
      ]
    }
  ],

  // -------------------------------------------------------------------
  // EDITORIAL
  // -------------------------------------------------------------------
  editorial: {
    id: "editorial",
    titulo: "Publicar é a outra face de pesquisar",
    corpo: [
      "Pesquisar e publicar são as duas faces da mesma moeda, escreve Günther: uma não vale sem a outra. Publicar quer dizer *tornar público*, e uma pesquisa que não for publicada não contribuirá para a ciência, sequer existirá. No ciclo da pesquisa, uma etapa é receber retroalimentação da comunidade científica.",
      "Ser público também é poder ser revisto. A história das 38 testemunhas do assassinato de Kitty Genovese é um exemplo: Manning, Levine e Collins (2007), com material de arquivo, argumentam que não há evidência de 38 testemunhas, de que tenham visto o assassinato nem de que tenham ficado sem agir. O resumo do artigo mantém isso separado da pesquisa sobre espectadores.",
      "Nenhum método basta sozinho: quem escolhe um caminho aceita as vantagens e desvantagens dele em vez das de outro, lembra Günther, citando Kish. Usar mais de um método é o **multimétodo**; usá-los para estudar a mesma coisa é a **triangulação**. Um estudo com um só tipo de método deixa de lado hipóteses rivais (explicações concorrentes) não testadas, dizem Brewer e Hunter, citados por Günther.",
      "Ler uma manchete com método é metade do trabalho; a outra metade é passar adiante. Esta página é também um molde livre para outras equipes."
    ],
    fontes: [
      { id: "gunther", paginas: "p. 60–61, 73–74" },
      { id: "manning-2007" }
    ]
  },

  // -------------------------------------------------------------------
  // FONTES DA DISCIPLINA (fonte primária, R4)
  // -------------------------------------------------------------------
  fontes_da_disciplina: [
    {
      id: "gunther",
      referencia_abnt: "GÜNTHER, Hartmut. Métodos de pesquisa em psicologia social. In: TORRES, Cláudio Vaz; NEIVA, Elaine Rabelo (org.). *Psicologia social: principais temas e vertentes*. Porto Alegre: Artmed, 2011. p. 58–76."
    },
    {
      id: "pereira",
      referencia_abnt: "PEREIRA, Cícero Roberto; SINDIC, Denis; CAMINO, Leoncio. Metodologia da pesquisa em psicologia social. In: CAMINO, Leoncio; TORRES, Ana Raquel Rosas; LIMA, Marcus Eugênio Oliveira; PEREIRA, Marcos Emanoel (org.). *Psicologia social: temas e teorias*. 2. ed. rev. ampl. Brasília, DF: Technopolitik, 2013. p. 109–186."
    }
  ],

  // -------------------------------------------------------------------
  // FONTES QUE APARECEM SÓ EM CAIXA
  // -------------------------------------------------------------------
  fontes_complementares: [
    {
      id: "gilbert-2016",
      referencia_abnt: "GILBERT, Daniel T.; KING, Gary; PETTIGREW, Stephen; WILSON, Timothy D. Comment on “Estimating the reproducibility of psychological science”. *Science*, v. 351, n. 6277, p. 1037, 4 mar. 2016. DOI: 10.1126/science.aad7243."
    },
    {
      id: "anderson-2016",
      referencia_abnt: "ANDERSON, Christopher J. et al. Response to Comment on “Estimating the reproducibility of psychological science”. *Science*, v. 351, n. 6277, p. 1037, 4 mar. 2016. DOI: 10.1126/science.aad9163."
    }
  ],

  // -------------------------------------------------------------------
  // PARA IR ALÉM — as seis fontes externas
  // -------------------------------------------------------------------
  para_ir_alem: [
    {
      id: "osc-2015",
      doi: "10.1126/science.aac4716",
      referencia_abnt: "OPEN SCIENCE COLLABORATION. Estimating the reproducibility of psychological science. *Science*, v. 349, n. 6251, aac4716, 28 ago. 2015. DOI: 10.1126/science.aac4716.",
      o_que_diz: "Replicou 100 estudos de três revistas científicas de psicologia. Os efeitos replicados tiveram cerca da metade da magnitude dos originais; 97% dos originais eram significativos, contra 36% das réplicas.",
      cuidado: "36% é um indicador entre vários; o resumo traz outros. Não sustenta dizer que a maioria dos estudos estava errada."
    },
    {
      id: "massola-2016",
      doi: "10.1590/0103-656420162703",
      referencia_abnt: "MASSOLA, Gustavo Martineli; CROCHÍK, José Leon; SVARTMAN, Bernardo Parodi. A psicologia como ciência empírica. *Psicologia USP*, v. 27, n. 3, p. 379–394, 2016. DOI: 10.1590/0103-656420162703.",
      o_que_diz: "Editorial em português que descreve a pesquisa da Open Science Collaboration, cita a posição de que não há “crise da replicação” e menciona a crítica de Gilbert e a resposta de Anderson.",
      cuidado: "É um editorial, com posição própria. Não é texto didático nem descrição neutra."
    },
    {
      id: "sumner-2014",
      doi: "10.1136/bmj.g7015",
      referencia_abnt: "SUMNER, Petroc et al. The association between exaggeration in health related science news and academic press releases: retrospective observational study. *BMJ*, v. 349, g7015, 9 dez. 2014. DOI: 10.1136/bmj.g7015.",
      o_que_diz: "Comparou 462 comunicados de 20 universidades britânicas com 668 notícias. Em 33% dos comunicados havia afirmação causal exagerada a partir de dado correlacional; quando havia, 81% das notícias também exageravam, contra 18%.",
      cuidado: "Estudo observacional e retrospectivo, sobre ciência biomédica e de saúde. O resumo não menciona psicologia."
    },
    {
      id: "darley-latane-1968",
      doi: "10.1037/h0025589",
      referencia_abnt: "DARLEY, John M.; LATANÉ, Bibb. Bystander intervention in emergencies: diffusion of responsibility. *Journal of Personality and Social Psychology*, v. 8, n. 4, pt. 1, p. 377–383, 1968. DOI: 10.1037/h0025589.",
      o_que_diz: "Participantes ouviram o que parecia uma crise epiléptica de outra pessoa, achando-se sozinhos ou com mais uma ou quatro pessoas que não viam. Mais gente reduziu a responsabilidade sentida e a rapidez de quem avisava.",
      cuidado: "A vítima era ouvida, não vista. “Difusão de responsabilidade” é a interpretação dos autores. O resumo não menciona Kitty Genovese."
    },
    {
      id: "philpot-2020",
      doi: "10.1037/amp0000469",
      referencia_abnt: "PHILPOT, Richard et al. Would I be helped? Cross-national CCTV footage shows that intervention is the norm in public conflicts. *American Psychologist*, v. 75, n. 1, p. 66–75, jan. 2020. DOI: 10.1037/amp0000469.",
      o_que_diz: "Com câmeras de vigilância, analisou 219 conflitos (não pessoas) no Reino Unido, na Holanda e na África do Sul. Em 9 de cada 10, pelo menos um espectador ajudou; mais espectadores se associaram a mais chance de alguém intervir.",
      cuidado: "São três países. O resultado é agregado (“pelo menos um ajuda”) e mede algo diferente do experimento de 1968."
    },
    {
      id: "manning-2007",
      doi: "10.1037/0003-066X.62.6.555",
      referencia_abnt: "MANNING, Rachel; LEVINE, Mark; COLLINS, Alan. The Kitty Genovese murder and the social psychology of helping: the parable of the 38 witnesses. *American Psychologist*, v. 62, n. 6, p. 555–562, 2007. DOI: 10.1037/0003-066X.62.6.555.",
      o_que_diz: "Com material de arquivo, argumenta que não há evidência de 38 testemunhas do assassinato de Kitty Genovese, de que tenham visto o crime nem de que tenham ficado inativas.",
      cuidado: "Contesta a história do caso e a separa da pesquisa sobre espectadores, que o próprio resumo chama de robusta."
    }
  ],

  // -------------------------------------------------------------------
  // EXPEDIENTE
  // -------------------------------------------------------------------
  expediente: {
    autoria: "João Victor Fernandes Bezerra",
    disciplina: "PSI0981 — Psicologia Social e Comunicação",
    instituicao: "Universidade Federal do Rio Grande do Norte (UFRN), período 2026.2",
    docente: "Thiago da Silva Laurentino",
    origem: "Produzido como Atividade Avaliativa da Unidade I da disciplina. Não é um veículo oficial da UFRN.",
    licenca: "Código do molde sob licença MIT; texto da edição 01 sob licença CC BY 4.0."
  }
};
