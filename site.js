/* PNCA corporate site — behaviour
   1. mobile nav drawer
   2. header shadow on scroll
   3. contact form: posts JSON to CONTACT_ENDPOINT if set, otherwise opens a
      pre-filled mail draft so no inquiry is ever lost.
*/
(function () {
  'use strict';

  /* ---- 設定: 問い合わせフォームの送り先 --------------------------------
     Google Apps Script のウェブアプリURL、Formspree などのURLを入れると
     fetch(POST, JSON) で送信します。空のままなら mailto で下書きを開きます。 */
  var CONTACT_ENDPOINT = '';
  var CONTACT_MAILTO = 'info@pnca.co.jp';

  /* nav drawer */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      drawer.setAttribute('data-open', String(!open));
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('data-open', 'false');
      }
    });
  }

  /* header line */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* current year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* contact form */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var msg = form.querySelector('.form-msg');
  var button = form.querySelector('button[type="submit"]');

  function say(text, cls) {
    msg.textContent = text;
    msg.className = 'form-msg' + (cls ? ' ' + cls : '');
  }

  function collect() {
    var data = {};
    var types = [];
    form.querySelectorAll('input[name="type"]:checked').forEach(function (c) { types.push(c.value); });
    data['お問い合わせ種別'] = types.join(' / ');
    ['company', 'department', 'name', 'kana', 'email', 'tel', 'message'].forEach(function (k) {
      var el = form.elements[k];
      data[el.getAttribute('data-label') || k] = el.value.trim();
    });
    data['送信元ページ'] = location.href;
    return data;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('.hp input').value) return; /* bot */

    var types = form.querySelectorAll('input[name="type"]:checked');
    if (!types.length) { say('お問い合わせ種別を1つ以上選んでください。', 'err'); return; }
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.elements.email.value.trim() !== form.elements.email2.value.trim()) {
      say('メールアドレスが確認用と一致していません。', 'err');
      form.elements.email2.focus();
      return;
    }

    var data = collect();

    if (CONTACT_ENDPOINT) {
      button.disabled = true;
      say('送信しています…');
      fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(data)
      }).then(function () {
        say('送信しました。担当者より2〜3営業日以内にご連絡いたします。', 'ok');
        form.reset();
      }).catch(function () {
        say('送信に失敗しました。時間をおいて再度お試しください。', 'err');
      }).finally(function () { button.disabled = false; });
      return;
    }

    /* mailto fallback */
    var lines = Object.keys(data).map(function (k) { return k + ': ' + data[k]; });
    var subject = '【お問い合わせ】' + data['お問い合わせ種別'] + '｜' + data['法人・団体名'];
    location.href = 'mailto:' + CONTACT_MAILTO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    say('メールソフトが開きます。そのまま送信してください。', 'ok');
  });
})();
