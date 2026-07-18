# Planejador Disney 2027

Plataforma interativa de planejamento de viagem. Abra: https://gabrielacacio-wls.github.io/disney-2027-app/

- Funciona offline e pode ser instalada na tela inicial (PWA).
- **Sincronização entre aparelhos** (aba Checklist): conecte com um token do GitHub (escopo `gist`) e o plano fica num gist secreto da sua conta — todos os aparelhos da família usam o mesmo token e veem o mesmo plano, com histórico de versões. O token fica só no navegador.
- Sem sincronização, os dados ficam salvos no navegador; use **Exportar JSON** ou **Compartilhar link** para levar o plano a outro aparelho.
- As datas-chave podem ser baixadas como calendário (.ics) na aba Resumo.

Sem build e sem dependências: `index.html` + `styles.css` + `app.js` (mais `sw.js`/`manifest.webmanifest` do PWA). Os testes (`tests/check.js`, Playwright) rodam no CI a cada PR; a versão do cache do service worker é carimbada automaticamente no merge.
