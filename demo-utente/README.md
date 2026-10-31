# Demo utente AirMap Italia

Video promozionale che simula un percorso utente plausibile all'interno dell'app:

1. apre la mappa AQI di Milano;
2. cerca il quartiere Centrale;
3. seleziona l'area e legge AQI, PM10, PM2.5, NO2 e storico;
4. apre l'analisi territoriale e confronta le zone.

## Output

- `airmap-demo-utente-wide.mp4` — 1920 × 1080, adatto a presentazioni, sito e YouTube.
- `airmap-demo-utente-vertical.mp4` — 1080 × 1920, adatto a Stories, Reels e Shorts.
- `cover-wide.png`, `cover-vertical.png` — copertine.
- `airmap-voiceover-it.wav` — voce sintetica italiana generata localmente da Windows.
- `demo.srt` — sottotitoli italiani.
- `copy-social.md` — copy pronto per LinkedIn, Reels/TikTok, YouTube Shorts.

## Accuratezza della demo

Le schermate sono una ricostruzione illustrativa dell'interfaccia AirMap, non una registrazione live dell'app. Mappa schematica e pannelli sono generati dallo script; i valori provengono dagli asset mock del progetto. Il dataset mostra aggiornamenti del **24 luglio 2026**: i video riportano quindi in modo visibile «DATI MOCK · 24 LUG 2026 · NON IN TEMPO REALE». Non sono dati attuali, misure reali garantite o indicazioni sanitarie.

Il percorso segue le funzioni presenti nel codice: mappa, ricerca aree, dettaglio con metriche/storico ed azione di analisi/ranking. La vista analitica mostra i ranking delle aree, non una previsione o un consiglio.

## Rigenerazione

Prerequisiti: Python 3, Pillow, FFmpeg con encoder H.264 (`libx264`) e una voce `it-IT` installata in Windows.

```powershell
.\generate-voiceover.ps1
py -3 .\render_demo.py
```

Non sono richiesti pacchetti npm aggiuntivi, connessioni a servizi di mappe o dati live. Non è inclusa musica.
