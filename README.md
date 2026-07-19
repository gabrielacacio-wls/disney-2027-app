# Planejador Disney 2027

Plataforma interativa de planejamento de viagem. Abra: https://gabrielacacio-wls.github.io/disney-2027-app/

- Funciona offline e pode ser instalada na tela inicial (PWA).
- **Membros da viagem editáveis** (card Documentos da família): renomeie, adicione ou remova pessoas — médias por pessoa, rateios e listas recalculam na hora.
- **Documentos & reservas** (aba Checklist): números de passaporte/visto, localizadores e validades organizados por categoria, com alerta de vencimento perto da viagem e link de um toque para o arquivo no Drive/iCloud. Atalho no card de emergência da aba Hoje.
- **Modo dia de parque** (aba Hoje): durante a viagem o app abre direto no dia atual, com lembretes contextuais do parque (Rider Switch/Child Swap), mochila do dia, alturas das crianças e telefone de emergência do seguro. Antes da viagem funciona como prévia navegável do roteiro.
- **Mapa do dia** (aba Hoje): paradas com horário e notas, pinos numerados num mapa Leaflet/OpenStreetMap (auto-hospedado), distâncias entre paradas e botão 🧭 que abre o GPS. Sem paradas manuais, o app sugere os lugares a partir do texto do roteiro.
- **Clima do dia** (aba Hoje): previsão real (Open-Meteo, sem chave) para dias a até 16 dias, seguindo a localização da primeira parada; datas distantes mostram a média típica do mês em Orlando.
- **Filas ao vivo** (aba Hoje): em dia de parque, os tempos de espera em tempo real das atrações (Queue-Times.com), com badges mostrando o que José e Laura já alcançam pela altura.
- **Compartilhar o dia**: botão que monta o resumo (plano, clima, paradas, lembretes) e envia por WhatsApp ou pela folha de compartilhamento do celular.
- **Registro de gastos** (aba Hoje): digite o valor, toque na categoria e pronto — o lançamento alimenta a coluna "Real" dos Custos e o app avisa quando uma categoria estoura o orçado.
- **Sincronização entre aparelhos** (aba Checklist): conecte com um token do GitHub (escopo `gist`) e o plano fica num gist secreto da sua conta — todos os aparelhos da família usam o mesmo token e veem o mesmo plano, com histórico de versões. O token fica só no navegador.
- Sem sincronização, os dados ficam salvos no navegador; use **Exportar JSON** ou **Compartilhar link** para levar o plano a outro aparelho.
- As datas-chave podem ser baixadas como calendário (.ics) na aba Resumo.

Sem build e sem dependências: `index.html` + `styles.css` + `app.js` (mais `sw.js`/`manifest.webmanifest` do PWA). Os testes (`tests/check.js`, Playwright) rodam no CI a cada PR; a versão do cache do service worker é carimbada automaticamente no merge.
