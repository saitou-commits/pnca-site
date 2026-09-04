# pnca-site — pnca.co.jp 修正版

Studio.Design で作られていた現行サイトを、同じ雰囲気のまま静的HTMLで作り直したものです。
サーバー不要・広告なし・追加費用なしで、GitHub Pages / Cloudflare Pages / Netlify のどれでも動きます。

## ファイル

| ファイル | 内容 |
|---|---|
| `index.html` | トップ（ABOUT / SERVICE / STORES / PRODUCTS / WORKS / SNS / RECRUIT / CONTACT） |
| `works.html` | お取り組み実績・メディア掲載の一覧 |
| `privacy.html` | プライバシーポリシー |
| `style.css` / `site.js` | 見た目と動き（ハンバーガーメニュー・フォーム送信） |
| `img/` | 公開用に軽量化した画像（`src-original/` は取得元の元画像） |
| `build_artifact.py` | Claude のプレビュー用に1ファイル化するスクリプト（公開には不要） |

## 公開前に必ずやること（3つ）

1. **問い合わせフォームの送り先** — `site.js` の先頭にある `CONTACT_ENDPOINT` に受け口URLを入れる。
   いちばん簡単なのは Google Apps Script のウェブアプリ（受け取ったJSONをメールで転送）か Formspree。
   空のままだと `CONTACT_MAILTO`（info@pnca.co.jp = Googleグループ、斉藤・牧野・岩井に配信）宛てのメール下書きが開く方式になる。
2. **内容の最終確認** — 本社住所・代表者名・各店の営業時間・広島PARCO店のオープン時期・「総フォロワー19万人」。
   Instagram の心斎橋アカウントは `@pnca.korea` に変更済み（旧 `@pancha.korea` は存在しないため）。
3. **Search Console の所有権確認タグ** — 旧サイトの `google-site-verification` を `<head>` に戻すか、DNS で確認し直す。

## 公開手順（GitHub Pages の場合）

1. GitHub に `pnca-site` リポジトリを作り、このフォルダの中身を push（`src-original/` と `build_artifact.py` は不要）。
2. Settings → Pages → Branch: main / root で公開。`https://<user>.github.io/pnca-site/` で表示を確認。
3. Settings → Pages → Custom domain に `pnca.co.jp` を入力（`CNAME` ファイルが自動生成される）。
4. ドメインのDNS（Studio に向いている A/CNAME）を GitHub Pages 用に変更:
   - `pnca.co.jp` A レコード → 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153
   - `www.pnca.co.jp` CNAME → `<user>.github.io`（www でも開けるようになる）
5. 反映後 Pages 設定で「Enforce HTTPS」をON。旧 Studio 側は解約前に一度エクスポートやスクリーンショットを保存。

## 旧サイトから変えた点

- スマホ対応（ハンバーガーメニュー、縦書き装飾は超ワイド画面のみ）
- 空だった NEWS を削除、WORKS を別ページに整理
- 店舗を4店 + POPUP に更新、MagSafeトレカケースを主力商品として追加
- プライバシーポリシー新設、フォームに同意チェック
- 年号の固定表記を廃止（© は自動で今年になる）
- title / description / OGP画像（`img/og.png`）/ 構造化データを整備
- No.1 系の表現を根拠不要の言い回しに変更（「業界イチ」→ 削除、「業界1のフォロワー数」→「トップクラス」）
- ヒーロー画像の「Offical」誤字は、画像の上に正しい文字を重ねて隠している（元画像を差し替えられればその方が確実）
