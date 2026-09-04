#!/usr/bin/env python3
"""Artifact用に1ファイルへまとめる: CSS/JS/画像をすべて埋め込む。
使い方: python3 build_artifact.py index.html out.html [works.html=URL] [privacy.html=URL] [index.html=URL]
"""
import base64, mimetypes, re, sys, os
src, out = sys.argv[1], sys.argv[2]
links = dict(a.split('=', 1) for a in sys.argv[3:])
root = os.path.dirname(os.path.abspath(src))
html = open(src, encoding='utf-8').read()

def inline_css(m):
    return '<style>\n' + open(os.path.join(root, 'style.css'), encoding='utf-8').read() + '\n</style>'
html = re.sub(r'<link rel="stylesheet" href="style\.css">', inline_css, html)
html = re.sub(r'<script src="site\.js"></script>',
              lambda m: '<script>\n' + open(os.path.join(root, 'site.js'), encoding='utf-8').read() + '\n</script>', html)

def data_uri(path):
    p = os.path.join(root, path)
    mime = mimetypes.guess_type(p)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(open(p, 'rb').read()).decode()
html = re.sub(r'(src|href)="(img/[^"]+)"', lambda m: '%s="%s"' % (m.group(1), data_uri(m.group(2))), html)

# page links
for k, v in links.items():
    html = re.sub(r'href="' + re.escape(k) + r'(#[^"]*)?"', lambda m, v=v: 'href="' + v + (m.group(1) or '') + '"', html)

# artifact wants body content only, with <title> and <style> at top
title = re.search(r'<title>(.*?)</title>', html, re.S).group(1)
style = re.search(r'<style>.*?</style>', html, re.S).group(0)
fonts = re.findall(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^"]*">', html)
body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
out_html = '<title>%s</title>\n%s\n%s\n%s' % (title, '\n'.join(fonts), style, body)
open(out, 'w', encoding='utf-8').write(out_html)
print(out, round(len(out_html.encode()) / 1024 / 1024, 2), 'MB')
