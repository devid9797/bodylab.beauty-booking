# /old/ — копия прежнего сайта

Открывается только по прямой ссылке `https://bodylab-beauty.lv/old/` (noindex, закрыта в robots.txt).

Как вернуть старый сайт основным:
    git fetch origin archive/site-before-redesign-2026-11-02
    git checkout origin/archive/site-before-redesign-2026-11-02 -- .
    git commit -am "Restore previous site" && git push
(ветка `archive/site-before-redesign-2026-11-02` содержит весь прежний сайт целиком).
