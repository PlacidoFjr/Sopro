import translatedContent from './christ-himself-ptbr.json';

export type ReflectionQuestions = {
  ramifications: string;
  repentance: string;
  rejoice: string;
  request: string;
};

export type Devotional = {
  id: string;
  dateKey?: string;
  title: string;
  reference: string;
  reading: string;
  reflection?: string;
  practice?: string;
  prayer?: string;
  questions?: ReflectionQuestions;
  supportingReferences?: string[];
  source?: 'christ-himself';
};

export const legacyDevotionals: Devotional[] = [
  {
    id: 'permanecer',
    title: 'O valor de permanecer',
    reference: 'João 15:1–8',
    reading:
      'Jesus usa a imagem da videira e dos ramos para falar de uma vida que cresce em relação com Deus. O fruto vem dessa conexão, cultivada com tempo e presença.',
    reflection:
      'Nem todo crescimento começa com velocidade. Às vezes, a alma volta a florescer quando descansa, recebe cuidado e permanece perto do que lhe dá vida. Hoje, você não precisa resolver tudo de uma vez.',
    practice:
      'Escolha uma tarefa de hoje e faça uma pequena pausa antes de começar. Respire com calma e lembre-se de que você pode seguir um passo por vez.',
    prayer:
      'Deus, ajuda-me a permanecer perto de ti nos dias cheios e nos dias quietos. Ensina-me a receber teu cuidado sem pressa e a confiar no crescimento que acontece no tempo certo. Amém.',
  },
  {
    id: 'descanso',
    title: 'Um descanso possível',
    reference: 'Mateus 11:28–30',
    reading:
      'Jesus convida os cansados a se aproximarem dele. Seu convite não exige que a vida esteja organizada primeiro; começa justamente onde o cansaço está.',
    reflection:
      'Descansar não é desistir do caminho. É reconhecer os próprios limites e permitir que a graça encontre você também neles. Há leveza em não carregar tudo sozinho.',
    practice:
      'Identifique uma preocupação que não precisa ser resolvida neste instante. Escreva-a ou diga-a em oração e deixe espaço para respirar.',
    prayer:
      'Jesus, recebo teu convite para descansar. Mostra-me o que posso soltar hoje e acompanha meus próximos passos com mansidão. Amém.',
  },
  {
    id: 'caminho',
    title: 'Luz para o próximo passo',
    reference: 'Salmo 119:105',
    reading:
      'A palavra de Deus é comparada à luz que orienta o caminho. Nem sempre ela revela todo o percurso; muitas vezes, ilumina apenas o passo que está diante de nós.',
    reflection:
      'A vontade de enxergar tudo antes de começar pode nos deixar parados. Fé também pode ser caminhar com a luz suficiente para o próximo passo, sem transformar incerteza em fracasso.',
    practice:
      'Pense em uma decisão pequena que está ao seu alcance hoje. Faça esse movimento com atenção, sem exigir de si todas as respostas.',
    prayer:
      'Deus, ilumina o passo de hoje. Dá-me sabedoria para agir com amor e serenidade para confiar no caminho que ainda não consigo ver. Amém.',
  },
  {
    id: 'silencio',
    title: 'Deus também está no silêncio',
    reference: '1 Reis 19:11–13',
    reading:
      'Na história de Elias, Deus não se revela no vento forte, no terremoto ou no fogo. Depois deles, vem uma voz suave e delicada.',
    reflection:
      'O silêncio não é necessariamente ausência. Há momentos em que a presença de Deus não chega como resposta pronta, mas como companhia que sustenta enquanto a resposta amadurece.',
    practice:
      'Reserve dois minutos sem notificações. Fique em silêncio e observe o que seu coração está tentando dizer.',
    prayer:
      'Deus, quando tudo parecer barulhento, ajuda-me a reconhecer tua presença suave. Dá quietude ao meu coração e coragem para escutar. Amém.',
  },
  {
    id: 'recomeco',
    title: 'A misericórdia de cada manhã',
    reference: 'Lamentações 3:22–24',
    reading:
      'Em meio à dor, o autor de Lamentações encontra esperança na fidelidade e na misericórdia de Deus, renovadas a cada manhã.',
    reflection:
      'Recomeçar não apaga o que aconteceu. Abre, porém, um espaço para que a história continue com cuidado, aprendizado e esperança. Hoje pode ser um começo pequeno, mas verdadeiro.',
    practice:
      'Escolha uma maneira gentil de recomeçar: retomar uma conversa, cuidar do corpo ou pedir ajuda para algo que pesa.',
    prayer:
      'Deus, obrigado porque tua misericórdia me encontra de novo. Ajuda-me a receber este dia sem carregar sozinho o peso de todos os outros. Amém.',
  },
  {
    id: 'cuidado',
    title: 'Você não caminha só',
    reference: 'Salmo 23',
    reading:
      'O salmista descreve Deus como pastor que guia, provê e acompanha. Até no vale escuro, a companhia permanece.',
    reflection:
      'Nem todo vale se atravessa depressa. A esperança deste salmo não está em negar os dias difíceis, mas em lembrar que você não precisa atravessá-los sem companhia.',
    practice:
      'Envie uma mensagem a alguém de confiança ou aceite a ajuda que essa pessoa oferece. Receber cuidado também é um passo de coragem.',
    prayer:
      'Pastor de minha vida, guia-me com paciência. Fica comigo nos lugares difíceis e ajuda-me a reconhecer o cuidado que chega por meio de outras pessoas. Amém.',
  },
  {
    id: 'esperanca',
    title: 'Força para quem espera',
    reference: 'Isaías 40:28–31',
    reading:
      'Isaías fala de um Deus que não se cansa e que renova a força de quem espera nele. Esperar, aqui, é continuar aberto à esperança.',
    reflection:
      'Você não precisa produzir energia que ainda não tem. Às vezes, a força volta aos poucos: numa noite de sono, numa conversa honesta, num pedido de ajuda ou numa oração curta.',
    practice:
      'Pergunte a si mesmo do que precisa para atravessar bem as próximas horas. Se puder, dê a si mesmo uma parte disso.',
    prayer:
      'Deus, renova minhas forças com delicadeza. Ensina-me a esperar com esperança e a buscar o apoio de que preciso para hoje. Amém.',
  },
];

type TranslatedDevotional = {
  dateKey: string;
  title: string;
  reference: string;
  summary: string;
  questions: ReflectionQuestions;
  supportingReferences: string[];
};

export const dailyDevotionals: Devotional[] = (translatedContent as unknown as TranslatedDevotional[]).map((item) => ({
  id: `christ-himself-${item.dateKey}`,
  dateKey: item.dateKey,
  title: item.title,
  reference: item.reference,
  reading: item.summary,
  questions: item.questions,
  supportingReferences: item.supportingReferences,
  source: 'christ-himself',
}));

// Keep old locally stored favorites and notes resolvable after replacing demo content.
export const devotionals: Devotional[] = [...dailyDevotionals, ...legacyDevotionals];

export function getTodayDevotional(now = new Date()): Devotional {
  const dateKey = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return dailyDevotionals.find((item) => item.dateKey === dateKey) ?? dailyDevotionals[0];
}

export function formatToday(now = new Date()): string {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
  return formatted.charAt(0).toLocaleUpperCase('pt-BR') + formatted.slice(1);
}
