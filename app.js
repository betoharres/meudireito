'use strict';

// Meus Benefícios: questionnaire, rules engine and screens.
// A classic script (not an ES module) so the site also works when index.html is opened from file://.

// ---------- Data ----------

// Copy of regras.json. Browsers block fetch() on file://, so this copy is used when loading
// regras.json fails. Keep it identical to regras.json.
const EMBEDDED_RULES = {
  "revision": "2026-10",
  "$comment": "Values in centavos. Minimum wage 2026: R$ 1.621 = 162100. Half: 81050. Quarter: 40525. Three: 486300. Keep app.js EMBEDDED_RULES identical to this file.",
  "prices": {
    "$comment": "kwhMilliReais: average residential (B1) tariff of the distributors approved by ANEEL in 2026, without taxes: R$ 0,815 per kWh. gasCylinderCentavos: lowest Gás do Povo reference price for a 13 kg cylinder (Pernambuco), Portaria Interministerial MME/MF 1/2026. Both are conservative on purpose.",
    "kwhMilliReais": 815,
    "gasCylinderCentavos": 8967
  },
  "programs": [
    {
      "id": "cadunico",
      "name": "Cadastro Único (CadÚnico)",
      "source": "https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico",
      "cases": [
        {
          "when": {
            "anyOf": [
              {
                "properties": {
                  "incomePerPersonCentavos": {
                    "maximum": 81050
                  }
                }
              },
              {
                "properties": {
                  "totalIncomeCentavos": {
                    "maximum": 486300
                  }
                }
              }
            ]
          },
          "section": "yes",
          "reason": "A renda da sua casa está dentro do limite do Cadastro Único.",
          "nextStep": "Vá ao CRAS com CPF e comprovante de endereço."
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "A renda passa dos dois limites: R$ 810,50 por pessoa e R$ 4.863 no total.",
        "nextStep": "Se a renda da casa diminuir, procure o CRAS para se cadastrar."
      }
    },
    {
      "id": "bolsa-familia",
      "name": "Bolsa Família",
      "source": "https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia",
      "cases": [
        {
          "when": {
            "$comment": "Lei 14.601/2023: renda por pessoa de até R$ 218.",
            "properties": {
              "people": {
                "const": 1
              },
              "incomePerPersonCentavos": {
                "maximum": 21800
              }
            }
          },
          "section": "yes",
          "reason": "A renda por pessoa é de até R$ 218, mas quem mora sozinho pode passar por entrevista ou visita.",
          "nextStep": "Faça ou atualize o CadÚnico no CRAS. É ele que dá acesso ao Bolsa Família.",
          "estimate": {
            "$comment": "Lei 14.601/2023: at least R$ 600 per family.",
            "type": "fixed",
            "monthlyCentavos": 60000,
            "qualifier": "atLeast",
            "detail": "Valor mínimo por família. Aumenta com crianças, gestantes ou jovens na casa."
          }
        },
        {
          "when": {
            "$comment": "Lei 14.601/2023: renda por pessoa de até R$ 218.",
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 21800
              }
            }
          },
          "section": "yes",
          "reason": "A renda por pessoa é de até R$ 218.",
          "nextStep": "Faça ou atualize o CadÚnico no CRAS. É ele que dá acesso ao Bolsa Família.",
          "estimate": {
            "$comment": "Lei 14.601/2023: at least R$ 600 per family.",
            "type": "fixed",
            "monthlyCentavos": 60000,
            "qualifier": "atLeast",
            "detail": "Valor mínimo por família. Aumenta com crianças, gestantes ou jovens na casa."
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "A renda por pessoa passa de R$ 218.",
        "nextStep": "Se a renda diminuir, atualize o CadÚnico no CRAS."
      }
    },
    {
      "id": "tarifa-social-luz",
      "name": "Tarifa Social de luz",
      "source": "https://www.gov.br/aneel/pt-br/assuntos/tarifas/tarifa-social",
      "cases": [
        {
          "when": {
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 81050
              }
            }
          },
          "section": "yes",
          "reason": "Com renda por pessoa de até R$ 810,50, a luz é grátis até 80 kWh por mês.",
          "nextStep": "Mantenha o CadÚnico em dia. Se o desconto não vier na conta, peça à empresa de luz.",
          "estimate": {
            "type": "energy",
            "kwh": 80,
            "discountPermille": 1000,
            "qualifier": "upTo"
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É só para renda por pessoa de até R$ 810,50.",
        "nextStep": "Veja se você tem direito ao Desconto Social de luz."
      }
    },
    {
      "id": "desconto-social-luz",
      "name": "Desconto Social de luz",
      "source": "#",
      "cases": [
        {
          "when": {
            "properties": {
              "incomePerPersonCentavos": {
                "exclusiveMinimum": 81050,
                "maximum": 162100
              }
            }
          },
          "section": "yes",
          "reason": "Com renda por pessoa entre R$ 810,50 e R$ 1.621, há desconto na luz até 120 kWh por mês.",
          "nextStep": "Faça ou atualize o CadÚnico no CRAS. Depois, confira se o desconto veio na conta.",
          "estimate": {
            "$comment": "Exemption from the CDE charge on up to 120 kWh: about 11.8% off, the government's average estimate.",
            "type": "energy",
            "kwh": 120,
            "discountPermille": 118,
            "qualifier": "upTo"
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É só para renda por pessoa acima de R$ 810,50 e até R$ 1.621.",
        "nextStep": "Se a renda mudar, atualize o CadÚnico no CRAS."
      }
    },
    {
      "id": "gas-do-povo",
      "name": "Gás do Povo",
      "source": "https://www.gov.br/mds/pt-br/acoes-e-programas/gas-do-povo",
      "cases": [
        {
          "when": {
            "properties": {
              "people": {
                "const": 1
              }
            }
          },
          "section": "no",
          "reason": "O programa exige 2 ou mais pessoas na família.",
          "nextStep": "Se mais alguém passar a morar com você, atualize o CadÚnico."
        },
        {
          "when": {
            "$comment": "Secom, Perguntas e respostas sobre o Gás do Povo (2026): families of 2 or 3 people get up to 4 refills a year.",
            "properties": {
              "people": {
                "minimum": 2,
                "maximum": 3
              },
              "incomePerPersonCentavos": {
                "maximum": 81050
              }
            }
          },
          "section": "yes",
          "reason": "Sua família tem 2 ou mais pessoas e renda por pessoa de até R$ 810,50.",
          "nextStep": "Mantenha o CadÚnico em dia e veja nos canais oficiais como pegar o botijão.",
          "estimate": {
            "type": "gas",
            "cylindersPerYear": 4,
            "qualifier": "atLeast"
          }
        },
        {
          "when": {
            "$comment": "Secom, Perguntas e respostas sobre o Gás do Povo (2026): families of 4 or more people get 6 refills a year.",
            "properties": {
              "people": {
                "minimum": 4
              },
              "incomePerPersonCentavos": {
                "maximum": 81050
              }
            }
          },
          "section": "yes",
          "reason": "Sua família tem 2 ou mais pessoas e renda por pessoa de até R$ 810,50.",
          "nextStep": "Mantenha o CadÚnico em dia e veja nos canais oficiais como pegar o botijão.",
          "estimate": {
            "type": "gas",
            "cylindersPerYear": 6,
            "qualifier": "atLeast"
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É só para renda por pessoa de até R$ 810,50.",
        "nextStep": "Se a renda diminuir, atualize o CadÚnico no CRAS."
      }
    },
    {
      "id": "pe-de-meia",
      "name": "Pé-de-Meia",
      "source": "https://www.gov.br/mec/pt-br/pe-de-meia",
      "cases": [
        {
          "when": {
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 81050
              },
              "study": {
                "const": "public-high-school"
              },
              "age": {
                "minimum": 14,
                "maximum": 24
              }
            }
          },
          "section": "yes",
          "reason": "Você estuda em escola pública, tem a idade certa e a renda está dentro do limite.",
          "nextStep": "Em geral não precisa se inscrever: mantenha o CadÚnico em dia e vá às aulas.",
          "estimate": {
            "$comment": "MEC: R$ 200 monthly incentive for students in regular high school.",
            "type": "fixed",
            "monthlyCentavos": 20000,
            "qualifier": "about",
            "detail": "Incentivo por mês de aula. Há também R$ 1.000 por ano concluído, guardados na poupança."
          }
        },
        {
          "when": {
            "$comment": "No estimate: MEC pays EJA students per enrollment and attendance, not monthly.",
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 81050
              },
              "study": {
                "const": "public-eja"
              },
              "age": {
                "minimum": 19,
                "maximum": 24
              }
            }
          },
          "section": "yes",
          "reason": "Você estuda em escola pública, tem a idade certa e a renda está dentro do limite.",
          "nextStep": "Em geral não precisa se inscrever: mantenha o CadÚnico em dia e vá às aulas."
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É para ensino médio público (14 a 24 anos) ou EJA pública (19 a 24 anos), com renda por pessoa de até R$ 810,50.",
        "nextStep": "Se voltar a estudar em escola pública, mantenha o CadÚnico em dia."
      }
    },
    {
      "id": "bpc",
      "name": "BPC (Benefício de Prestação Continuada)",
      "source": "https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais",
      "cases": [
        {
          "when": {
            "$comment": "Lei 8.742/1993, art. 20: 65 anos ou mais, ou deficiência, e renda por pessoa de até 1/4 do salário mínimo.",
            "allOf": [
              {
                "anyOf": [
                  {
                    "properties": {
                      "age": {
                        "minimum": 65
                      }
                    }
                  },
                  {
                    "properties": {
                      "disability": {
                        "const": true
                      }
                    }
                  }
                ]
              },
              {
                "properties": {
                  "incomePerPersonCentavos": {
                    "maximum": 40525
                  }
                }
              }
            ]
          },
          "section": "maybe",
          "reason": "Você tem 65 anos ou mais ou deficiência, e a renda por pessoa é de até R$ 405,25, mas o INSS avalia cada caso.",
          "nextStep": "Faça o CadÚnico no CRAS e peça o BPC no INSS: ligue 135 ou use o app Meu INSS.",
          "estimate": {
            "$comment": "Lei 8.742/1993, art. 20: one minimum wage per month.",
            "type": "fixed",
            "monthlyCentavos": 162100,
            "qualifier": "about",
            "detail": "1 salário mínimo por mês, se o INSS aprovar."
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É para quem tem 65 anos ou mais ou deficiência, com renda por pessoa de até R$ 405,25.",
        "nextStep": "Se a sua situação mudar, procure o CRAS."
      }
    },
    {
      "id": "seguro-desemprego",
      "name": "Seguro-desemprego",
      "source": "https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego",
      "cases": [
        {
          "when": {
            "properties": {
              "dismissal": {
                "const": "up-to-120-days"
              }
            }
          },
          "section": "yes",
          "reason": "URGENTE: peça já, porque o prazo é de até 120 dias depois da demissão.",
          "nextStep": "Peça pelo app Carteira de Trabalho Digital, pelo gov.br ou pelo telefone 158.",
          "estimate": {
            "$comment": "Lei 7.998/1990: 3 to 5 installments; no installment is below the minimum wage.",
            "type": "fixed",
            "monthlyCentavos": 162100,
            "qualifier": "atLeast",
            "detail": "Cada parcela vale pelo menos 1 salário mínimo.",
            "duration": "Por 3 a 5 meses."
          }
        },
        {
          "when": {
            "properties": {
              "dismissal": {
                "const": "over-120-days"
              }
            }
          },
          "section": "no",
          "reason": "O prazo provavelmente venceu: o pedido vale até 120 dias depois da demissão.",
          "nextStep": "Se tiver dúvida sobre a data, ligue 158."
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É só para quem perdeu emprego com carteira assinada, sem justa causa.",
        "nextStep": "Se isso acontecer, peça em até 120 dias."
      }
    },
    {
      "id": "isencao-concursos",
      "name": "Isenção de taxa em concursos",
      "source": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13656.htm",
      "cases": [
        {
          "when": {
            "$comment": "Lei 13.656/2018, art. 1º, I: família no CadÚnico com renda por pessoa de até meio salário mínimo.",
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 81050
              }
            }
          },
          "section": "yes",
          "reason": "A renda por pessoa é de até R$ 810,50, o limite da lei para concursos federais.",
          "nextStep": "Faça o CadÚnico no CRAS. Na inscrição do concurso, peça a isenção com o seu NIS."
        },
        {
          "when": {
            "$comment": "Enters CadÚnico by total income only; the federal law asks for income per person. Depends on each edital.",
            "properties": {
              "totalIncomeCentavos": {
                "maximum": 486300
              }
            }
          },
          "section": "maybe",
          "reason": "Sua casa entra no CadÚnico pela renda total, mas a lei federal pede renda por pessoa de até R$ 810,50.",
          "nextStep": "Leia as regras de isenção no edital do concurso."
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "A renda passa do limite do CadÚnico.",
        "nextStep": "Se a renda diminuir, faça o CadÚnico no CRAS."
      }
    },
    {
      "id": "pix-mei",
      "name": "Pix MEI",
      "source": "#",
      "cases": [
        {
          "when": {
            "properties": {
              "mei": {
                "const": true
              }
            }
          },
          "section": "maybe",
          "reason": "Foi anunciado, mas ainda não existe.",
          "nextStep": "Cuidado com golpes: não pague nada nem passe seus dados a quem oferecer."
        }
      ],
      "otherwise": null
    },
    {
      "id": "desenrola-familias",
      "name": "Desenrola (famílias)",
      "source": "https://desenrola.gov.br",
      "cases": [],
      "otherwise": {
        "section": "no",
        "reason": "O programa foi encerrado em 31/08/2026.",
        "nextStep": "Para negociar dívidas, procure direto o banco ou a loja."
      }
    }
  ]
};

// Every answer is a tap. Number answers become options: people are tiles ("10 ou mais" opens a
// counter), and income and age are ranges cut exactly where the rules compare them.
const QUESTIONS = [
  {
    id: 'people',
    kind: 'people',
    title: 'Quantas pessoas moram na sua casa, contando com você?',
    help: 'Conte todo mundo, até as crianças.',
    // The income options depend on the number of people, so a new count asks for income again.
    clears: ['totalIncomeCentavos'],
  },
  {
    id: 'totalIncomeCentavos',
    kind: 'income',
    title: 'Quanto a sua casa ganha por mês, somando todo mundo?',
    help: 'Some salários, bicos, pensões e aposentadorias. Se ninguém ganha nada, escolha a primeira opção.',
  },
  {
    id: 'age',
    kind: 'age',
    title: 'Quantos anos você tem?',
    help: '',
  },
  {
    id: 'study',
    kind: 'choice',
    title: 'Você está estudando?',
    help: 'EJA é a Educação de Jovens e Adultos.',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'public-high-school', label: 'Ensino médio em escola pública' },
      { value: 'public-eja', label: 'EJA em escola pública' },
      { value: 'college', label: 'Faculdade' },
    ],
  },
  {
    id: 'dismissal',
    kind: 'choice',
    title: 'Você perdeu um emprego com carteira assinada, sem justa causa?',
    help: '120 dias são mais ou menos 4 meses.',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'up-to-120-days', label: 'Sim, há 120 dias ou menos' },
      { value: 'over-120-days', label: 'Sim, há mais de 120 dias' },
    ],
  },
  {
    id: 'disability',
    kind: 'choice',
    title: 'Você tem deficiência ou problema de saúde que impede de trabalhar?',
    help: 'A deficiência pode ser física, mental, intelectual ou sensorial.',
    options: [
      { value: false, label: 'Não' },
      { value: true, label: 'Sim' },
    ],
  },
  {
    id: 'mei',
    kind: 'choice',
    title: 'Você tem CNPJ de MEI?',
    help: 'MEI é o microempreendedor individual.',
    options: [
      { value: false, label: 'Não' },
      { value: true, label: 'Sim' },
    ],
  },
];

const PEOPLE_TILES = 9;
const PEOPLE_MAX = 30;
const MORE_PEOPLE = 'more';
const AGE_MAX = 120;

const SECTIONS = ['yes', 'maybe', 'no'];
const QUALIFIERS = { atLeast: 'a partir de', upTo: 'até', about: 'cerca de' };

function choiceValues(questionId) {
  return QUESTIONS.find((question) => question.id === questionId).options.map((option) => option.value);
}

const NUMBER_COMPARISONS = ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'];

// Every fact a rule may use, with what a rule may check about it.
const FACTS = {
  people: { comparisons: NUMBER_COMPARISONS },
  totalIncomeCentavos: { comparisons: NUMBER_COMPARISONS },
  // Rounded up (see ceilDiv), so only "at most" and "more than" stay exact.
  incomePerPersonCentavos: { comparisons: ['maximum', 'exclusiveMinimum'] },
  age: { comparisons: NUMBER_COMPARISONS },
  study: { values: choiceValues('study') },
  dismissal: { values: choiceValues('dismissal') },
  disability: { values: choiceValues('disability') },
  mei: { values: choiceValues('mei') },
};

// ---------- Pure logic: options, facts and rules (no DOM) ----------

// Integer division rounded up. For a limit L in whole centavos, ceilDiv(total, n) <= L exactly
// when total / n <= L, and ceilDiv(total, n) > L exactly when total / n > L.
function ceilDiv(dividend, divisor) {
  const remainder = dividend % divisor;
  return (dividend - remainder) / divisor + (remainder === 0 ? 0 : 1);
}

function deriveFacts(answers) {
  return {
    people: answers.people,
    totalIncomeCentavos: answers.totalIncomeCentavos,
    incomePerPersonCentavos: ceilDiv(answers.totalIncomeCentavos, answers.people),
    age: answers.age,
    study: answers.study,
    dismissal: answers.dismissal,
    disability: answers.disability,
    mei: answers.mei,
  };
}

const INTEGER_FORMAT = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

// Formats without floating-point division, hiding zero centavos: R$ 1.621 or R$ 1.215,75
function formatMoney(centavos) {
  const cents = centavos % 100;
  const reais = 'R$ ' + INTEGER_FORMAT.format((centavos - cents) / 100);
  return cents === 0 ? reais : reais + ',' + String(cents).padStart(2, '0');
}

// R$ 0,815: prices per kWh have three decimal places, so they are kept in thousandths of a real.
function formatMilliReais(milliReais) {
  const rest = milliReais % 1000;
  return 'R$\u00a0' + INTEGER_FORMAT.format((milliReais - rest) / 1000) + ',' + String(rest).padStart(3, '0');
}

// 118 per mille is "11,8%".
function formatPermille(permille) {
  const rest = permille % 10;
  return (permille - rest) / 10 + (rest === 0 ? '' : ',' + rest) + '%';
}

function floorDiv(dividend, divisor) {
  return (dividend - (dividend % divisor)) / divisor;
}

// A cut c splits a fact's values into "<= c" and "> c". Every comparison a rule makes is one of
// these splits, so all values between two neighboring cuts give exactly the same results.
function collectCuts(rules) {
  const cuts = {};
  const add = (name, cut) => {
    cuts[name] ??= [];
    cuts[name].push(cut);
  };
  const visitFact = (schema, name) => {
    for (const [keyword, value] of Object.entries(schema)) {
      if (keyword === 'maximum' || keyword === 'exclusiveMinimum') add(name, value);
      else if (keyword === 'minimum' || keyword === 'exclusiveMaximum') add(name, value - 1);
      else if (keyword === 'const' && typeof value === 'number') [value - 1, value].forEach((cut) => add(name, cut));
      else if (keyword === 'enum') value.filter((item) => typeof item === 'number').forEach((item) => [item - 1, item].forEach((cut) => add(name, cut)));
      else if (keyword === 'allOf' || keyword === 'anyOf') value.forEach((sub) => visitFact(sub, name));
      else if (keyword === 'not') visitFact(value, name);
    }
  };
  const visit = (schema) => {
    for (const [keyword, value] of Object.entries(schema)) {
      if (keyword === 'properties') Object.entries(value).forEach(([name, sub]) => visitFact(sub, name));
      else if (keyword === 'allOf' || keyword === 'anyOf') value.forEach(visit);
      else if (keyword === 'not') visit(value);
    }
  };
  for (const program of rules.programs) {
    for (const item of program.cases) visit(item.when);
  }
  return cuts;
}

// Splits [min, max] at the cuts into ranges { from, to }. max null means no upper limit.
function ranges(cuts, min, max) {
  const points = [...new Set(cuts)]
    .filter((cut) => cut >= min && (max === null || cut < max))
    .sort((a, b) => a - b);
  const result = [];
  let from = min;
  for (const cut of points) {
    result.push({ from, to: cut });
    from = cut + 1;
  }
  result.push({ from, to: max });
  return result;
}

function peopleOptions() {
  const options = [{ value: 1, label: 'Só eu' }];
  for (let count = 2; count <= PEOPLE_TILES; count++) options.push({ value: count, label: String(count) });
  options.push({ value: MORE_PEOPLE, label: PEOPLE_TILES + 1 + ' ou mais' });
  return options;
}

// ceilDiv(total, people) <= c exactly when total <= c * people, so a per-person cut becomes a
// cut on the total. Each option's value is the lowest total in its range.
function incomeOptions(cuts, people) {
  const totals = [
    ...(cuts.totalIncomeCentavos ?? []),
    ...(cuts.incomePerPersonCentavos ?? []).map((cut) => cut * people),
  ];
  return ranges(totals, 0, null).map(({ from, to }) => ({ value: from, label: incomeLabel(from, to) }));
}

function incomeLabel(from, to) {
  if (from === 0 && to === null) return 'Qualquer valor';
  if (from === 0) return 'Até ' + formatMoney(to);
  if (to === null) return 'Mais de ' + formatMoney(from - 1);
  return 'Mais de ' + formatMoney(from - 1) + ' até ' + formatMoney(to);
}

function ageOptions(cuts) {
  return ranges(cuts.age ?? [], 0, AGE_MAX).map(({ from, to }) => ({ value: from, label: ageLabel(from, to) }));
}

function ageLabel(from, to) {
  if (from === to) return from + ' anos';
  if (from === 0) return 'Menos de ' + (to + 1) + ' anos';
  if (to === AGE_MAX) return from + ' anos ou mais';
  return from + ' a ' + to + ' anos';
}

function optionsFor(question, cuts, answers) {
  switch (question.kind) {
    case 'people': return peopleOptions();
    case 'income': return incomeOptions(cuts, answers.people);
    case 'age': return ageOptions(cuts);
    default: return question.options;
  }
}

// Index of the option holding the answer, or -1 when there is no answer yet.
function selectedIndex(question, options, answer) {
  if (answer === undefined) return -1;
  const value = question.kind === 'people' && answer > PEOPLE_TILES ? MORE_PEOPLE : answer;
  return options.findIndex((option) => option.value === value);
}

class RulesError extends Error {}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkObject(value, path) {
  if (!isPlainObject(value)) throw new RulesError(path + ': expected an object');
}

function checkText(value, path) {
  if (typeof value !== 'string' || value.trim() === '') throw new RulesError(path + ': expected non-empty text');
}

function checkList(value, path) {
  if (!Array.isArray(value) || value.length === 0) throw new RulesError(path + ': expected a non-empty list');
}

function checkFactValue(value, fact, path) {
  const valid = fact.values === undefined ? Number.isSafeInteger(value) : fact.values.includes(value);
  if (!valid) throw new RulesError(path + ': invalid value ' + JSON.stringify(value));
}

// Rule conditions are a small subset of JSON Schema. Checking them up front means a typo in
// regras.json fails loudly when the rules load instead of silently changing a result.
function checkCondition(schema, path) {
  checkObject(schema, path);
  for (const [keyword, value] of Object.entries(schema)) {
    const at = path + '.' + keyword;
    if (keyword === '$comment') {
      checkText(value, at);
    } else if (keyword === 'properties') {
      checkObject(value, at);
      for (const [name, factSchema] of Object.entries(value)) {
        if (!Object.hasOwn(FACTS, name)) throw new RulesError(at + ': unknown fact "' + name + '"');
        checkFactCondition(factSchema, FACTS[name], at + '.' + name);
      }
    } else if (keyword === 'allOf' || keyword === 'anyOf') {
      checkList(value, at);
      value.forEach((item, index) => checkCondition(item, at + '[' + index + ']'));
    } else if (keyword === 'not') {
      checkCondition(value, at);
    } else {
      throw new RulesError(at + ': unsupported keyword');
    }
  }
}

function checkFactCondition(schema, fact, path) {
  checkObject(schema, path);
  for (const [keyword, value] of Object.entries(schema)) {
    const at = path + '.' + keyword;
    if (keyword === '$comment') {
      checkText(value, at);
    } else if (keyword === 'const') {
      checkFactValue(value, fact, at);
    } else if (keyword === 'enum') {
      checkList(value, at);
      value.forEach((item) => checkFactValue(item, fact, at));
    } else if (fact.comparisons !== undefined && fact.comparisons.includes(keyword)) {
      if (!Number.isSafeInteger(value)) throw new RulesError(at + ': expected a whole number');
    } else if (keyword === 'allOf' || keyword === 'anyOf') {
      checkList(value, at);
      value.forEach((item, index) => checkFactCondition(item, fact, at + '[' + index + ']'));
    } else if (keyword === 'not') {
      checkFactCondition(value, fact, at);
    } else {
      throw new RulesError(at + ': unsupported keyword for this fact');
    }
  }
}

function checkPositive(value, path) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RulesError(path + ': expected a positive whole number');
}

function checkEstimate(estimate, path) {
  checkObject(estimate, path);
  if (!Object.hasOwn(QUALIFIERS, estimate.qualifier)) {
    throw new RulesError(path + '.qualifier: expected ' + Object.keys(QUALIFIERS).join(', '));
  }
  if (estimate.duration !== undefined) checkText(estimate.duration, path + '.duration');
  if (estimate.type === 'fixed') {
    checkPositive(estimate.monthlyCentavos, path + '.monthlyCentavos');
    checkText(estimate.detail, path + '.detail');
  } else if (estimate.type === 'energy') {
    checkPositive(estimate.kwh, path + '.kwh');
    checkPositive(estimate.discountPermille, path + '.discountPermille');
    if (estimate.discountPermille > 1000) throw new RulesError(path + '.discountPermille: at most 1000');
  } else if (estimate.type === 'gas') {
    checkPositive(estimate.cylindersPerYear, path + '.cylindersPerYear');
  } else {
    throw new RulesError(path + '.type: expected fixed, energy or gas');
  }
}

function checkOutcome(outcome, path) {
  checkObject(outcome, path);
  if (!SECTIONS.includes(outcome.section)) throw new RulesError(path + '.section: expected ' + SECTIONS.join(', '));
  checkText(outcome.reason, path + '.reason');
  checkText(outcome.nextStep, path + '.nextStep');
  if (outcome.estimate !== undefined) {
    // A value only makes sense where the user may be entitled.
    if (outcome.section === 'no') throw new RulesError(path + '.estimate: not allowed in section "no"');
    checkEstimate(outcome.estimate, path + '.estimate');
  }
}

function parseRules(data) {
  checkObject(data, 'rules');
  checkText(data.revision, 'rules.revision');
  checkObject(data.prices, 'rules.prices');
  checkPositive(data.prices.kwhMilliReais, 'rules.prices.kwhMilliReais');
  checkPositive(data.prices.gasCylinderCentavos, 'rules.prices.gasCylinderCentavos');
  checkList(data.programs, 'rules.programs');
  const ids = new Set();
  data.programs.forEach((program, index) => {
    const at = 'rules.programs[' + index + ']';
    checkObject(program, at);
    checkText(program.id, at + '.id');
    if (ids.has(program.id)) throw new RulesError(at + '.id: duplicate "' + program.id + '"');
    ids.add(program.id);
    checkText(program.name, at + '.name');
    if (program.source !== '#' && !/^https:\/\/\S+$/.test(program.source)) {
      throw new RulesError(at + '.source: expected "#" or an https:// link');
    }
    if (!Array.isArray(program.cases)) throw new RulesError(at + '.cases: expected a list');
    program.cases.forEach((item, caseIndex) => {
      const caseAt = at + '.cases[' + caseIndex + ']';
      checkCondition(item.when, caseAt + '.when');
      checkOutcome(item, caseAt);
    });
    // null hides the program when no case matches; it must be written out, never left missing.
    if (program.otherwise !== null) checkOutcome(program.otherwise, at + '.otherwise');
  });
  return data;
}

function checkFacts(facts) {
  for (const [name, fact] of Object.entries(FACTS)) {
    checkFactValue(facts[name], fact, 'facts.' + name);
  }
}

function matches(schema, instance) {
  return Object.entries(schema).every(([keyword, value]) => {
    switch (keyword) {
      case '$comment': return true;
      case 'properties': return Object.entries(value).every(([name, sub]) => matches(sub, instance[name]));
      case 'allOf': return value.every((sub) => matches(sub, instance));
      case 'anyOf': return value.some((sub) => matches(sub, instance));
      case 'not': return !matches(value, instance);
      case 'const': return instance === value;
      case 'enum': return value.includes(instance);
      case 'minimum': return instance >= value;
      case 'maximum': return instance <= value;
      case 'exclusiveMinimum': return instance > value;
      case 'exclusiveMaximum': return instance < value;
      default: throw new RulesError('Unsupported keyword "' + keyword + '"');
    }
  });
}

// The first matching case wins; otherwise the program's "otherwise" applies (null = not shown).
function evaluateRules(rules, facts) {
  checkFacts(facts);
  const groups = { yes: [], maybe: [], no: [] };
  for (const program of rules.programs) {
    const matched = program.cases.find((item) => matches(item.when, facts));
    const outcome = matched === undefined ? program.otherwise : matched;
    if (outcome === null) continue;
    groups[outcome.section].push({
      name: program.name,
      reason: outcome.reason,
      nextStep: outcome.nextStep,
      source: program.source,
      estimate: outcome.estimate ?? null,
    });
  }
  return groups;
}

// Monthly value of one estimate, rounded down so the total never promises more than the data gives.
function estimateAmount(estimate, prices) {
  switch (estimate.type) {
    case 'fixed':
      return { monthlyCentavos: estimate.monthlyCentavos, detail: estimate.detail };
    case 'energy': {
      // kWh × thousandths of a real per kWh × per mille discount / 10 000 = centavos.
      const monthlyCentavos = floorDiv(estimate.kwh * prices.kwhMilliReais * estimate.discountPermille, 10000);
      const price = formatMilliReais(prices.kwhMilliReais) + ' por kWh (tarifa média do país, sem impostos)';
      const detail = estimate.discountPermille === 1000
        ? estimate.kwh + ' kWh grátis por mês × ' + price + '.'
        : formatPermille(estimate.discountPermille) + ' de desconto em ' + estimate.kwh + ' kWh por mês × ' + price + '.';
      return { monthlyCentavos, detail };
    }
    case 'gas':
      return {
        monthlyCentavos: floorDiv(estimate.cylindersPerYear * prices.gasCylinderCentavos, 12),
        detail: estimate.cylindersPerYear + ' botijões grátis por ano × ' + formatMoney(prices.gasCylinderCentavos) +
          ' (menor preço de referência do país), divididos por 12 meses.',
      };
    default:
      throw new RulesError('Unknown estimate type "' + estimate.type + '"');
  }
}

// Only recurring values of "yes" programs add up to the monthly total. Time-limited values and
// "maybe" programs are listed apart, so the total does not promise what may not come.
function estimateSummary(groups, prices) {
  const rows = (items) => items
    .filter((item) => item.estimate !== null)
    .map((item) => ({
      name: item.name,
      qualifier: item.estimate.qualifier,
      duration: item.estimate.duration ?? null,
      ...estimateAmount(item.estimate, prices),
    }));
  const yes = rows(groups.yes);
  const monthly = yes.filter((row) => row.duration === null);
  return {
    monthly,
    temporary: yes.filter((row) => row.duration !== null),
    ifApproved: rows(groups.maybe),
    totalCentavos: monthly.reduce((sum, row) => sum + row.monthlyCentavos, 0),
  };
}

// ---------- Loading the rules ----------

const RULES_TIMEOUT_MS = 5000;

async function fetchRules() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), RULES_TIMEOUT_MS);
  try {
    const response = await fetch('regras.json', { signal: controller.signal, cache: 'no-cache' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function loadRules() {
  try {
    return parseRules(await fetchRules());
  } catch {
    // Expected on file:// and when offline. The embedded copy has the same rules, so the user
    // gets the same result; if it is invalid too, the error reaches the error screen.
    return parseRules(EMBEDDED_RULES);
  }
}

// ---------- Screens ----------

const INTRO_STEP = -1;
const RESULTS_STEP = QUESTIONS.length;
// The intro also accepts an empty hash, so the address people share and search engines see stays clean.
const INTRO_HASHES = ['', '#inicio'];

const state = {
  rules: null,
  cuts: null,
  intro: null,
  revealObserver: null,
  answers: {},
  renderedHash: null,
  renderedStep: null,
};

function hashForStep(step) {
  if (step === INTRO_STEP) return '#inicio';
  return step === RESULTS_STEP ? '#resultado' : '#pergunta-' + (step + 1);
}

function stepFromHash(hash) {
  if (hash === '#resultado') return RESULTS_STEP;
  const match = /^#pergunta-(\d+)$/.exec(hash);
  if (match === null) return INTRO_STEP;
  const step = Number(match[1]) - 1;
  return step >= 0 && step < QUESTIONS.length ? step : INTRO_STEP;
}

function firstUnansweredStep(answers) {
  const index = QUESTIONS.findIndex((question) => !Object.hasOwn(answers, question.id));
  return index === -1 ? RESULTS_STEP : index;
}

function cloneTemplate(id) {
  return document.getElementById(id).content.cloneNode(true);
}

// transition is null on the first screen, otherwise 'forward' or 'back'.
function showScreen(fragment, transition) {
  const main = document.getElementById('tela');
  main.replaceChildren(fragment);
  placeMascots(main);
  if (transition === null) return;
  main.firstElementChild.classList.add('enter-' + transition);
  window.scrollTo(0, 0);
  main.querySelector('h1').focus({ preventScroll: true });
}

// The mascot is drawn once in #tpl-mascot and copied into each screen's [data-mascot] slot.
function placeMascots(root) {
  for (const slot of root.querySelectorAll('[data-mascot]')) slot.replaceChildren(cloneTemplate('tpl-mascot'));
}

// Waves on the intro, hops on every step forward and celebrates on the results.
function cheerMascot(step, transition) {
  const mascot = document.querySelector('#tela .mascot');
  if (mascot === null) return;
  if (step === INTRO_STEP) {
    mascot.classList.add('is-waving');
  } else if (step === RESULTS_STEP) {
    mascot.classList.add('is-happy');
    if (transition === 'forward') mascot.classList.add('is-celebrating');
  } else if (transition === 'forward') {
    mascot.classList.add('is-hopping');
  }
}

// Shows each .reveal block once it scrolls into view. Screens without .reveal blocks just stop the old observer.
function revealOnScroll(root) {
  state.revealObserver?.disconnect();
  const blocks = root.querySelectorAll('.reveal');
  state.revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  blocks.forEach((block) => state.revealObserver.observe(block));
}

function render(navigated) {
  // Questions open only in order. Answers live in memory, so after a reload the user starts over.
  const requested = stepFromHash(location.hash);
  const step = requested === INTRO_STEP ? INTRO_STEP : Math.min(requested, firstUnansweredStep(state.answers));
  const onStep = step === INTRO_STEP ? INTRO_HASHES.includes(location.hash) : location.hash === hashForStep(step);
  if (!onStep) location.replace(hashForStep(step));
  state.renderedHash = onStep ? location.hash : hashForStep(step);
  const transition = !navigated ? null : step >= state.renderedStep ? 'forward' : 'back';
  state.renderedStep = step;
  document.body.classList.toggle('is-intro', step === INTRO_STEP);
  try {
    showScreen(screenFor(step), transition);
    cheerMascot(step, transition);
    revealOnScroll(document.getElementById('tela'));
  } catch (error) {
    showScreen(cloneTemplate('tpl-error'), transition);
    throw error;
  }
}

function screenFor(step) {
  if (step === INTRO_STEP) return state.intro.cloneNode(true);
  return step === RESULTS_STEP ? resultsScreen() : questionScreen(step);
}

function questionScreen(step) {
  const question = QUESTIONS[step];
  const options = optionsFor(question, state.cuts, state.answers);
  const answer = state.answers[question.id];
  const fragment = cloneTemplate('tpl-question');
  const form = fragment.querySelector('form');

  fragment.querySelector('.step-number').textContent = String(step + 1);
  fragment.querySelector('.step-total').textContent = String(QUESTIONS.length);
  const progress = fragment.querySelector('progress');
  progress.max = QUESTIONS.length;
  progress.value = step + 1;
  fragment.querySelector('h1').textContent = question.title;
  const help = fragment.querySelector('.help');
  help.textContent = question.help;
  help.hidden = question.help === '';

  const back = fragment.querySelector('.back');
  // Hidden but still taking space, so the progress bar does not move on the first question.
  back.classList.toggle('invisible', step === 0);
  back.addEventListener('click', () => history.back());

  const fieldset = fragment.querySelector('.options');
  fieldset.classList.toggle('options-grid', question.kind === 'people');
  const current = selectedIndex(question, options, answer);
  options.forEach((option, index) => fieldset.append(optionCard(option, index, index === current)));

  const counter = question.kind === 'people' ? peopleCounter(answer) : null;
  const chosen = () => {
    const checked = form.querySelector('input[name="answer"]:checked');
    return checked === null ? null : options[Number(checked.value)];
  };
  const submit = fragment.querySelector('button[type="submit"]');
  const update = () => {
    const option = chosen();
    submit.disabled = option === null;
    if (counter !== null) counter.element.hidden = option === null || option.value !== MORE_PEOPLE;
  };
  if (counter !== null) fieldset.after(counter.element);
  fieldset.addEventListener('change', () => {
    update();
    if (counter !== null && !counter.element.hidden) counter.element.scrollIntoView({ block: 'nearest' });
  });
  update();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const option = chosen();
    if (option === null) return; // Continuar stays disabled until an option is chosen.
    saveAnswer(question, option.value === MORE_PEOPLE ? counter.count() : option.value);
    location.hash = hashForStep(step + 1);
  });
  return fragment;
}

function optionCard(option, index, checked) {
  const label = cloneTemplate('tpl-option').firstElementChild;
  const input = label.querySelector('input');
  input.value = String(index);
  input.checked = checked;
  label.querySelector('.option-label').textContent = option.label;
  return label;
}

// Counter for households larger than the tiles. The buttons stay focusable at the limits
// (aria-disabled), so keyboard focus is not lost.
function peopleCounter(answer) {
  const element = cloneTemplate('tpl-counter').firstElementChild;
  const number = element.querySelector('.counter-number');
  const minus = element.querySelector('[data-change="-1"]');
  const plus = element.querySelector('[data-change="1"]');
  const min = PEOPLE_TILES + 1;
  let count = answer !== undefined && answer >= min ? answer : min;
  const show = () => {
    number.textContent = String(count);
    minus.setAttribute('aria-disabled', String(count <= min));
    plus.setAttribute('aria-disabled', String(count >= PEOPLE_MAX));
  };
  const change = (next) => {
    if (next === count) return;
    count = next;
    show();
    // Restarts the pop animation: removing the class and reading layout lets it play again.
    number.classList.remove('is-popping');
    void number.offsetWidth;
    number.classList.add('is-popping');
  };
  minus.addEventListener('click', () => change(Math.max(min, count - 1)));
  plus.addEventListener('click', () => change(Math.min(PEOPLE_MAX, count + 1)));
  show();
  return { element, count: () => count };
}

function saveAnswer(question, value) {
  if (state.answers[question.id] !== value) {
    for (const id of question.clears ?? []) delete state.answers[id];
  }
  state.answers[question.id] = value;
}

function resultsScreen() {
  const facts = deriveFacts(state.answers);
  const groups = evaluateRules(state.rules, facts);
  const income = incomeOptions(state.cuts, facts.people).find((option) => option.value === facts.totalIncomeCentavos);
  if (income === undefined) throw new Error('The income answer matches no income option');

  const fragment = cloneTemplate('tpl-results');
  showEarnings(fragment.querySelector('.earnings'), estimateSummary(groups, state.rules.prices));
  fragment.querySelector('.summary-people').textContent = String(facts.people);
  fragment.querySelector('.summary-income').textContent = income.label;
  for (const section of SECTIONS) {
    const list = fragment.querySelector('[data-section="' + section + '"]');
    for (const item of groups[section]) list.append(resultItem(item));
    list.hidden = groups[section].length === 0;
    fragment.querySelector('[data-empty="' + section + '"]').hidden = groups[section].length > 0;
  }
  fragment.querySelector('.restart').addEventListener('click', () => {
    state.answers = {};
    location.hash = hashForStep(0);
  });
  return fragment;
}

const EARNINGS_PARTS = ['monthly', 'temporary', 'ifApproved'];

function showEarnings(card, summary) {
  if (EARNINGS_PARTS.every((part) => summary[part].length === 0)) {
    card.remove();
    return;
  }
  card.querySelector('.earnings-total').hidden = summary.totalCentavos === 0;
  // Whole reais, rounded down.
  card.querySelector('.earnings-sum').textContent = formatMoney(floorDiv(summary.totalCentavos, 100) * 100);
  for (const part of EARNINGS_PARTS) {
    const container = card.querySelector('[data-part="' + part + '"]');
    container.hidden = summary[part].length === 0;
    const list = container.querySelector('.earnings-list');
    for (const row of summary[part]) list.append(earningsRow(row));
  }
}

function earningsRow(row) {
  const node = cloneTemplate('tpl-earnings-row').firstElementChild;
  node.querySelector('.earnings-name').textContent = row.name;
  node.querySelector('.earnings-value').textContent = QUALIFIERS[row.qualifier] + ' ' + formatMoney(row.monthlyCentavos) + '/mês';
  node.querySelector('.earnings-detail').textContent = row.duration === null ? row.detail : row.detail + ' ' + row.duration;
  return node;
}

function resultItem(item) {
  const node = cloneTemplate('tpl-item').firstElementChild;
  node.querySelector('.item-name').textContent = item.name;
  // Keep "R$" on the same line as the amount.
  node.querySelector('.item-reason').textContent = item.reason.replaceAll('R$ ', 'R$ ');
  node.querySelector('.item-next-text').textContent = item.nextStep;
  const link = node.querySelector('.item-source-link');
  // "#" marks a source still to be confirmed; linking to it would reset the questionnaire.
  if (item.source === '#') {
    link.remove();
  } else {
    link.href = item.source;
    node.querySelector('.item-source-pending').remove();
  }
  return node;
}

// Restarts the bounce animation: removing the class and reading layout lets it play again.
function bounce(element) {
  element.classList.remove('is-bouncing');
  void element.offsetWidth;
  element.classList.add('is-bouncing');
}

async function start() {
  // iOS Safari only applies :active (the press-down effect) when a touch listener exists.
  document.addEventListener('touchstart', () => {}, { passive: true });
  // Buttons bounce when released. Options have their own "pop" in CSS.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.button, .counter-button, .back');
    if (button !== null && button.getAttribute('aria-disabled') !== 'true') bounce(button);
  });
  state.intro = document.getElementById('inicio').cloneNode(true);
  // Lets CSS hide the blocks that appear while scrolling; without JavaScript they stay visible.
  document.documentElement.classList.add('js');
  // Delegated, so the intro buttons work on the static intro and on its copies, even before the rules load.
  document.getElementById('tela').addEventListener('click', (event) => {
    if (event.target.closest('[data-start]') !== null) location.hash = hashForStep(0);
    if (event.target.closest('[data-scroll-more]') !== null) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('saiba-mais').scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
  });
  try {
    state.rules = await loadRules();
    state.cuts = collectCuts(state.rules);
  } catch (error) {
    showScreen(cloneTemplate('tpl-error'), null);
    throw error;
  }
  window.addEventListener('hashchange', () => {
    if (location.hash !== state.renderedHash) render(true);
  });
  render(false);
}

// The guard lets the pure logic above be loaded outside a browser.
if (typeof document !== 'undefined') start();
