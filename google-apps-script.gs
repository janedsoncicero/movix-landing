/**
 * MoviX: recebe os cadastros da landing page e salva na planilha Google.
 * Como instalar: veja o README.md
 */

const SHEET_NAME = 'Leads';

// Ordem das colunas na planilha: [título da coluna, campo enviado pela página]
const COLUMNS = [
  ['Data/Hora', 'data_hora'],
  ['Status', null],
  ['Perfil', 'perfil'],
  ['Nome', 'nome'],
  ['WhatsApp', 'whatsapp'],
  ['Abrir conversa', null],
  ['Cidade', 'cidade'],
  ['UF', 'uf'],
  ['E-mail', 'email'],
  ['Já trabalha no ramo?', 'ja_trabalha'],
  ['Placas na base', 'qtd_placas'],
  ['Plataforma atual', 'plataforma_atual'],
  ['Dificuldades', 'dificuldades'],
  ['Dificuldades (texto)', 'dificuldades_outro'],
  ['O que ajudaria', 'ajuda'],
  ['O que ajudaria (texto)', 'ajuda_outro'],
  ['Tem clientela?', 'tem_clientela'],
  ['Placas dos clientes', 'qtd_clientes'],
  ['Quando quer iniciar', 'quando_iniciar'],
  ['Investimento', 'investimento'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_content', 'utm_content'],
  ['utm_term', 'utm_term'],
  ['Página', 'pagina']
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    const phone = String(data.whatsapp || '').replace(/\D/g, '');

    const row = COLUMNS.map(([title, key]) => {
      if (title === 'Status') return 'Novo';
      if (title === 'Abrir conversa') return phone ? 'https://wa.me/' + phone : '';
      return clean_(data[key]);
    });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar se o script está publicado abrindo a URL no navegador
function doGet() {
  return json_({ ok: true, message: 'MoviX leads: online' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // Usa a primeira aba (criada junto com a planilha) e renomeia para "Leads"
    sheet = ss.getSheets()[0] || ss.insertSheet(SHEET_NAME);
    sheet.setName(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS.map(c => c[0]));
  // Formatação feita uma única vez
  if (sheet.getFrozenRows() === 0) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#0f1830').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Novo', 'Em contato', 'Proposta enviada', 'Fechado', 'Perdido'], true)
      .build();
    sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  }
  return sheet;
}

// Texto simples, limitado, e sem virar fórmula na planilha
function clean_(v) {
  let s = v == null ? '' : String(v).slice(0, 1000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
