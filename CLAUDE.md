# pnca-site（pnca.co.jp 修正版）作業メモ

- 2026-09-04 作成。現行サイトは Studio.Design 製（Nuxt、コード編集不可）。同じ世界観で静的HTMLに作り直した。
- 素材の取り方: Studio は画像を `<div class="image">` + 内部 `<style>` で描くため DOM からは取れない。
  ページのデータ JSON `https://storage.googleapis.com/studio-publish/projects/M3aA0vLMqe/pOLBN3beaQ/page-views/<uuid>.json` を curl し、
  `content.src`（画像）/ `content.data`（テキスト）を辿ると全素材が取れる（home=335acdf5…、works=554e4dea…）。
- 画像加工は sips のみ（PIL 無し）。アルファ付きPNG→JPEG は白背景で合成される（確認済）。OG画像は SVG → `qlmanage -t -s 1200` → `sips -c 630 1200` で作った。
- Claude in Chrome の javascript_tool は画像URLを [BLOCKED] するので、文字を `|` で区切って返すと通る。scrollTo ループはページ読込直後だと固まる。
- プレビュー用の1ファイル化は `python3 build_artifact.py index.html out.html works.html=<URL> privacy.html=<URL>`。
- 未確定・要確認: 本社住所（北堀江 StoRK 302 のまま）、広島PARCO店のオープン時期（2026年春と記載）、問い合わせ送信先（site.js の CONTACT_ENDPOINT / CONTACT_MAILTO）。
