# Airmap Italia GIS — verifica di presentabilità

Ultimo controllo: 5 novembre 2026. Questa è una verifica tecnica e UX preliminare, non una certificazione legale, scientifica o di accessibilità.

## Stato attuale

**La build e i test sono validati; è pronto il deploy GitHub Pages, che sarà verificato dopo il push del workflow.** La validazione runtime MCP del 5 novembre 2026 è passata (build, 4 test, audit dipendenze e probe HTTP della home). In precedenza lo stesso runner era scaduto durante l'installazione; il risultato positivo più recente sostituisce quel blocco. L'utente ha approvato informative provvisorie da demo, indicato il recapito `federico.croletti@gmail.com`, confermato il regime proprietario attuale e richiesto un hosting gratuito separato da `main`.

Il codice applicativo è nel commit `b948adff985346bc3b44040494c476f5d72014fd`. Il servizio Render esistente è collegato a `main` e serve il commit `d4b666d`; non è stato modificato. È stato abilitato GitHub Pages con `build_type: workflow`, source branch `demo/airmap-italia-gis`, e un workflow che pubblica solo quel branch su `https://federicocroletti-tech.github.io/airmap-italia-gis/`.

## Baseline e stato Git

- Repository: `federicocroletti-tech/airmap-italia-gis`.
- Branch: `demo/airmap-italia-gis`; il commit applicativo è `b948adf` (`Prepare Airmap demo release and remediate dependencies`).
- `main` resta a `d4b666dfa285af0e7df29f6ffe1e93c845d629ce`. Non fare push su `main`.
- Il servizio Render esistente `airmap-italia-gis` è collegato al repository `federicocroletti-tech/airmap-italia-gis`, branch `main`; l'ultimo deploy riuscito punta a `d4b666d`. Lasciarlo invariato.
- GitHub Pages è configurato in modalità workflow con source branch `demo/airmap-italia-gis`; workflow `.github/workflows/deploy-demo-pages.yml`. URL previsto: `https://federicocroletti-tech.github.io/airmap-italia-gis/`.
- Render non permette di creare un secondo Static Site con il piano attuale (opzione `Pro` disabilitata, `25/25`); non è stato eseguito alcun upgrade né sostenuto alcun costo.
- Aggiunto `.tsupgrader/runtime-validation/eval-plan.json` per ripetere installazione, build, test e probe HTTP; usa il probe come fallback perché la registrazione Playwright non è riuscita.

## Modifiche applicate nella preparazione GitHub Pages

- Aggiunto un avviso persistente e tradotto IT/EN che identifica i dati come sintetici, statici, non aggiornati e inadatti a decisioni ambientali o sanitarie.
- Rimossi dai dati GeoJSON e dalle interfacce di mappa, dettaglio e analytics i campi non supportati di popolazione esposta e rischio sanitario; rimossi anche da ricerca e modello tipizzato.
- Aggiunta navigazione mobile per le cinque sezioni principali; spostati i controlli di ricerca/layer prima della mappa sui viewport fino a 1024 px.
- Rimosso il collegamento segnaposto `mailto:info@example.com`.
- Sostituito il finto banner di consenso cookie (le categorie analytics/marketing non attivavano servizi) con un avviso bilingue e persistente sull'uso di `localStorage`; aggiunta una verifica unitaria sulla persistenza della chiusura.
- Rimpiazzati i placeholder legali con informative dimostrative IT/EN che descrivono storage locale, richieste alle tessere OpenStreetMap, assenza di tracking app, limiti dei dati e referente indicato. Non sono un parere legale o una dichiarazione di conformità.
- Chiarito `PROPRIETA-E-TUTELA.md`: il regime proprietario in `LICENSE` vale per le versioni dal 24 ottobre 2026; le distribuzioni MIT precedenti mantengono i termini originari, come confermato dall'utente.
- Aggiornati Angular e il lockfile per eliminare gli advisory noti; dettaglio in `.tsupgrader/cve-fix-summary.md`.
- Allineato il comando build Render a `npm ci --legacy-peer-deps`, come già documentato nel README.
- Aggiornato README e piano runtime per descrivere disclosure e controlli aggiornati.
- Aggiunto `.github/workflows/deploy-demo-pages.yml`, limitato ai push su `demo/airmap-italia-gis`; il workflow compila con il base path del repository, prepara il fallback SPA `404.html` e pubblica con GitHub Pages.
- Aggiornati README e questo handoff per descrivere l'hosting Pages e registrare la validazione runtime più recente.

## Verifiche eseguite dopo le modifiche

| Controllo | Esito | Dettaglio |
|---|---|---|
| Installazione pulita | ✅ | `npm ci --legacy-peer-deps` su copia pulita: 383 pacchetti installati, zero vulnerabilità riportate. |
| Build produzione | ✅ | `npm run build` sulla copia correttamente sincronizzata; bundle iniziale 474,77 kB, sotto il budget di 500 kB. |
| Test unitari | ✅ | `npm test -- --watch=false --isolate=false`: 2 file, 4 test passati, inclusa persistenza dell'avviso browser. |
| NPM audit | ✅ | `npm audit`: zero vulnerabilità nell'intero lockfile dopo gli aggiornamenti. |
| Scansione CVE | ✅ | Prima scansione: 81 finding. Dopo aggiornamenti: zero finding noti nelle dipendenze individuate come interessate; report iniziale/finale e riepilogo in `.tsupgrader/`. |
| Probe HTTP della build pulita | ✅ | Entry e route SPA `/`, `/map`, `/privacy-policy`, `/cookie-policy`, `/termini-servizio` e asset IT/EN rispondono 200; traduzioni correnti controllate. |
| Runtime validation MCP | ✅ | Esecuzione standalone completata il 5 novembre 2026: setup riuscito, build produzione superata (474,77 kB iniziali), 4/4 test superati, audit dipendenze superato e probe HTTP home 200. Dettaglio riproducibile in `.tsupgrader/runtime-validation/standalone-result.json`. |
| Browser Playwright/CDP | ⚠️ ambiente | La registrazione Playwright non ha creato la spec; Edge si è chiuso. Le pagine condivise e il tentativo di aprire la build locale hanno poi restituito timeout CDP. Non è stato verificato un flusso interattivo automatizzato in questo giro. |
| Dati mock | ✅ strutturali | 15 poligoni, 4 sensori, 2 layer, 7 punti storici, 5 KPI; JSON valido, coordinate e geometrie controllate; nessun campo `populationExposure`/`riskLevel` nelle feature. Non è una validazione scientifica. |
| Traduzioni | ✅ | 127 chiavi in ciascun file IT/EN, nessuna chiave mancante; disclosure presente in entrambe. |
| Browser locale | ✅ | A 1440×900, 1366×768, 768×1024 e 390×844, navigazione e avviso visibili; nessun overflow orizzontale. A 390×844 ricerca e layer sono prima della mappa; input ricerca a y≈263 px. |
| Navigazione mobile | ✅ | Link a Mappa, Dashboard, Analytics, Layer e Impostazioni visibili; tutte e quattro le route secondarie aperte e heading verificato. |
| Flusso di ricerca | ✅ | Ricerca “Centrale”, selezione risultato, apertura dettaglio; dettaglio senza popolazione esposta o rischio sanitario. |
| Analytics e lingua | ✅ | Route Analytics caricata senza colonne di rischio/esposizione; avviso inglese controllato. |
| Preview Render esistente | ⚠️ vecchia versione live | `https://airmap-italia-gis.onrender.com/` risponde HTTP 200 ma serve ancora la vecchia traduzione. Dashboard: servizio collegato a `main`, ultimo deploy riuscito `d4b666d`; resta invariato. |
| GitHub Pages - build isolata | ✅ | In copia pulita: `npm ci --legacy-peer-deps` (383 pacchetti, zero vulnerabilità), `npm run build -- --base-href /airmap-italia-gis/` superato; base path e copia `index.html` → `404.html` verificati. |
| GitHub Pages - deploy live | ⏳ | Pages abilitato in modalità workflow; il workflow non è ancora stato pushato. Verificare il run Actions e le route live dopo il commit/push. |
| Screenshot/video | ➖ | Nessun file definitivo o video creato. |
| `git diff --check` | ✅ | Superato dopo le modifiche documentali e l’aggiunta del piano runtime. |

Il probe HTTP è stato eseguito sulla build di produzione della copia corretta; non equivale a una verifica browser visuale né alla verifica del deployment live.

## Stato deploy

1. **Limite legale intenzionale:** le pagine sono informative e provvisorie per una demo, non costituiscono documenti legali né attestano conformità. Non promuovere la demo come servizio operativo.
2. **Render:** il servizio esistente usa `main` e deve restare intatto. Un secondo Static Site Render non è disponibile senza piano Pro; non è stato fatto alcun upgrade né sostenuto alcun costo. Per la demo è stato scelto GitHub Pages, gratuito per questo repository pubblico.
3. **Copertura e browser:** 4 unit test e probe HTTP home passano; i flussi UI sono coperti solo da verifiche manuali precedenti, perché Playwright/CDP non è disponibile in questo ambiente.

La demo può essere pubblicata con le avvertenze esplicite approvate dall'utente, ma non deve essere presentata come servizio di misurazione reale o come progetto legalmente certificato.

## Non eseguito

- Lint dedicato; audit screen reader, contrasto sistematico, tastiera completa o zoom al 200%.
- Screen reader, audit sistematico di contrasto, tastiera completa o zoom al 200%.
- Push del workflow, primo run GitHub Actions e verifica HTTP delle route e degli asset su GitHub Pages.
- Screenshot/video.

## Ripresa: un solo prossimo passo

**Completare e verificare il deploy gratuito**: committare e pushare il workflow `.github/workflows/deploy-demo-pages.yml` e le note aggiornate sul solo branch `demo/airmap-italia-gis`. Poi controllare GitHub Actions e verificare `https://federicocroletti-tech.github.io/airmap-italia-gis/` e le route `/map`, `/privacy-policy`, `/cookie-policy`, `/termini-servizio`. Non toccare `main` né il servizio Render esistente.
