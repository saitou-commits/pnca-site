/**
 * pnca.co.jp お問い合わせフォーム 受信用 (Google Apps Script ウェブアプリ)
 *
 * 仕組み: サイトの site.js が JSON を POST → このスクリプトが info@pnca.co.jp へメール転送
 *         + スプレッドシートに1行追記(控え)。
 *
 * デプロイ手順:
 *   1. script.google.com で新規プロジェクト → このコードを貼る
 *   2. 右上「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      実行ユーザー: 自分 / アクセスできるユーザー: 全員
 *   3. 出てきたウェブアプリURLを site.js の CONTACT_ENDPOINT に貼る
 */

var TO = 'info@pnca.co.jp';
var SUBJECT_PREFIX = '【pnca.co.jp お問い合わせ】';
var SHEET_NAME = 'お問い合わせ';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var type = data['お問い合わせ種別'] || '';
    var company = data['法人・団体名'] || '';
    var name = data['氏名'] || '';
    var email = data['メールアドレス'] || '';

    var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
    var body = lines.join('\n') + '\n\n受信日時: ' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');

    MailApp.sendEmail({
      to: TO,
      subject: SUBJECT_PREFIX + type + '｜' + company + ' ' + name + ' 様',
      body: body,
      replyTo: email || undefined,
      name: 'pnca.co.jp お問い合わせフォーム'
    });

    appendToSheet_(data);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

/* 控えをスプレッドシートに残す (スクリプトに紐づくシートが無ければ自動作成) */
function appendToSheet_(data) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('pnca.co.jp お問い合わせ控え');
    props.setProperty('SHEET_ID', ss.getId());
  }
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  var keys = ['お問い合わせ種別', '法人・団体名', '所属部署', '氏名', 'フリガナ', 'メールアドレス', '電話番号', 'お問い合わせ内容', '送信元ページ'];
  if (sh.getLastRow() === 0) sh.appendRow(['受信日時'].concat(keys));
  sh.appendRow([new Date()].concat(keys.map(function (k) { return data[k] || ''; })));
}

/* 動作テスト用: エディタから実行すると info@ へテストメールが届く */
function testSend() {
  var fake = { postData: { contents: JSON.stringify({
    'お問い合わせ種別': 'その他', '法人・団体名': 'テスト株式会社', '所属部署': '', '氏名': 'テスト太郎', 'フリガナ': 'テストタロウ',
    'メールアドレス': 'saitou@pnca.co.jp', '電話番号': '000-0000-0000', 'お問い合わせ内容': 'フォームの動作テストです。', '送信元ページ': 'test'
  }) } };
  Logger.log(doPost(fake).getContent());
}
