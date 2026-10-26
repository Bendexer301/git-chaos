# 🌀 Git Chaos

Eine kleine Webseite, an der alle gleichzeitig arbeiten – **ohne Absprache**.
Bau ein, was du willst, und hoffe, dass die anderen es nicht kaputt machen.

## Loslegen

1. Repo klonen:
   ```bash
   git clone <REPO-URL>
   cd git-chaos
   ```
2. `index.html` im Browser öffnen (Doppelklick reicht, kein Server nötig).
3. Loslegen!

## Was ist schon drin?

| Datei        | Inhalt                                             |
|--------------|----------------------------------------------------|
| `index.html` | Seite mit Klick-Zähler, Todo-Liste, Sprüchen, Gästebuch |
| `style.css`  | Das Aussehen                                       |
| `script.js`  | Die Logik                                          |

Ideen: neues Feature, anderes Design, Dark Mode, Mini-Spiel, Animationen,
eigener Spruch, Gästebuch-Eintrag … oder einfach alles umbauen.

## Git-Spickzettel

```bash
git pull                     # neueste Änderungen holen (oft machen!)
git status                   # was hab ich geändert?
git add .                    # alle Änderungen vormerken
git commit -m "Was ich getan hab"
git push                     # hochladen
```

### Push wird abgelehnt?

Jemand war schneller. Erst `git pull`, dann nochmal `git push`.

### Merge-Konflikt?

Git zeigt in der Datei sowas an:

```text
deine Version
die Version der anderen
```

Entscheide, was bleiben soll, lösche die Markierungen (`<<<<<<<`, `=======`, `>>>>>>>`), dann:

```bash
git add .
git commit -m "Konflikt gelöst"
git push
```

## Regeln

1. Es gibt keine Regeln.
2. Okay, eine: **kein `git push --force`.** 🙏

Am Ende der Stunde schauen wir uns gemeinsam an, was aus der Seite geworden ist.
