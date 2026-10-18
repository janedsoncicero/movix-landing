# MoviX: landing page

Página: `index.html`. É um arquivo único, sem dependências, e pode ser hospedado em qualquer lugar (GitHub Pages, Netlify, Vercel, Hostinger, etc.).

## Arquivos

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | A landing page com o funil de cadastro |
| `google-apps-script.gs` | Script que salva os cadastros em uma planilha Google |
| `logo-movix-wordmark.png` | Logo do topo (fundo transparente) |
| `logo-movix-full.png` | Logo com slogan, usada no rodapé |
| `logo-movix-original.jpg` | Arte original da logo (também usada na prévia de links) |
| `favicon.png` | Ícone da aba do navegador |

## O funil

1. **Você já trabalha com rastreamento?**
   - **Sim** → quantas placas (até 50 / 51–100 / 101–150 / mais de 150) → plataforma atual (opcional) → dificuldades → o que ajudaria → contato
   - **Não** → já tem clientes interessados? → (se sim) quantas placas → quando quer começar (imediatamente / 1 mês / 3 meses / pesquisando) → quanto quer investir (R$ 300 a R$ 10.000+) → contato
2. **Contato:** nome, WhatsApp, cidade/UF, e-mail (opcional) e autorização de contato.

Todo cadastro vai para a planilha com: respostas do funil, contato, link direto para abrir a conversa no WhatsApp, coluna **Status** (Novo, Em contato, Proposta enviada, Fechado, Perdido) e a origem do anúncio (`utm_source`, `utm_campaign`, `utm_content`...).

Depois de enviar, a pessoa vê um botão para chamar a MoviX no WhatsApp com uma mensagem já preenchida com o resumo do cadastro.

## Configuração (uma vez só, cerca de 5 minutos)

### 1. Planilha e script
A planilha já foi criada no Google Drive: **MoviX - Cadastros da Landing Page**
(https://docs.google.com/spreadsheets/d/1BPR5qfT6n_AYfiXc-D8btqgGURwD7o-1Eo2gIhWUQnk/edit).

1. Abra a planilha e vá em **Extensões → Apps Script**.
2. Apague o conteúdo do editor, cole todo o conteúdo de `google-apps-script.gs` e salve.
3. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Autorize o acesso quando o Google pedir e copie a **URL do app da Web** (termina em `/exec`).

No primeiro cadastro, o script renomeia a aba para **Leads**, deixa o cabeçalho em destaque, congela a primeira linha e cria a lista de status (Novo, Em contato, Proposta enviada, Fechado, Perdido).

### 2. Ligar a página à planilha
> Já configurado: o `SCRIPT_URL` do `index.html` aponta para o script da planilha MoviX - Cadastros da Landing Page.

No `index.html`, procure por `CONFIG` (perto do início do `<script>`) e preencha:

```js
const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/XXXXXXXX/exec",
  WHATSAPP: "5511999998888"   // número da MoviX: 55 + DDD + número, só números
};
```

### 3. Testar
Abra a página, faça um cadastro de teste e confira se a linha apareceu na aba **Leads** da planilha.

> Se você alterar o script depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para a URL continuar a mesma.

## Fotos dos veículos
As fotos ficam na pasta `img/`, no formato 16:10 (1600 x 1000 px). Para trocar uma foto, substitua o arquivo mantendo o nome:

| Arquivo | Cartão |
| --- | --- |
| `img/carro.jpg` | Carros |
| `img/moto.jpg` | Motos |
| `img/caminhao.jpg` | Caminhões e frotas |
| `img/maquina.jpg` | Máquinas pesadas |

Por cima de cada foto a página desenha o marcador de localização, um trecho de rota e as etiquetas de status, marcadas como "Dados de demonstração". A posição do marcador e da rota fica no próprio `index.html`, no `<svg class="v-ui">` de cada cartão (coordenadas de 0 a 1600 na horizontal e 0 a 1000 na vertical).

> As fotos atuais são imagens de divulgação de fabricantes (VW, BMW, Iveco, JCB). Antes de usar em anúncios, troque por fotos próprias ou de banco de imagens com licença comercial.

## Veículos online
O número do cartão "veículos online" varia sozinho entre 4.740 e 4.890. Para mudar a faixa, procure `MIN` e `MAX` no `<script>`.

## Cores e textos
- As cores ficam no topo do `<style>`, em `:root` (`--accent`, `--accent-2`, `--grad`).
- Perguntas e opções do funil ficam no objeto `STEPS` dentro do `<script>`.

## Anúncios: Pixel da Meta e Google Ads
No `CONFIG` do `index.html`, preencha os IDs (o que ficar vazio não é carregado):

```js
META_PIXEL_ID: "123456789012345",     // Gerenciador de Eventos da Meta
GOOGLE_ADS_ID: "AW-123456789",        // Google Ads → Metas → Conversões
GOOGLE_ADS_LEAD_LABEL: "AbCdEfGhIjk", // rótulo da conversão "Cadastro"
GA4_ID: "G-ABC123XYZ"                 // opcional
```

Eventos enviados automaticamente:

| Momento | Meta | Google |
| --- | --- | --- |
| Página aberta | `PageView` | visita da página |
| Primeira resposta do cadastro | `InicioCadastro` (personalizado) | `begin_signup` |
| Cadastro concluído | `Lead` | conversão do Google Ads + `generate_lead` |
| Clique em qualquer botão de WhatsApp | `Contact` | `contato_whatsapp` |

Use **Lead** como evento de otimização das campanhas de cadastro na Meta e a conversão de cadastro no Google Ads.

## Política de privacidade
A página `politica-de-privacidade.html` está ligada ao formulário e ao rodapé. Ela cita o uso do Pixel da Meta e das ferramentas do Google. Se mudar a forma de contato ou o prazo de guarda dos dados, atualize o texto e a data no topo.

## Telas do aplicativo
`img/app-lista.jpg`, `img/app-mapa.jpg` e `img/app-lista-mapa.jpg` são prints reais do aplicativo com nomes, placas, IMEIs, endereços e quantidades trocados por dados fictícios (a página informa isso abaixo das telas).
