# Sopro — devocional diário

Aplicativo iOS em Expo/React Native, em português do Brasil. O app traz um ciclo offline de 366 devocionais matinais de Christ Himself, traduzidos e adaptados para português brasileiro, com perguntas de reflexão e referências para leitura na Bíblia.

## O que já funciona

- Devocional do dia escolhido pela data local, com conteúdo para os 366 dias do ano, incluindo 29 de fevereiro.
- Tela de leitura com resumo, quatro perguntas de reflexão e referências bíblicas relacionadas.
- Biblioteca com o ciclo anual e indicação das leituras concluídas.
- Caderno com uma anotação editável por devocional, salva automaticamente no aparelho.
- Favoritos e leituras concluídas guardados localmente no aparelho.
- Lembrete diário local opcional, com horário ajustável e sem conta ou servidor.
- Tamanho padrão ou maior para o texto das leituras.
- Aparência clara ou noturna, aplicada de forma consistente às telas e à barra de navegação.
- Preferências protegidas junto aos dados locais do app.
- Navegação entre “Hoje”, “Leituras”, “Caderno” e “Salvos”.
- Conteúdo disponível offline; não há conta, servidor ou coleta de dados.
- Atribuição e licença do conteúdo de Christ Himself registradas em `CONTENT-LICENSE.md`.

## Identidade visual

- Fundo cinza-esverdeado `#E8ECE9`, tinta verde profunda `#263B36`, ameixa `#685764`, líquen `#596D62` e latão `#B9A35F` reservado a pequenos acentos.
- Georgia dá personalidade aos títulos e aos trechos editoriais; a sans-serif do sistema mantém navegação e ações familiares no iPhone.
- “Hoje” funciona como uma página de leitura: data, título, referência, contexto do texto, reflexão e uma única ação para continuar.
- O detalhe de ramo é feito com formas nativas e fica fora do caminho do texto. As telas evitam a pilha de cards e o padrão de dashboard.
- A leitura completa preserva as quatro perguntas da fonte — implicações, arrependimento, gratidão e pedidos — com conclusão ao final.

### Modelos e princípios consultados

- [Apple Human Interface Guidelines — Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars): barra de abas persistente e consistente.
- [Apple Human Interface Guidelines — Layout](https://developer.apple.com/design/human-interface-guidelines/layout): hierarquia, margens e adaptação a diferentes telas.
- [YouVersion — planos de leitura](https://help.youversion.com/l/en/article/zpuse5z891-bible-com-plans): sequência diária com devocional e referências bíblicas.
- [Abide — App Store](https://apps.apple.com/us/app/abide-daily-scripture-study/id6755150818): referência de produto para uma experiência diária de escritura e reflexão.

As referências servem para avaliar a estrutura e os padrões de uso; a composição e a identidade do Sopro são próprias.

## Rodar no iPhone

1. Instale o Expo Go no iPhone.
2. No computador, entre nesta pasta e rode `npm run start`.
3. Leia o QR code no Expo Go, com os dois dispositivos na mesma rede.

Para abrir a prévia web, use `npm run web`.

## Conteúdo e atribuição

Os resumos e as perguntas da edição matinal foram traduzidos do português europeu e adaptados para português brasileiro. A fonte autoriza esses materiais sob CC BY-NC-SA 4.0, com atribuição, compartilhamento pela mesma licença e sem uso comercial sem autorização adicional. A licença das reflexões não inclui texto de traduções bíblicas; por isso, o app exibe referências, não os versículos. Consulte `CONTENT-LICENSE.md` antes de redistribuir ou monetizar o app.

## Antes de publicar

- Escolher e revisar a tradução bíblica e confirmar os direitos de distribuição dos trechos. O protótipo usa referências bíblicas e textos explicativos próprios, sem reproduzir o texto integral de uma tradução.
- Definir abordagem teológica, tom editorial e responsável pela revisão dos devocionais.
- Fazer revisão editorial e teológica humana da tradução e dos títulos em português brasileiro.
- Criar ícone, tela de abertura, nome final e metadados da App Store.
- Confirmar e substituir o identificador provisório `com.placidojr.sopro` caso outro identificador pertença à sua conta Apple.
- A prévia web não agenda notificações; lembretes devem ser configurados no app instalado no aparelho.
- Fazer revisão de acessibilidade e leitura em iPhone, incluindo VoiceOver, tamanho de texto e modo escuro.
- Para um build iOS de produção, configurar Apple Developer e EAS Build na nuvem ou compilar em um Mac com Xcode.

## Próximos passos sugeridos

1. Escolher a tradição/abordagem e a tradução bíblica desejadas.
2. Escrever e revisar um ciclo editorial inicial (por exemplo, 30 dias).
3. Abrir o protótipo no iPhone e ajustar fonte, espaçamento, VoiceOver e conteúdo.
4. Revisar contraste e VoiceOver nos dois temas em um iPhone.
5. Avaliar planos temáticos e áudio depois de validar o fluxo diário.
6. Preparar assinatura, ícone e build de teste para iOS.
