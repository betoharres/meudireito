// Content of the benefit pages (pt-BR). Every number here was checked against the official source listed in
// `sources` (October 2026). Keep it consistent with regras.json: when a rule changes there, change it here too.
// `card` is the program name used on the home page cards and in regras.json; the page reuses its illustration.

export const UPDATED = '2026-10-27';
export const UPDATED_LABEL = '27/10/2026';

export const PAGES = [
  {
    slug: 'cadunico',
    card: 'Cadastro Único (CadÚnico)',
    title: 'CadÚnico 2026: quem pode se cadastrar e como fazer',
    description: 'Veja quem pode entrar no Cadastro Único em 2026, como calcular a renda por pessoa e como se cadastrar no CRAS. Ele dá acesso ao Bolsa Família, BPC e mais.',
    h1: 'Quem pode se inscrever no CadÚnico em 2026?',
    lead: 'O Cadastro Único (CadÚnico) é o cadastro do governo federal para famílias de baixa renda. Quase todos os benefícios sociais usam esse cadastro para saber quem pode receber.',
    quick: [
      'Pode se cadastrar a família com renda de até meio salário mínimo por pessoa: R$ 810,50 em 2026.',
      'Famílias com renda maior também podem entrar quando algum programa exige o CadÚnico, como o Desconto Social de luz.',
      'O cadastro é feito no CRAS ou no posto do Cadastro Único da sua cidade.',
      'Estar no CadÚnico não garante benefício: cada programa tem regras próprias.',
    ],
    sections: [
      {
        h2: 'Para que serve o CadÚnico',
        paragraphs: [
          'É a partir do CadÚnico que o governo encontra as famílias que podem receber benefícios. Ele guarda quem mora na casa, a renda de cada pessoa e as condições de vida da família.',
          'Programas como Bolsa Família, Tarifa Social de luz, Gás do Povo, Pé-de-Meia, BPC, ID Jovem e a isenção de taxa em concursos usam as informações do CadÚnico.',
        ],
      },
      {
        h2: 'Quem pode se cadastrar',
        paragraphs: [
          'A regra principal é a renda por pessoa: some o que todos da casa ganham por mês e divida pelo número de pessoas. Se o resultado for de até meio salário mínimo (R$ 810,50 em 2026), a família pode se cadastrar.',
          'Famílias com renda maior também podem ser cadastradas quando o CadÚnico é exigido para algum programa ou serviço específico.',
        ],
        example: 'Exemplo: uma casa com 4 pessoas e renda total de R$ 3.000 tem renda de R$ 750 por pessoa (3.000 ÷ 4). Como R$ 750 é menos que R$ 810,50, a família pode se cadastrar.',
      },
      {
        h2: 'Como se cadastrar',
        list: [
          'Procure o CRAS ou o posto do Cadastro Único da sua cidade.',
          'Uma pessoa da família, o responsável familiar, responde às perguntas sobre todos que moram na casa.',
          'Leve os documentos das pessoas da família. O CRAS da sua cidade informa a lista completa.',
          'Depois de cadastrado, você pode consultar seus dados no aplicativo Cadastro Único.',
        ],
      },
      {
        h2: 'Cuidados importantes',
        list: [
          'Informe a renda e as pessoas da casa corretamente. Dados errados podem cancelar benefícios.',
          'Atualize o cadastro sempre que algo mudar: alguém nasceu, saiu de casa, conseguiu emprego ou mudou de endereço.',
        ],
      },
    ],
    faq: [
      { q: 'Estar no CadÚnico dá direito a dinheiro?', a: 'Não diretamente. O CadÚnico é só o cadastro. Cada programa, como o Bolsa Família, tem regras próprias e usa os dados do cadastro para decidir quem recebe.' },
      { q: 'Quem ganha mais de meio salário mínimo por pessoa pode se cadastrar?', a: 'Pode, quando algum programa ou serviço exige o CadÚnico. Um exemplo é o Desconto Social de luz, para renda por pessoa de até um salário mínimo.' },
      { q: 'Onde faço o CadÚnico?', a: 'No CRAS ou no posto do Cadastro Único da sua cidade.' },
    ],
    related: ['bolsa-familia', 'tarifa-social-de-energia', 'gas-do-povo', 'bpc-loas'],
    sources: [{ label: 'Cadastro Único, Ministério do Desenvolvimento e Assistência Social (MDS)', url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico' }],
  },
  {
    slug: 'bolsa-familia',
    card: 'Bolsa Família',
    title: 'Quem tem direito ao Bolsa Família em 2026? Valores e regras',
    description: 'Veja quem tem direito ao Bolsa Família em 2026: renda de até R$ 218 por pessoa, mínimo de R$ 600 e adicionais por criança, gestante e jovem. Saiba como pedir.',
    h1: 'Quem tem direito ao Bolsa Família em 2026?',
    lead: 'O Bolsa Família paga um valor todo mês às famílias com renda muito baixa. O valor mínimo é R$ 600 por família, e aumenta quando há crianças, gestantes ou jovens na casa.',
    quick: [
      'Tem direito a família inscrita no CadÚnico com renda de até R$ 218 por pessoa.',
      'Cada família recebe pelo menos R$ 600 por mês.',
      'São mais R$ 150 por criança de 0 a 7 anos incompletos.',
      'São mais R$ 50 por gestante, mãe que amamenta, criança de 7 a 12 anos ou adolescente de 12 a 18 anos.',
      'Não há inscrição separada: o caminho é fazer ou atualizar o CadÚnico.',
    ],
    sections: [
      {
        h2: 'Quem tem direito',
        paragraphs: [
          'Pela Lei 14.601/2023, pode receber a família que está no CadÚnico e tem renda de até R$ 218 por pessoa. Para calcular, some a renda de todos da casa e divida pelo número de pessoas.',
        ],
        example: 'Exemplo: uma casa com 4 pessoas e renda total de R$ 800 tem renda de R$ 200 por pessoa (800 ÷ 4). Como R$ 200 é menos que R$ 218, a família pode receber.',
      },
      {
        h2: 'Quanto o Bolsa Família paga',
        list: [
          'Benefício de Renda de Cidadania: um valor por pessoa da família.',
          'Benefício Complementar: se a soma por pessoa ficar abaixo de R$ 600, o governo completa até chegar a R$ 600.',
          'Benefício Primeira Infância: R$ 150 por criança de 0 a 7 anos incompletos.',
          'Benefício Variável Familiar: R$ 50 por gestante, nutriz (mãe que amamenta), criança de 7 a 12 anos incompletos ou adolescente de 12 a 18 anos incompletos.',
        ],
        example: 'Exemplo: uma família de 4 pessoas, com uma criança de 3 anos e outra de 9, recebe pelo menos R$ 600, mais R$ 150 pela criança de 3 anos e R$ 50 pela de 9: R$ 800 por mês.',
      },
      {
        h2: 'Como pedir o Bolsa Família',
        list: [
          'Faça ou atualize o CadÚnico no CRAS da sua cidade.',
          'Informe todas as pessoas da casa e a renda de cada uma.',
          'O governo usa os dados do CadÚnico para selecionar as famílias. Não existe outro cadastro.',
        ],
      },
      {
        h2: 'E se a renda aumentar?',
        paragraphs: [
          'A família que passa a ganhar um pouco mais que R$ 218 por pessoa não sai na hora. Pela regra de proteção da Lei 14.601/2023, ela pode continuar no programa por até 24 meses, seguindo as regras do governo.',
        ],
      },
    ],
    faq: [
      { q: 'Qual o valor mínimo do Bolsa Família em 2026?', a: 'R$ 600 por família. O valor aumenta com crianças de 0 a 7 anos (R$ 150 cada) e com gestantes, nutrizes, crianças e adolescentes de 7 a 18 anos (R$ 50 cada).' },
      { q: 'Quem mora sozinho pode receber o Bolsa Família?', a: 'Pode, se cumprir as regras de renda e estiver no CadÚnico. Famílias de uma pessoa só podem passar por entrevista ou visita para confirmar os dados.' },
      { q: 'Preciso me inscrever em algum site para receber?', a: 'Não. O caminho é o CadÚnico, feito no CRAS. Desconfie de sites ou pessoas que cobram para inscrever no Bolsa Família.' },
    ],
    related: ['cadunico', 'gas-do-povo', 'tarifa-social-de-energia', 'pe-de-meia'],
    sources: [
      { label: 'Lei 14.601/2023 (Programa Bolsa Família)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14601.htm' },
      { label: 'Bolsa Família, MDS', url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia' },
    ],
  },
  {
    slug: 'tarifa-social-de-energia',
    card: 'Tarifa Social de luz',
    title: 'Tarifa Social de luz 2026: quem tem direito à conta grátis',
    description: 'Desde a Lei 15.235/2025, a Tarifa Social dá 100% de desconto na conta de luz até 80 kWh por mês. Veja quem tem direito, quanto se economiza e como pedir.',
    h1: 'Quem tem direito à Tarifa Social de luz em 2026?',
    lead: 'A Tarifa Social de Energia Elétrica deixa grátis a parte da conta de luz até 80 kWh por mês para famílias de baixa renda no CadÚnico.',
    quick: [
      'Tem direito a família no CadÚnico com renda de até meio salário mínimo por pessoa (R$ 810,50 em 2026).',
      'O consumo de até 80 kWh por mês tem 100% de desconto.',
      'O que passar de 80 kWh é cobrado pela tarifa normal.',
      'Famílias indígenas e quilombolas no CadÚnico também têm 100% de desconto até 80 kWh.',
    ],
    sections: [
      {
        h2: 'Como funciona o desconto',
        paragraphs: [
          'Pela Lei 15.235/2025, a parte do consumo de até 80 kWh por mês tem desconto de 100%. A parte acima de 80 kWh não tem desconto.',
        ],
        example: 'Exemplo: se a casa gastou 120 kWh no mês, os primeiros 80 kWh saem de graça e só os 40 kWh restantes são cobrados.',
      },
      {
        h2: 'Quanto dá para economizar',
        paragraphs: [
          'Depende da tarifa da sua distribuidora. Usando a tarifa residencial média do país sem impostos (R$ 0,815 por kWh), 80 kWh grátis valem cerca de R$ 65,20 por mês (80 × R$ 0,815).',
        ],
      },
      {
        h2: 'Como pedir',
        list: [
          'Faça ou atualize o CadÚnico no CRAS da sua cidade.',
          'Com o cadastro em dia, o desconto costuma ser aplicado na conta. Se não aparecer, peça à empresa de luz da sua cidade.',
        ],
      },
    ],
    faq: [
      { q: 'A Tarifa Social deixa a conta de luz totalmente grátis?', a: 'Só a parte do consumo de até 80 kWh por mês. O que passar disso é cobrado normalmente, e outros itens da conta, como impostos e iluminação pública, podem continuar sendo cobrados.' },
      { q: 'Quem ganha um pouco mais pode ter algum desconto?', a: 'Sim. Quem tem renda por pessoa entre meio e um salário mínimo pode ter o Desconto Social de luz, que vale para até 120 kWh por mês.' },
      { q: 'Preciso pedir todo mês?', a: 'Não. O que importa é manter o CadÚnico atualizado.' },
    ],
    related: ['desconto-social-de-energia', 'cadunico', 'gas-do-povo', 'bolsa-familia'],
    sources: [
      { label: 'Lei 15.235/2025', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15235.htm' },
      { label: 'Tarifa Social, ANEEL', url: 'https://www.gov.br/aneel/pt-br/assuntos/tarifas/tarifa-social' },
    ],
  },
  {
    slug: 'desconto-social-de-energia',
    card: 'Desconto Social de luz',
    title: 'Desconto Social de luz 2026: quem tem direito e quanto economiza',
    description: 'O Desconto Social de luz isenta a cota da CDE até 120 kWh por mês para famílias no CadÚnico com renda por pessoa entre R$ 810,50 e R$ 1.621. Veja como funciona.',
    h1: 'Quem tem direito ao Desconto Social de luz em 2026?',
    lead: 'O Desconto Social de luz é para famílias que ganham um pouco mais e não entram na Tarifa Social. Ele vale desde 2026 e reduz a conta para consumo de até 120 kWh por mês.',
    quick: [
      'É para famílias no CadÚnico com renda por pessoa acima de meio e até um salário mínimo: de R$ 810,50 a R$ 1.621 em 2026.',
      'A família fica isenta da cota da CDE, um encargo da conta de luz, no consumo de até 120 kWh por mês.',
      'Vale para uma única unidade consumidora, ou seja, um endereço por família.',
    ],
    sections: [
      {
        h2: 'Como funciona',
        paragraphs: [
          'Pela Lei 15.235/2025, a partir de 2026 as famílias com renda por pessoa acima de meio e até um salário mínimo, inscritas no CadÚnico, deixam de pagar as cotas da CDE (Conta de Desenvolvimento Energético) no consumo de até 120 kWh por mês.',
          'A CDE é só uma parte da tarifa. Por isso o desconto é menor que o da Tarifa Social, que zera o consumo de até 80 kWh.',
        ],
      },
      {
        h2: 'Quanto dá para economizar',
        paragraphs: [
          'Depende da distribuidora. Neste site usamos uma estimativa de cerca de 11,8% de desconto sobre 120 kWh, com a tarifa residencial média do país sem impostos (R$ 0,815 por kWh): cerca de R$ 11,54 por mês.',
        ],
      },
      {
        h2: 'Como pedir',
        list: [
          'Faça ou atualize o CadÚnico no CRAS. Mesmo com renda acima de meio salário mínimo por pessoa, você pode se cadastrar porque o Desconto Social exige o CadÚnico.',
          'Confira se o desconto aparece na conta. Se não aparecer, procure a empresa de luz.',
        ],
      },
    ],
    faq: [
      { q: 'Qual a diferença entre Tarifa Social e Desconto Social?', a: 'A Tarifa Social é para renda por pessoa de até meio salário mínimo e zera o consumo de até 80 kWh. O Desconto Social é para renda por pessoa entre meio e um salário mínimo e tira só a cota da CDE do consumo de até 120 kWh.' },
      { q: 'Preciso estar no CadÚnico?', a: 'Sim. O desconto só vale para famílias inscritas no Cadastro Único.' },
    ],
    related: ['tarifa-social-de-energia', 'cadunico', 'minha-casa-minha-vida', 'farmacia-popular'],
    sources: [{ label: 'Lei 15.235/2025', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15235.htm' }],
  },
  {
    slug: 'gas-do-povo',
    card: 'Gás do Povo',
    title: 'Quem tem direito ao Gás do Povo em 2026? Regras e como pegar',
    description: 'O Gás do Povo dá botijão de gás de 13 kg grátis para famílias no CadÚnico. Veja quem tem direito, quantos botijões por ano e como retirar na revenda.',
    h1: 'Quem tem direito ao Gás do Povo em 2026?',
    lead: 'O Gás do Povo garante a recarga grátis do botijão de gás de cozinha (13 kg) em revendas credenciadas. Ele substituiu o Auxílio Gás dos Brasileiros.',
    quick: [
      'É para famílias no CadÚnico com renda de até meio salário mínimo por pessoa (R$ 810,50) e com 2 ou mais pessoas.',
      'Famílias de 2 ou 3 pessoas recebem até 4 recargas por ano.',
      'Famílias de 4 ou mais pessoas recebem 6 recargas por ano.',
      'A seleção é automática, feita com os dados do CadÚnico.',
    ],
    sections: [
      {
        h2: 'Quantos botijões a família recebe',
        list: [
          'Famílias de 2 ou 3 pessoas: até 4 recargas por ano. Cada vale dura 3 meses.',
          'Famílias com 4 ou mais pessoas: 6 recargas por ano. Cada vale dura 2 meses.',
          'Se a família não conseguir usar o vale dentro do prazo, o benefício não é cancelado.',
        ],
      },
      {
        h2: 'Quanto vale',
        paragraphs: [
          'A recarga sai de graça. O governo paga à revenda um preço de referência por botijão, que muda de estado para estado (o menor é de R$ 89,67, segundo a portaria do MME e da Fazenda). Com 4 botijões por ano, a economia passa de R$ 29 por mês; com 6, passa de R$ 44.',
        ],
      },
      {
        h2: 'Como pegar o botijão',
        list: [
          'Mantenha o CadÚnico atualizado no CRAS. A família selecionada recebe um vale para a recarga.',
          'Retire o botijão em uma revenda credenciada no programa.',
          'Para retirar, use o cartão do Bolsa Família com chip, o cartão de débito da CAIXA ou o CPF com um código de validação enviado ao celular.',
        ],
      },
    ],
    faq: [
      { q: 'Quem mora sozinho tem direito ao Gás do Povo?', a: 'Não. O programa exige 2 ou mais pessoas na família.' },
      { q: 'Preciso me inscrever?', a: 'Não há inscrição separada. A seleção é automática, com base no CadÚnico atualizado.' },
      { q: 'Perco o benefício se não usar o vale a tempo?', a: 'Não. A família não tem o benefício cancelado por não conseguir usar o vale dentro do prazo.' },
    ],
    related: ['cadunico', 'bolsa-familia', 'tarifa-social-de-energia', 'farmacia-popular'],
    sources: [
      { label: 'Perguntas e respostas sobre o Gás do Povo, Secom', url: 'https://www.gov.br/secom/pt-br/acompanhe-a-secom/noticias/2026/01/perguntas-e-respostas-sobre-o-programa-gas-do-povo' },
      { label: 'Gás do Povo, MDS', url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/gas-do-povo' },
    ],
  },
  {
    slug: 'pe-de-meia',
    card: 'Pé-de-Meia',
    title: 'Quem tem direito ao Pé-de-Meia em 2026? Valores e regras',
    description: 'O Pé-de-Meia paga R$ 200 por mês a estudantes do ensino médio público no CadÚnico, mais R$ 1.000 por ano concluído: até R$ 9.200. Veja quem tem direito.',
    h1: 'Quem tem direito ao Pé-de-Meia em 2026?',
    lead: 'O Pé-de-Meia é uma poupança do MEC para estudantes do ensino médio público de famílias no CadÚnico. Ele paga para o aluno continuar estudando e terminar a escola.',
    quick: [
      'É para estudantes do ensino médio público de famílias no CadÚnico.',
      'No ensino regular, de 14 a 24 anos; na EJA, de 19 a 24 anos; com renda da família de até meio salário mínimo por pessoa.',
      'Ensino regular: R$ 200 por mês ao comprovar matrícula e frequência.',
      'Mais R$ 1.000 por ano concluído, guardados na poupança até a formatura.',
      'Somando tudo e o adicional do Enem, chega a R$ 9.200 por aluno.',
    ],
    sections: [
      {
        h2: 'Quanto o Pé-de-Meia paga',
        list: [
          'Ensino médio regular: incentivo mensal de R$ 200 ao comprovar matrícula e frequência. Pode ser sacado a qualquer momento.',
          'EJA: R$ 200 ao comprovar matrícula e incentivos de R$ 225 pela frequência, também disponíveis para saque.',
          'R$ 1.000 ao final de cada ano concluído. Esse dinheiro fica na poupança e só pode ser retirado depois da formatura no ensino médio.',
          'Mais R$ 200 pela participação no Enem.',
        ],
      },
      {
        h2: 'Como receber',
        list: [
          'A família precisa estar no CadÚnico, com os dados atualizados.',
          'O estudante precisa estar matriculado e frequentar as aulas no ensino médio público.',
          'Em geral não há inscrição: o MEC identifica os estudantes pelos dados da escola e do CadÚnico. Você pode consultar a situação no site do Pé-de-Meia.',
        ],
      },
    ],
    faq: [
      { q: 'Quanto o Pé-de-Meia paga por mês?', a: 'R$ 200 por mês no ensino médio regular, ao comprovar matrícula e frequência. Na EJA, R$ 200 pela matrícula e R$ 225 pela frequência.' },
      { q: 'Posso sacar os R$ 1.000 por ano concluído?', a: 'Só depois de se formar no ensino médio. Até lá, o valor fica guardado na poupança.' },
      { q: 'Estudante de escola particular recebe?', a: 'Não. O programa é para estudantes matriculados no ensino médio público.' },
    ],
    related: ['cadunico', 'prouni', 'id-jovem', 'bolsa-familia'],
    sources: [{ label: 'Pé-de-Meia, Ministério da Educação (MEC)', url: 'https://www.gov.br/mec/pt-br/pe-de-meia' }],
  },
  {
    slug: 'bpc-loas',
    card: 'BPC (Benefício de Prestação Continuada)',
    title: 'Quem tem direito ao BPC/LOAS em 2026? Regras e como pedir',
    description: 'O BPC (LOAS) paga 1 salário mínimo (R$ 1.621) por mês a pessoas com 65 anos ou mais ou com deficiência, com renda de até R$ 405,25 por pessoa. Veja como pedir.',
    h1: 'Quem tem direito ao BPC (LOAS) em 2026?',
    lead: 'O Benefício de Prestação Continuada (BPC), também chamado de LOAS, paga 1 salário mínimo por mês a pessoas idosas ou com deficiência de famílias com renda muito baixa. Não é preciso ter contribuído com o INSS.',
    quick: [
      'Valor: 1 salário mínimo por mês (R$ 1.621 em 2026).',
      'É para pessoas com 65 anos ou mais ou pessoas com deficiência.',
      'A renda da família precisa ser de até 1/4 do salário mínimo por pessoa (R$ 405,25 em 2026).',
      'O pedido é feito no INSS, pelo Meu INSS ou pelo telefone 135.',
    ],
    sections: [
      {
        h2: 'Quem tem direito',
        paragraphs: [
          'Pela Lei 8.742/1993 (LOAS), têm direito a pessoa idosa com 65 anos ou mais e a pessoa com deficiência que não conseguem se manter nem ser mantidas pela família, com renda familiar de até 1/4 do salário mínimo por pessoa.',
          'Para o BPC, pessoa com deficiência é quem tem impedimento de longo prazo de natureza física, mental, intelectual ou sensorial que pode dificultar a participação plena na sociedade.',
        ],
        example: 'Exemplo: uma casa com 2 pessoas e renda total de R$ 800 tem R$ 400 por pessoa (800 ÷ 2), abaixo de R$ 405,25. Se uma delas tem 65 anos ou mais, a família está dentro do limite de renda.',
      },
      {
        h2: 'Como pedir o BPC',
        list: [
          'Faça ou atualize o CadÚnico no CRAS da sua cidade.',
          'Peça o BPC no INSS: pelo aplicativo ou site Meu INSS, ou pelo telefone 135.',
          'No caso de deficiência, o INSS faz uma avaliação para confirmar o impedimento de longo prazo.',
        ],
      },
      {
        h2: 'Cuidados importantes',
        list: [
          'Em geral, o BPC não pode ser recebido junto com aposentadoria ou pensão.',
          'O INSS analisa cada caso. Mesmo dentro da regra de renda, o pedido pode ser negado ou pedir mais documentos.',
        ],
      },
    ],
    faq: [
      { q: 'Quanto o BPC paga em 2026?', a: '1 salário mínimo por mês, que em 2026 é R$ 1.621.' },
      { q: 'Precisa ter contribuído com o INSS?', a: 'Não. O BPC é um benefício de assistência social, não uma aposentadoria.' },
      { q: 'Qual o limite de renda do BPC?', a: 'Até 1/4 do salário mínimo por pessoa da família: R$ 405,25 em 2026.' },
    ],
    related: ['cadunico', 'farmacia-popular', 'carteira-da-pessoa-idosa', 'bolsa-familia'],
    sources: [
      { label: 'Lei 8.742/1993 (LOAS), art. 20', url: 'https://www.planalto.gov.br/ccivil_03/leis/l8742.htm' },
      { label: 'Benefícios assistenciais, INSS', url: 'https://www.gov.br/inss/pt-br/direitos-e-deveres/beneficios-assistenciais' },
    ],
  },
  {
    slug: 'seguro-desemprego',
    card: 'Seguro-desemprego',
    title: 'Seguro-desemprego 2026: quem tem direito, prazo e como pedir',
    description: 'Veja quem tem direito ao seguro-desemprego, quantos meses é preciso ter trabalhado, o prazo de 120 dias e como pedir pelo app Carteira de Trabalho Digital.',
    h1: 'Quem tem direito ao seguro-desemprego em 2026?',
    lead: 'O seguro-desemprego dá uma ajuda em dinheiro por alguns meses a quem foi demitido sem justa causa de um emprego com carteira assinada.',
    quick: [
      'É para quem foi demitido sem justa causa de um emprego formal.',
      'Na primeira vez, é preciso ter recebido salário em pelo menos 12 dos últimos 18 meses.',
      'O pedido deve ser feito em até 120 dias depois da demissão.',
      'São de 3 a 5 parcelas, e nenhuma é menor que 1 salário mínimo.',
    ],
    sections: [
      {
        h2: 'Quem tem direito',
        paragraphs: ['Tem direito o trabalhador formal demitido sem justa causa que:'],
        list: [
          'não tem renda própria suficiente para se manter e manter a família;',
          'recebeu salário por pelo menos 12 meses nos últimos 18 meses antes da demissão, se for o primeiro pedido;',
          'recebeu salário por pelo menos 9 meses nos últimos 12 meses, se for o segundo pedido;',
          'recebeu salário em cada um dos 6 meses anteriores à demissão, a partir do terceiro pedido;',
          'não recebe benefício contínuo da Previdência, com exceção do auxílio-acidente e de alguns outros.',
        ],
      },
      {
        h2: 'Como pedir',
        list: [
          'Pelo aplicativo Carteira de Trabalho Digital, no celular.',
          'Pelo portal gov.br.',
          'Pelo telefone 158.',
          'Tenha em mãos o Requerimento do Seguro-Desemprego, que o empregador entrega na demissão, e o número do CPF.',
        ],
      },
      {
        h2: 'Quanto e quando recebe',
        paragraphs: [
          'São de 3 a 5 parcelas, conforme o tempo trabalhado. Nenhuma parcela é menor que 1 salário mínimo (R$ 1.621 em 2026). Cada parcela é paga a cada 30 dias, e você acompanha os valores e as datas no app Carteira de Trabalho Digital ou no gov.br.',
        ],
      },
    ],
    faq: [
      { q: 'Qual o prazo para pedir o seguro-desemprego?', a: 'Até 120 dias depois da demissão. Depois disso, o direito provavelmente se perde.' },
      { q: 'Quem pediu demissão tem direito?', a: 'Não. O seguro-desemprego é só para quem foi demitido sem justa causa.' },
      { q: 'Quantas parcelas vou receber?', a: 'De 3 a 5, conforme o tempo trabalhado. Você confere a quantidade no app Carteira de Trabalho Digital.' },
    ],
    related: ['abono-salarial', 'cadunico', 'bolsa-familia', 'farmacia-popular'],
    sources: [
      { label: 'Solicitar o Seguro-Desemprego, gov.br', url: 'https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego' },
      { label: 'Seguro-Desemprego, Ministério do Trabalho e Emprego', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/seguro-desemprego' },
    ],
  },
  {
    slug: 'isencao-taxa-concurso',
    card: 'Isenção de taxa em concursos',
    title: 'Isenção da taxa de concurso: quem tem direito pelo CadÚnico',
    description: 'Pela Lei 13.656/2018, quem está no CadÚnico com renda de até R$ 810,50 por pessoa não paga a inscrição em concursos federais. Veja como pedir a isenção.',
    h1: 'Quem tem direito à isenção da taxa de concurso público?',
    lead: 'A Lei 13.656/2018 garante isenção da taxa de inscrição em concursos públicos federais para pessoas de baixa renda e para doadores de medula óssea.',
    quick: [
      'Vale para concursos de órgãos federais.',
      'Tem direito quem é de família no CadÚnico com renda de até meio salário mínimo por pessoa (R$ 810,50 em 2026).',
      'Doadores de medula óssea em entidades reconhecidas pelo Ministério da Saúde também têm direito.',
      'Concursos estaduais e municipais seguem leis próprias: veja o edital.',
    ],
    sections: [
      {
        h2: 'Como pedir a isenção',
        list: [
          'Faça ou atualize o CadÚnico no CRAS. Você vai receber um número NIS.',
          'Na inscrição do concurso, procure a opção de pedir isenção dentro do prazo do edital.',
          'Informe o seu NIS e siga as instruções do edital.',
        ],
      },
      {
        h2: 'Cuidados importantes',
        list: [
          'O pedido de isenção tem prazo próprio, em geral no começo das inscrições.',
          'Informações falsas podem tirar você do concurso.',
        ],
      },
    ],
    faq: [
      { q: 'A isenção vale para qualquer concurso?', a: 'A Lei 13.656/2018 vale para concursos federais. Estados e municípios têm regras próprias, que aparecem no edital.' },
      { q: 'Preciso estar no CadÚnico?', a: 'Sim, no caso da baixa renda. É pelo número do NIS que o órgão confere a sua situação.' },
    ],
    related: ['cadunico', 'prouni', 'id-jovem', 'bolsa-familia'],
    sources: [{ label: 'Lei 13.656/2018', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13656.htm' }],
  },
  {
    slug: 'farmacia-popular',
    card: 'Farmácia Popular',
    title: 'Farmácia Popular 2026: remédios grátis e como pegar',
    description: 'No Farmácia Popular, todos os remédios e itens da lista saem de graça com receita do SUS ou particular. Veja a lista de doenças atendidas, fraldas e documentos.',
    h1: 'Quem tem direito à Farmácia Popular em 2026?',
    lead: 'O Farmácia Popular entrega de graça remédios para várias doenças comuns em farmácias credenciadas. Qualquer pessoa com receita médica pode usar.',
    quick: [
      'Qualquer pessoa com receita médica válida, do SUS ou particular, tem direito.',
      'Todos os remédios e itens da lista saem de graça.',
      'Há remédios para 12 indicações, como pressão alta, diabetes e asma.',
      'Também há fraldas geriátricas, para quem tem 60 anos ou mais ou deficiência, e absorventes higiênicos.',
    ],
    sections: [
      {
        h2: 'Para que doenças há remédio grátis',
        list: [
          'Hipertensão (pressão alta) e diabetes, incluindo diabetes associada a doenças do coração.',
          'Asma e rinite.',
          'Osteoporose e colesterol alto (dislipidemia).',
          'Doença de Parkinson e glaucoma.',
          'Anticoncepção.',
        ],
      },
      {
        h2: 'Como pegar os remédios',
        list: [
          'Vá a uma farmácia com o selo "Aqui Tem Farmácia Popular".',
          'Leve documento oficial com foto e o número do CPF.',
          'Leve a receita médica dentro da validade, do SUS ou particular.',
          'Os remédios também podem ser retirados nas Unidades Básicas de Saúde (UBS) e nas farmácias municipais.',
        ],
      },
      {
        h2: 'Fraldas geriátricas',
        paragraphs: [
          'As fraldas são para pessoas com 60 anos ou mais ou pessoas com deficiência com incontinência. Além dos documentos, é preciso levar receita, laudo ou atestado médico. No caso de deficiência, o documento deve informar a CID.',
        ],
      },
    ],
    faq: [
      { q: 'Preciso estar no CadÚnico para usar o Farmácia Popular?', a: 'Não. Qualquer pessoa com receita médica válida pode retirar os itens da lista.' },
      { q: 'Receita de médico particular vale?', a: 'Vale. A receita pode ser do SUS ou de serviço particular, dentro da validade.' },
      { q: 'Outra pessoa pode retirar por mim?', a: 'Pode, se você não puder ir. O representante leva a receita, o documento com foto e CPF do paciente e o próprio documento.' },
    ],
    related: ['bpc-loas', 'carteira-da-pessoa-idosa', 'cadunico', 'bolsa-familia'],
    sources: [{ label: 'Farmácia Popular, Ministério da Saúde', url: 'https://www.gov.br/saude/pt-br/composicao/sectics/farmacia-popular' }],
  },
  {
    slug: 'carteira-da-pessoa-idosa',
    card: 'Carteira da Pessoa Idosa',
    title: 'Carteira da Pessoa Idosa: quem tem direito à passagem grátis',
    description: 'Pessoas com 60 anos ou mais e renda de até 2 salários mínimos têm direito a vaga grátis ou 50% de desconto em ônibus interestaduais. Veja como pedir a carteira.',
    h1: 'Quem tem direito à Carteira da Pessoa Idosa?',
    lead: 'A Carteira da Pessoa Idosa comprova o direito a viajar de graça ou com desconto em ônibus interestaduais, garantido pelo Estatuto da Pessoa Idosa.',
    quick: [
      'É para pessoas com 60 anos ou mais e renda de até 2 salários mínimos (R$ 3.242 em 2026).',
      'Em cada ônibus interestadual há 2 vagas grátis para pessoas idosas nessa situação.',
      'Quando essas vagas acabam, o desconto é de pelo menos 50% na passagem.',
      'A carteira é gratuita e pode ser pedida no CRAS ou pela internet.',
    ],
    sections: [
      {
        h2: 'O que a lei garante',
        paragraphs: [
          'O artigo 40 do Estatuto da Pessoa Idosa (Lei 10.741/2003) garante, no transporte coletivo interestadual, a reserva de 2 vagas gratuitas por veículo para pessoas idosas com renda de até 2 salários mínimos, e desconto mínimo de 50% para as demais pessoas idosas que se encaixam na regra, quando as vagas gratuitas já estão ocupadas.',
        ],
      },
      {
        h2: 'Como pedir a carteira',
        list: [
          'Peça no CRAS da sua cidade ou no site carteiraidoso.cidadania.gov.br.',
          'Use a carteira para comprovar o direito na hora de pedir a passagem.',
        ],
      },
    ],
    faq: [
      { q: 'A Carteira da Pessoa Idosa é paga?', a: 'Não. A emissão é gratuita.' },
      { q: 'Vale para ônibus da cidade?', a: 'O direito descrito aqui é para ônibus interestaduais. Ônibus municipais seguem regras locais.' },
    ],
    related: ['bpc-loas', 'farmacia-popular', 'id-jovem', 'cadunico'],
    sources: [{ label: 'Lei 10.741/2003 (Estatuto da Pessoa Idosa), art. 40', url: 'https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm' }],
  },
  {
    slug: 'id-jovem',
    card: 'ID Jovem',
    title: 'ID Jovem 2026: quem tem direito à meia-entrada e passagem',
    description: 'A ID Jovem é para jovens de 15 a 29 anos de família no CadÚnico com renda de até 2 salários mínimos: meia-entrada e vagas grátis ou com 50% em ônibus.',
    h1: 'Quem tem direito à ID Jovem?',
    lead: 'A Identidade Jovem (ID Jovem) é o documento que garante meia-entrada em eventos e vagas grátis ou com desconto em ônibus interestaduais para jovens de baixa renda.',
    quick: [
      'É para jovens de 15 a 29 anos.',
      'A família precisa estar no CadÚnico, com renda de até 2 salários mínimos por mês (R$ 3.242 em 2026).',
      'Dá meia-entrada em cinema, teatro, shows e eventos esportivos.',
      'Dá vagas grátis ou com 50% de desconto em ônibus interestaduais.',
    ],
    sections: [
      {
        h2: 'Quem tem direito',
        paragraphs: [
          'O Decreto 8.537/2015 define jovem de baixa renda como a pessoa de 15 a 29 anos de família com renda mensal de até 2 salários mínimos, inscrita no CadÚnico. A renda aqui é a da família toda, não a renda por pessoa.',
        ],
      },
      {
        h2: 'Como tirar a ID Jovem',
        list: [
          'Faça ou atualize o CadÚnico no CRAS.',
          'Emita a ID Jovem de graça no site ou no aplicativo ID Jovem.',
          'Apresente a ID Jovem com um documento com foto ao comprar o ingresso ou a passagem.',
        ],
      },
    ],
    faq: [
      { q: 'A ID Jovem é paga?', a: 'Não. A emissão é gratuita.' },
      { q: 'Qual é o limite de renda da ID Jovem?', a: 'A família precisa ter renda de até 2 salários mínimos por mês no total (R$ 3.242 em 2026) e estar no CadÚnico.' },
    ],
    related: ['cadunico', 'pe-de-meia', 'prouni', 'carteira-da-pessoa-idosa'],
    sources: [
      { label: 'Decreto 8.537/2015', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/decreto/d8537.htm' },
      { label: 'ID Jovem', url: 'https://idjovem.juventude.gov.br/' },
    ],
  },
  {
    slug: 'minha-casa-minha-vida',
    card: 'Minha Casa, Minha Vida',
    title: 'Minha Casa, Minha Vida 2026: faixas de renda e quem tem direito',
    description: 'Veja as faixas do Minha Casa, Minha Vida em 2026 (até R$ 3.200, R$ 5.000, R$ 9.600 e R$ 13.000), o desconto de até R$ 55 mil e como participar.',
    h1: 'Quem tem direito ao Minha Casa, Minha Vida em 2026?',
    lead: 'O Minha Casa, Minha Vida ajuda famílias a comprar a casa própria, com desconto no preço ou juros menores, conforme a renda. As faixas mudaram em 2026.',
    quick: [
      'Faixa 1: renda da família de até R$ 3.200 por mês.',
      'Faixa 2: de R$ 3.200,01 a R$ 5.000.',
      'Faixa 3: de R$ 5.000,01 a R$ 9.600.',
      'Classe Média (Faixa 4): até R$ 13.000.',
      'Para ter desconto, ninguém pode ter imóvel residencial próprio nem financiamento de casa.',
    ],
    sections: [
      {
        h2: 'Faixas de renda em 2026',
        paragraphs: ['As faixas usam a renda bruta mensal da família (Portaria MCID 333, de 30 de março de 2026). Em áreas rurais, a renda é anual.'],
        list: [
          'Faixa 1: até R$ 3.200 por mês (rural: até R$ 50.000 por ano).',
          'Faixa 2: de R$ 3.200,01 a R$ 5.000 (rural: até R$ 70.900 por ano).',
          'Faixa 3: de R$ 5.000,01 a R$ 9.600 (rural: até R$ 134.000 por ano).',
          'Classe Média: até R$ 13.000 por mês.',
        ],
      },
      {
        h2: 'Qual ajuda cada faixa recebe',
        list: [
          'Famílias com renda de até R$ 5.000 podem ter desconto de até R$ 55.000 (até R$ 65.000 na Região Norte), que reduz a entrada ou o valor financiado.',
          'Na Faixa 1, na linha com moradias subsidiadas, quem recebe Bolsa Família ou BPC não paga prestações: o imóvel é 100% gratuito.',
          'A Faixa 3 não tem desconto direto, mas tem juros menores que os de mercado, para imóveis de até R$ 400 mil.',
          'A Classe Média financia imóveis de até R$ 600 mil com juros de 10% ao ano.',
        ],
      },
      {
        h2: 'Como participar',
        list: [
          'Faixa 1 subsidiada: a inscrição é feita pela prefeitura ou por entidades organizadoras. Mantenha o CadÚnico atualizado.',
          'Financiamento com desconto: simule na Caixa ou com um correspondente do programa.',
        ],
      },
    ],
    faq: [
      { q: 'Quem já tem casa pode participar?', a: 'Para receber o desconto, não. A Lei 14.620/2023 proíbe o desconto para quem é proprietário de imóvel residencial ou já tem financiamento habitacional pelo FGTS.' },
      { q: 'Qual a renda máxima do Minha Casa, Minha Vida?', a: 'R$ 13.000 por mês na faixa Classe Média, desde 2026.' },
      { q: 'Bolsa Família paga a casa?', a: 'Na Faixa 1, na linha com moradias subsidiadas, quem recebe Bolsa Família ou BPC fica isento das prestações.' },
    ],
    related: ['cadunico', 'bolsa-familia', 'bpc-loas', 'desconto-social-de-energia'],
    sources: [
      { label: 'Sobre o Minha Casa, Minha Vida, Ministério das Cidades', url: 'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/sobre-o-minha-casa-minha-vida-1' },
      { label: 'MCMV com FGTS, Ministério das Cidades', url: 'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/programa-minha-casa-minha-vida/mcmv-fgts' },
      { label: 'Lei 14.620/2023', url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14620.htm' },
    ],
  },
  {
    slug: 'prouni',
    card: 'ProUni',
    title: 'Quem tem direito ao ProUni em 2026? Renda e nota do Enem',
    description: 'O ProUni dá bolsa de 100% ou 50% em faculdade particular. Veja o limite de renda (1,5 ou 3 salários mínimos por pessoa) e a nota mínima no Enem.',
    h1: 'Quem tem direito ao ProUni em 2026?',
    lead: 'O ProUni (Programa Universidade para Todos) oferece bolsas integrais e parciais em faculdades particulares para estudantes de baixa renda que ainda não têm diploma.',
    quick: [
      'Bolsa integral (100%): renda familiar de até 1,5 salário mínimo por pessoa (R$ 2.431,50 em 2026).',
      'Bolsa parcial (50%): renda de até 3 salários mínimos por pessoa (R$ 4.863).',
      'É preciso ter média de pelo menos 450 pontos no Enem e nota acima de zero na redação.',
      'É para quem não tem diploma de curso superior.',
    ],
    sections: [
      {
        h2: 'Quem pode participar',
        paragraphs: ['Além da renda e da nota do Enem, é preciso atender a pelo menos uma destas condições:'],
        list: [
          'ter cursado o ensino médio em escola pública, ou em escola particular como bolsista, ou ainda parte em cada uma;',
          'ter cursado o ensino médio em escola particular, sem bolsa ou com bolsa parcial;',
          'ser pessoa com deficiência;',
          'ser professor da rede pública, concorrendo a cursos de licenciatura e pedagogia.',
        ],
      },
      {
        h2: 'Como funciona a seleção',
        list: [
          'Vale a nota das duas últimas edições do Enem antes do processo seletivo.',
          'Você escolhe até duas opções de faculdade, curso e turno.',
          'Os candidatos são classificados pelas notas do Enem e pela ordem de prioridade do programa.',
          'A inscrição é feita no Portal Único de Acesso ao Ensino Superior, nas datas do MEC.',
        ],
      },
    ],
    faq: [
      { q: 'Quem estudou em escola particular pode tentar o ProUni?', a: 'Pode, inclusive sem bolsa. Mas quem estudou em escola pública ou como bolsista integral tem prioridade na classificação.' },
      { q: 'Qual a nota mínima do Enem para o ProUni?', a: 'Média de 450 pontos nas cinco notas do Enem e nota acima de zero na redação.' },
      { q: 'Quem já tem diploma pode participar?', a: 'Não. O ProUni é para quem não tem diploma de curso superior.' },
    ],
    related: ['pe-de-meia', 'id-jovem', 'isencao-taxa-concurso', 'cadunico'],
    sources: [{ label: 'Perguntas frequentes sobre o ProUni, MEC', url: 'https://www.gov.br/mec/pt-br/acesso-a-informacao/perguntas-frequentes/prouni' }],
  },
  {
    slug: 'abono-salarial',
    card: 'Abono salarial (PIS/Pasep)',
    title: 'Abono salarial 2026: quem tem direito e quanto vou receber',
    description: 'Tem direito ao abono salarial de 2026 quem trabalhou com carteira assinada em 2024 ganhando até R$ 2.766. Veja os valores: R$ 136 por mês trabalhado.',
    h1: 'Quem tem direito ao abono salarial (PIS/Pasep) em 2026?',
    lead: 'O abono salarial paga até 1 salário mínimo por ano a quem trabalhou com carteira assinada ganhando pouco. Em 2026, o pagamento é referente ao trabalho feito em 2024.',
    quick: [
      'Ter trabalhado com carteira assinada, ou como servidor público, por pelo menos 30 dias em 2024.',
      'Ter recebido, em média, até R$ 2.766 por mês em 2024.',
      'Estar cadastrado no PIS ou no Pasep há pelo menos 5 anos.',
      'O valor é de R$ 136 por mês trabalhado, até R$ 1.621.',
      'O dinheiro fica disponível até 30/12/2026.',
    ],
    sections: [
      {
        h2: 'Quanto vou receber',
        paragraphs: ['O valor é o salário mínimo de 2026 (R$ 1.621) dividido por 12 e multiplicado pelos meses trabalhados em 2024:'],
        list: [
          '1 mês: R$ 136; 2 meses: R$ 271; 3 meses: R$ 406.',
          '4 meses: R$ 541; 5 meses: R$ 675; 6 meses: R$ 811.',
          '7 meses: R$ 946; 8 meses: R$ 1.081; 9 meses: R$ 1.216.',
          '10 meses: R$ 1.351; 11 meses: R$ 1.486; 12 meses: R$ 1.621.',
        ],
      },
      {
        h2: 'Como consultar e sacar',
        list: [
          'Consulte pelo aplicativo Carteira de Trabalho Digital ou pelo gov.br.',
          'O empregador precisa ter informado seus dados corretamente no eSocial ou na RAIS.',
          'Os valores de 2026 ficam disponíveis até 30/12/2026.',
        ],
      },
      {
        h2: 'O limite de renda vai mudar',
        paragraphs: [
          'A Emenda Constitucional 135/2024 mudou a regra: o limite de renda passa a ser corrigido pela inflação (INPC) e vai diminuir aos poucos, ano a ano, até chegar a 1,5 salário mínimo. Por isso o limite de cada ano pode ser diferente.',
        ],
      },
    ],
    faq: [
      { q: 'Quem trabalhou em 2025 recebe em 2026?', a: 'Não. O abono pago em 2026 é referente ao trabalho feito em 2024. O trabalho de 2025 conta para o calendário seguinte.' },
      { q: 'Qual o valor do abono salarial em 2026?', a: 'De R$ 136 (1 mês trabalhado) a R$ 1.621 (12 meses trabalhados) em 2024.' },
      { q: 'Até quando posso sacar?', a: 'Até 30/12/2026.' },
    ],
    related: ['seguro-desemprego', 'cadunico', 'minha-casa-minha-vida', 'farmacia-popular'],
    sources: [{ label: 'Abono Salarial, Ministério do Trabalho e Emprego', url: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial' }],
  },
  {
    slug: 'pix-mei',
    card: 'Pix MEI',
    title: 'Pix MEI existe? O que se sabe e como evitar golpes',
    description: 'O Pix MEI foi anunciado, mas ainda não existe como benefício. Veja o que se sabe até outubro de 2026 e como se proteger de golpes que usam o nome do programa.',
    h1: 'O Pix MEI já existe?',
    lead: 'O Pix MEI foi anunciado para microempreendedores individuais, mas até outubro de 2026 não havia um benefício em funcionamento. Golpistas usam esse tipo de anúncio para enganar pessoas.',
    quick: [
      'Até outubro de 2026, o Pix MEI não estava em funcionamento.',
      'Ninguém do governo cobra para liberar benefício.',
      'Não passe senhas, códigos recebidos por SMS ou dados do seu MEI para quem oferecer o benefício.',
    ],
    sections: [
      {
        h2: 'Como se proteger de golpes',
        list: [
          'Desconfie de mensagens, ligações e sites que prometem dinheiro em troca de uma taxa.',
          'Informações oficiais estão nos sites que terminam em gov.br.',
          'Se receber uma oferta suspeita, não clique em links e não faça pagamentos.',
        ],
      },
    ],
    faq: [
      { q: 'Preciso pagar para receber o Pix MEI?', a: 'Não. Benefícios do governo não cobram taxa para liberar dinheiro. Quem cobra provavelmente está aplicando um golpe.' },
    ],
    related: ['abono-salarial', 'desenrola-familias', 'cadunico', 'seguro-desemprego'],
    sources: [],
  },
  {
    slug: 'desenrola-familias',
    card: 'Desenrola (famílias)',
    title: 'Desenrola Famílias acabou? Prazo e o que fazer agora',
    description: 'O prazo para renegociar dívidas de famílias no Novo Desenrola Brasil acabou em 31/08/2026. Veja como eram as condições e o que fazer agora com as suas dívidas.',
    h1: 'O Desenrola para famílias ainda está valendo?',
    lead: 'Não. O prazo para as famílias renegociarem dívidas pelo Novo Desenrola Brasil terminou em 31/08/2026. O mesmo vale para o Desenrola Fies.',
    quick: [
      'O Novo Desenrola Brasil foi lançado em 4 de maio de 2026.',
      'O prazo de renegociação para famílias acabou em 31/08/2026.',
      'O Desenrola Fies também terminou em 31/08/2026.',
    ],
    sections: [
      {
        h2: 'Como eram as condições',
        list: [
          'Desconto de até 90% sobre a dívida antiga.',
          'Juros de no máximo 1,99% ao mês e parcelamento em até 48 vezes.',
          'Prazo de 35 dias para começar a pagar.',
          'Era para quem ganhava até 5 salários mínimos (R$ 8.105) e tinha dívidas contratadas até 31/01/2026, atrasadas entre 91 dias e 2 anos.',
        ],
      },
      {
        h2: 'O que fazer agora',
        list: [
          'Procure direto o banco ou a loja para negociar a dívida.',
          'Desconfie de quem cobra para "limpar o nome" ou promete descontos em nome do governo.',
          'Acompanhe o site oficial do Desenrola para saber se abrir uma nova fase.',
        ],
      },
    ],
    faq: [
      { q: 'Ainda dá para entrar no Desenrola?', a: 'Para famílias, não: o prazo terminou em 31/08/2026. Fique atento ao site oficial para novas fases.' },
    ],
    related: ['pix-mei', 'abono-salarial', 'cadunico', 'bolsa-familia'],
    sources: [{ label: 'Novo Desenrola Brasil, Ministério da Fazenda', url: 'https://desenrola.gov.br' }],
  },
];
