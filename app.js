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
          "reason": "A renda da sua casa está no limite: até R$ 810,50 por pessoa ou até R$ 4.863 no total.",
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
          "reason": "Você está no ensino médio público, tem entre 14 e 24 anos e a renda por pessoa é de até R$ 810,50.",
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
          "reason": "Você está na EJA pública, tem entre 19 e 24 anos e a renda por pessoa é de até R$ 810,50.",
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
          "reason": "URGENTE: você perdeu o emprego com carteira assinada há até 120 dias, que é o prazo para pedir.",
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
      "id": "farmacia-popular",
      "name": "Farmácia Popular",
      "source": "https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular",
      "cases": [
        {
          "when": {
            "$comment": "Ministério da Saúde: geriatric diapers for people aged 60+ or with a disability.",
            "anyOf": [
              {
                "properties": {
                  "age": {
                    "minimum": 60
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
          "section": "yes",
          "reason": "Qualquer pessoa com receita pega os remédios da lista de graça. Como você tem 60 anos ou mais ou deficiência, também pode pegar fraldas geriátricas.",
          "nextStep": "Vá a uma farmácia com o selo \"Aqui Tem Farmácia Popular\" levando a receita (do SUS ou particular), documento com foto e CPF. Para as fraldas, leve também receita ou laudo.",
          "estimate": {
            "type": "variable",
            "headline": "Remédios e fraldas grátis",
            "detail": "Não entra na soma porque depende do que você usa: cada remédio ou item da lista sai de graça, então você economiza o preço que pagaria na farmácia."
          }
        }
      ],
      "otherwise": {
        "section": "yes",
        "reason": "Qualquer pessoa com receita médica tem direito: remédios para pressão alta, diabetes, asma, colesterol e outros saem de graça.",
        "nextStep": "Vá a uma farmácia com o selo \"Aqui Tem Farmácia Popular\" levando a receita (do SUS ou particular), documento com foto e CPF.",
        "estimate": {
          "type": "variable",
          "headline": "Remédios grátis",
          "detail": "Não entra na soma porque depende dos remédios que você usa: cada item da lista sai de graça, então você economiza o preço que pagaria na farmácia."
        }
      }
    },
    {
      "id": "carteira-pessoa-idosa",
      "name": "Carteira da Pessoa Idosa",
      "source": "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm",
      "cases": [
        {
          "when": {
            "$comment": "Lei 10.741/2003, art. 40: 2 free seats per interstate bus for people aged 60+ with income up to 2 minimum wages; at least 50% off when they are taken. The household total caps the person's own income.",
            "properties": {
              "age": {
                "minimum": 60
              },
              "totalIncomeCentavos": {
                "maximum": 324200
              }
            }
          },
          "section": "yes",
          "reason": "Você tem 60 anos ou mais e a renda da casa toda é de até 2 salários mínimos (R$ 3.242), então a sua também é.",
          "nextStep": "Peça a carteira de graça no CRAS ou no site carteiraidoso.cidadania.gov.br.",
          "estimate": {
            "type": "variable",
            "headline": "Passagem grátis ou 50%",
            "detail": "Não entra na soma porque depende das viagens que você fizer: em ônibus interestaduais há 2 vagas grátis por ônibus e, se acabarem, você paga no máximo metade da passagem."
          }
        },
        {
          "when": {
            "properties": {
              "age": {
                "minimum": 60
              }
            }
          },
          "section": "maybe",
          "reason": "Você tem 60 anos ou mais. Tem direito se a sua renda, só a sua, for de até 2 salários mínimos (R$ 3.242).",
          "nextStep": "Se a sua renda estiver no limite, peça a carteira no CRAS ou no site carteiraidoso.cidadania.gov.br.",
          "estimate": {
            "type": "variable",
            "headline": "Passagem grátis ou 50%",
            "detail": "Não entra na soma porque depende das viagens que você fizer: em ônibus interestaduais há 2 vagas grátis por ônibus e, se acabarem, você paga no máximo metade da passagem."
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É para quem tem 60 anos ou mais e renda de até 2 salários mínimos (R$ 3.242).",
        "nextStep": "Ao completar 60 anos, veja se a sua renda está no limite."
      }
    },
    {
      "id": "id-jovem",
      "name": "ID Jovem",
      "source": "https://idjovem.juventude.gov.br/",
      "cases": [
        {
          "when": {
            "$comment": "Decreto 8.537/2015, art. 2º, I: aged 15 to 29, family in CadÚnico with monthly income up to 2 minimum wages.",
            "properties": {
              "age": {
                "minimum": 15,
                "maximum": 29
              },
              "totalIncomeCentavos": {
                "maximum": 324200
              }
            }
          },
          "section": "yes",
          "reason": "Você tem entre 15 e 29 anos e a renda da casa é de até 2 salários mínimos (R$ 3.242).",
          "nextStep": "Faça ou atualize o CadÚnico no CRAS e emita a ID Jovem de graça no site ou no app ID Jovem.",
          "estimate": {
            "type": "variable",
            "headline": "Meia-entrada e passagem grátis ou 50%",
            "detail": "Não entra na soma porque depende do uso: você paga metade em cinema, shows e jogos e tem vagas grátis ou com 50% de desconto em ônibus interestaduais."
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É para jovens de 15 a 29 anos de família no CadÚnico com renda de até 2 salários mínimos (R$ 3.242).",
        "nextStep": "Se a sua situação mudar, procure o CRAS."
      }
    },
    {
      "id": "minha-casa-minha-vida",
      "name": "Minha Casa, Minha Vida",
      "source": "https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/sobre-o-minha-casa-minha-vida-1",
      "cases": [
        {
          "when": {
            "$comment": "Lei 14.620/2023: no subsidy for people who already own a home or hold a housing loan.",
            "properties": {
              "ownsHome": {
                "const": true
              }
            }
          },
          "section": "no",
          "reason": "O programa é para famílias que ainda não têm casa própria nem financiamento de casa.",
          "nextStep": "Nada a fazer neste programa agora."
        },
        {
          "when": {
            "$comment": "Portaria MCID 333/2026, urban Faixa 1: gross household income up to R$ 3.200.",
            "properties": {
              "totalIncomeCentavos": {
                "maximum": 320000
              }
            }
          },
          "section": "yes",
          "reason": "Ninguém da casa tem imóvel e a renda da casa é de até R$ 3.200: vocês entram na Faixa 1, a que tem mais ajuda.",
          "nextStep": "Faça ou atualize o CadÚnico e procure a prefeitura, que faz a inscrição da Faixa 1.",
          "estimate": {
            "type": "variable",
            "headline": "Desconto de até R$ 55 mil",
            "detail": "Não entra na soma porque depende da cidade e do imóvel: o desconto diminui o preço da casa (até R$ 65 mil na Região Norte). Na Faixa 1, quem recebe Bolsa Família ou BPC não paga prestações."
          }
        },
        {
          "when": {
            "$comment": "Faixa 2: up to R$ 5.000.",
            "properties": {
              "totalIncomeCentavos": {
                "maximum": 500000
              }
            }
          },
          "section": "yes",
          "reason": "Ninguém da casa tem imóvel e a renda da casa é de até R$ 5.000: vocês entram na Faixa 2.",
          "nextStep": "Simule o financiamento na Caixa ou com um correspondente do programa.",
          "estimate": {
            "type": "variable",
            "headline": "Desconto de até R$ 55 mil",
            "detail": "Não entra na soma porque depende da renda, da cidade e do imóvel: o desconto diminui o valor financiado (até R$ 65 mil na Região Norte)."
          }
        },
        {
          "when": {
            "$comment": "Faixa 3: up to R$ 9.600, no subsidy, lower interest.",
            "properties": {
              "totalIncomeCentavos": {
                "maximum": 960000
              }
            }
          },
          "section": "yes",
          "reason": "Ninguém da casa tem imóvel e a renda da casa é de até R$ 9.600: vocês entram na Faixa 3.",
          "nextStep": "Simule o financiamento na Caixa ou com um correspondente do programa.",
          "estimate": {
            "type": "variable",
            "headline": "Juros menores",
            "detail": "Não entra na soma porque não é dinheiro na mão: não há desconto no preço, mas os juros são menores que os de mercado, para imóveis de até R$ 400 mil."
          }
        },
        {
          "when": {
            "$comment": "Faixa 4 (Classe Média): up to R$ 13.000.",
            "properties": {
              "totalIncomeCentavos": {
                "maximum": 1300000
              }
            }
          },
          "section": "yes",
          "reason": "Ninguém da casa tem imóvel e a renda da casa é de até R$ 13.000: vocês entram na faixa Classe Média.",
          "nextStep": "Simule o financiamento na Caixa ou com um correspondente do programa.",
          "estimate": {
            "type": "variable",
            "headline": "Juros menores",
            "detail": "Não entra na soma porque não é dinheiro na mão: os juros são de 10% ao ano, menores que os de mercado, para imóveis de até R$ 600 mil."
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É para famílias com renda de até R$ 13.000 por mês.",
        "nextStep": "Se a renda da casa mudar, faça uma nova simulação."
      }
    },
    {
      "id": "prouni",
      "name": "ProUni",
      "source": "https://www.gov.br/mec/pt-br/acesso-a-informacao/perguntas-frequentes/prouni",
      "cases": [
        {
          "when": {
            "properties": {
              "schooling": {
                "const": "no"
              }
            }
          },
          "section": "no",
          "reason": "É preciso terminar o ensino médio antes.",
          "nextStep": "Quando terminar o ensino médio, faça o Enem para tentar uma bolsa."
        },
        {
          "when": {
            "properties": {
              "schooling": {
                "const": "college-degree"
              }
            }
          },
          "section": "no",
          "reason": "O ProUni é só para quem ainda não tem diploma de faculdade.",
          "nextStep": "Nada a fazer neste programa."
        },
        {
          "when": {
            "$comment": "MEC: full scholarship for per-person income up to 1.5 minimum wages; Enem average of 450 or more and a non-zero essay.",
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 243150
              }
            }
          },
          "section": "maybe",
          "reason": "Você terminou o ensino médio, não tem faculdade e a renda por pessoa é de até R$ 2.431,50 (1,5 salário mínimo). Depende da nota: média de 450 no Enem e redação acima de zero.",
          "nextStep": "Faça o Enem e se inscreva no ProUni pelo Portal Único de Acesso ao Ensino Superior, nas datas do MEC.",
          "estimate": {
            "type": "variable",
            "headline": "Bolsa de 100% na faculdade",
            "detail": "Não entra na soma porque depende do curso e da faculdade: a bolsa paga a mensalidade inteira."
          }
        },
        {
          "when": {
            "$comment": "MEC: half scholarship for per-person income up to 3 minimum wages.",
            "properties": {
              "incomePerPersonCentavos": {
                "maximum": 486300
              }
            }
          },
          "section": "maybe",
          "reason": "Você terminou o ensino médio, não tem faculdade e a renda por pessoa é de até R$ 4.863 (3 salários mínimos). Depende da nota: média de 450 no Enem e redação acima de zero.",
          "nextStep": "Faça o Enem e se inscreva no ProUni pelo Portal Único de Acesso ao Ensino Superior, nas datas do MEC.",
          "estimate": {
            "type": "variable",
            "headline": "Bolsa de 50% na faculdade",
            "detail": "Não entra na soma porque depende do curso e da faculdade: a bolsa paga metade da mensalidade."
          }
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "A renda por pessoa passa de R$ 4.863 (3 salários mínimos).",
        "nextStep": "Se a renda da casa diminuir, tente o ProUni."
      }
    },
    {
      "id": "abono-salarial",
      "name": "Abono salarial (PIS/Pasep)",
      "source": "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial",
      "cases": [
        {
          "when": {
            "$comment": "MTE, 2026 calendar: base year 2024, average pay up to R$ 2.766, at least 30 days worked, PIS/Pasep for 5+ years. Value: minimum wage / 12 x months worked.",
            "properties": {
              "formalWork2024": {
                "const": "up-to-limit"
              }
            }
          },
          "section": "yes",
          "reason": "Você trabalhou com carteira assinada em 2024 ganhando, em média, até R$ 2.766 por mês. Também é preciso ter PIS ou Pasep há pelo menos 5 anos.",
          "nextStep": "Consulte e saque pelo app Carteira de Trabalho Digital ou pelo gov.br. O abono de 2026 fica disponível até 30/12/2026.",
          "estimate": {
            "type": "variable",
            "headline": "Até R$ 1.621 por ano",
            "detail": "Não entra na soma porque é pago uma vez por ano e depende dos meses trabalhados em 2024: salário mínimo ÷ 12 × meses trabalhados, ou seja, R$ 136 por mês trabalhado, até R$ 1.621 por 12 meses."
          }
        },
        {
          "when": {
            "properties": {
              "formalWork2024": {
                "const": "over-limit"
              }
            }
          },
          "section": "no",
          "reason": "Em 2024, a sua média passou de R$ 2.766 por mês, o limite do abono pago em 2026.",
          "nextStep": "Nada a fazer neste programa agora."
        }
      ],
      "otherwise": {
        "section": "no",
        "reason": "É para quem trabalhou com carteira assinada em 2024.",
        "nextStep": "Se trabalhar com carteira assinada, confira o abono no app Carteira de Trabalho Digital."
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
    id: 'age',
    kind: 'age',
    title: 'Quantos anos você tem?',
    help: '',
  },
  {
    id: 'totalIncomeCentavos',
    kind: 'income',
    title: 'Quanto a sua casa ganha por mês, somando todo mundo?',
    help: 'Some salários, bicos, pensões e aposentadorias. Se ninguém ganha nada, escolha a primeira opção.',
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
    id: 'schooling',
    kind: 'choice',
    title: 'Você já terminou o ensino médio?',
    help: 'Vale escola pública ou particular, supletivo ou EJA.',
    options: [
      { value: 'no', label: 'Não' },
      { value: 'high-school', label: 'Sim' },
      { value: 'college-degree', label: 'Sim, e também tenho diploma de faculdade' },
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
    id: 'formalWork2024',
    kind: 'choice',
    title: 'Em 2024, você trabalhou com carteira assinada?',
    help: 'Vale também servidor público. Pode ter sido só um mês: pense na média do salário.',
    // R$ 2.766 is the abono salarial limit for the 2026 payments (base year 2024), as in regras.json.
    options: [
      { value: 'no', label: 'Não' },
      { value: 'up-to-limit', label: 'Sim, ganhando até R$ 2.766 por mês' },
      { value: 'over-limit', label: 'Sim, ganhando mais de R$ 2.766 por mês' },
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
  {
    id: 'ownsHome',
    kind: 'choice',
    title: 'Alguém da sua casa tem casa ou apartamento próprio?',
    help: 'Conta também quem ainda está pagando o financiamento.',
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
  schooling: { values: choiceValues('schooling') },
  dismissal: { values: choiceValues('dismissal') },
  formalWork2024: { values: choiceValues('formalWork2024') },
  disability: { values: choiceValues('disability') },
  mei: { values: choiceValues('mei') },
  ownsHome: { values: choiceValues('ownsHome') },
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
    schooling: answers.schooling,
    dismissal: answers.dismissal,
    formalWork2024: answers.formalWork2024,
    disability: answers.disability,
    mei: answers.mei,
    ownsHome: answers.ownsHome,
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
  return 'Entre ' + formatMoney(from - 1) + ' e ' + formatMoney(to);
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
  // "variable": the value depends on the user (medicine, trips, the house), so it is shown with an
  // explanation of how it is calculated and never added to the monthly total.
  if (estimate.type === 'variable') {
    checkText(estimate.headline, path + '.headline');
    checkText(estimate.detail, path + '.detail');
    return;
  }
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
    throw new RulesError(path + '.type: expected fixed, energy, gas or variable');
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
  const isPriced = (item) => item.estimate !== null && item.estimate.type !== 'variable';
  const rows = (items) => items
    .filter(isPriced)
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
    // Available without a fixed value: listed with how the value is calculated, outside the total.
    unpriced: ['yes', 'maybe'].flatMap((section) => groups[section]
      .filter((item) => item.estimate !== null && item.estimate.type === 'variable')
      .map((item) => ({ name: item.name, headline: item.estimate.headline, detail: item.estimate.detail, section }))),
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
  finishTimer: null,
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
  // Leaving the last question during the finish animation cancels the jump to the results.
  clearTimeout(state.finishTimer);
  const transition = !navigated ? null : step >= state.renderedStep ? 'forward' : 'back';
  const previousStep = state.renderedStep;
  state.renderedStep = step;
  document.body.classList.toggle('is-intro', step === INTRO_STEP);
  try {
    showScreen(screenFor(step), transition);
    cheerMascot(step, transition);
    // The results are on screen; forget the answers so a new round starts with nothing selected.
    if (step === RESULTS_STEP) state.answers = {};
    animateProgress(step, previousStep, transition);
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

// The bar shows the questions already answered: empty on the first, full only when the quiz ends.
function percent(answered) {
  return (answered / QUESTIONS.length) * 100 + '%';
}

// On each step forward the bar grows from where it was, then glows and pulses.
function animateProgress(step, previousStep, transition) {
  const bar = document.querySelector('#tela .progress');
  if (bar === null || transition !== 'forward') return;
  bar.style.setProperty('--progress-from', percent(previousStep === INTRO_STEP ? 0 : previousStep));
  bar.classList.add('is-advancing');
}

const FINISH_DELAY_MS = 1500;
// Where the sparkles appear along the bar (left, as a fraction of its width) and how far up or down they fly.
const SPARKLES = [[0.15, -14], [0.32, 12], [0.5, -16], [0.66, 10], [0.82, -12], [0.96, 14], [0.98, -8]];

// Last answer: the bar fills up with sparkles, then the results open after a short pause.
function finishQuiz(form) {
  form.querySelector('button[type="submit"]').disabled = true;
  form.querySelector('.options').disabled = true;
  const bar = form.querySelector('.progress');
  bar.style.setProperty('--progress-from', percent(QUESTIONS.length - 1));
  bar.style.setProperty('--progress-to', percent(QUESTIONS.length));
  bar.classList.remove('is-advancing');
  bar.classList.add('is-finishing');
  SPARKLES.forEach(([at, y], index) => {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.setProperty('--at', at * 100 + '%');
    sparkle.style.setProperty('--y', y + 'px');
    sparkle.style.setProperty('--delay', 350 + index * 70 + 'ms');
    bar.append(sparkle);
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.finishTimer = setTimeout(() => { location.hash = hashForStep(RESULTS_STEP); }, reduced ? 300 : FINISH_DELAY_MS);
}

function goHome() {
  location.hash = hashForStep(INTRO_STEP);
}

function questionScreen(step) {
  const question = QUESTIONS[step];
  const options = optionsFor(question, state.cuts, state.answers);
  const answer = state.answers[question.id];
  const fragment = cloneTemplate('tpl-question');
  const form = fragment.querySelector('form');

  fragment.querySelector('.step-number').textContent = String(step + 1);
  fragment.querySelector('.step-total').textContent = String(QUESTIONS.length);
  fragment.querySelector('.progress').style.setProperty('--progress-to', percent(step));
  fragment.querySelector('.question-art-slot').replaceWith(cloneTemplate('art-' + question.id));
  fragment.querySelector('h1').textContent = question.title;
  const help = fragment.querySelector('.help');
  help.textContent = question.help;
  help.hidden = question.help === '';

  const back = fragment.querySelector('.back');
  // The first question goes back to the intro; the others go back one step.
  back.addEventListener('click', () => (step === 0 ? goHome() : history.back()));

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
    if (step + 1 === RESULTS_STEP) finishQuiz(form);
    else location.hash = hashForStep(step + 1);
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

const EARNINGS_PARTS = ['monthly', 'temporary', 'ifApproved', 'unpriced'];

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
  if (row.headline !== undefined) {
    node.querySelector('.earnings-value').textContent = row.section === 'maybe' ? row.headline + ' (se aprovado)' : row.headline;
    node.querySelector('.earnings-detail').textContent = row.detail;
    return node;
  }
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
    if (event.target.closest('[data-home]') !== null) goHome();
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
