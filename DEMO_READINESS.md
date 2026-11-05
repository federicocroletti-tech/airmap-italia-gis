# Airmap Italia GIS — verifica di presentabilità

Ultimo controllo: 5 novembre 2026. Questa è una verifica tecnica e UX preliminare, non una certificazione legale, scientifica o di accessibilità.

## Stato attuale

**Demo pubblicata e verificata su GitHub Pages:** `https://federicocroletti-tech.github.io/airmap-italia-gis/`. Il run Actions `42076907953` ha completato build e deploy per `4d3476c`; home, traduzioni IT/EN, dati mock e route Angular sono stati controllati live. La verifica ha individuato e corretto i percorsi asset root-assoluti prima del deploy finale. `main` e il servizio Render esistente sono rimasti invariati.

Le richieste dirette alle route secondarie restituiscono HTTP 404 da GitHub Pages, che serve `404.html` come fallback; Angular avvia comunque la route richiesta e traduzioni/dati si caricano correttamente. È il comportamento del fallback SPA su Pages, non un errore di caricamento dell'app.

## Baseline e stato Git

- Repository: `federicocroletti-tech/airmap-italia-gis`.
- Branch: `demo/airmap-italia-gis`; ultimo commit verificato `4d3476c` (`Fix assets for GitHub Pages subpath`).
- Commit applicativo precedente: `b948adf` (`Prepare Airmap demo release and remediate dependencies`); setup Pages in `e6829f6`.
- `main` resta a `d4b666dfa285af0e7df29f6ffe1e93c845d629ce`. Non fare push su `main`.
- Il servizio Render esistente `airmap-italia-gis` è collegato al repository `federicocroletti-tech/airmap-italia-gis`, branch `main`; l'ultimo deploy riuscito punta a `d4b666d`. Lasciarlo invariato.
- GitHub Pages è configurato in modalità workflow con source branch `demo/airmap-italia-gis`; workflow `.github/workflows/deploy-demo-pages.yml`. URL live: `https://federicocroletti-tech.github.io/airmap-italia-gis/`.
- Ambiente GitHub Actions `github-pages`: policy di deploy limitata al solo branch `demo/airmap-italia-gis`.
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
- Il primo controllo browser ha rilevato che prefix `/assets/...` puntavano alla root del dominio. Resi relativi il prefix i18n e gli URL dei mock in entrambi gli environment; così si risolvono rispetto al `<base href>` Pages senza alterare l'hosting alla root.
- Configurata la protezione GitHub Actions dell'ambiente `github-pages` per autorizzare solo il branch `demo/airmap-italia-gis`.

## Verifiche eseguite dopo le modifiche

| Controllo | Esito | Dettaglio |
|---|---|---|
| Installazione pulita | ✅ | `npm ci --legacy-peer-deps` su copia pulita: 383 pacchetti installati, zero vulnerabilità riportate. |
| Build produzione | ✅ | `npm run build` sulla copia correttamente sincronizzata; bundle iniziale 474,77 kB, sotto il budget di 500 kB. |
| Test unitari | ✅ | `npm test -- --watch=false --isolate=false`: 2 file, 4 test passati, inclusa persistenza dell'avviso browser. |
| NPM audit | ✅ | `npm audit`: zero vulnerabilità nell'intero lockfile dopo gli aggiornamenti. |
| Scansione CVE | ✅ | Prima scansione: 81 finding. Dopo aggiornamenti: zero finding noti nelle dipendenze individuate come interessate; report iniziale/finale e riepilogo in `.tsupgrader/`. |
| Probe HTTP della build pulita | ✅ storico | Il precedente server locale di test rispondeva 200 alle route SPA; su Pages le richieste dirette alle route usano invece `404.html` e riportano HTTP 404. |
| Runtime validation MCP | ⚠️ | Una precedente esecuzione standalone è passata (build, 4 test, audit, probe home). Il rerun dopo la correzione è stato bloccato durante `npm ci` da `EBUSY` su `node_modules` utilizzato dal server locale condiviso; non è stato terminato. Il report corrente è in `.tsupgrader/runtime-validation/standalone-result.json`. |
| Build Pages isolata dopo fix | ✅ | Copia temporanea pulita: `npm ci --legacy-peer-deps` (383 pacchetti, zero vulnerabilità), build con `--base-href /airmap-italia-gis/` (474,77 kB iniziali), 4/4 test. Verificata presenza di `assets/i18n/it.json`, mock GeoJSON e `<base href="/airmap-italia-gis/">` nell'output. |
| Browser GitHub Pages | ✅ | Home HTTP 200 e redirect Angular a `/map`; traduzione inglese e disclosure corrette; navigazione diretta a `/map`, `/privacy-policy`, `/cookie-policy`, `/termini-servizio` renderizza la route con chiavi traduzione risolte. Gli status 404 delle richieste alle route sono il fallback Pages previsto. |
| Asset live GitHub Pages | ✅ | Traduzioni IT/EN, GeoJSON, layer, sensori, storico AQI e riepilogo dashboard: tutte le 7 richieste `assets/...` rispondono HTTP 200. |
| Dati mock | ✅ strutturali | 15 poligoni, 4 sensori, 2 layer, 7 punti storici, 5 KPI; JSON valido, coordinate e geometrie controllate; nessun campo `populationExposure`/`riskLevel` nelle feature. Non è una validazione scientifica. |
| Traduzioni | ✅ | 127 chiavi in ciascun file IT/EN, nessuna chiave mancante; disclosure presente in entrambe. |
| Browser locale | ✅ | A 1440×900, 1366×768, 768×1024 e 390×844, navigazione e avviso visibili; nessun overflow orizzontale. A 390×844 ricerca e layer sono prima della mappa; input ricerca a y≈263 px. |
| Navigazione mobile | ✅ | Link a Mappa, Dashboard, Analytics, Layer e Impostazioni visibili; tutte e quattro le route secondarie aperte e heading verificato. |
| Flusso di ricerca | ✅ | Ricerca “Centrale”, selezione risultato, apertura dettaglio; dettaglio senza popolazione esposta o rischio sanitario. |
| Analytics e lingua | ✅ | Route Analytics caricata senza colonne di rischio/esposizione; avviso inglese controllato. |
| Preview Render esistente | ⚠️ vecchia versione live | `https://airmap-italia-gis.onrender.com/` risponde HTTP 200 ma serve ancora la vecchia traduzione. Dashboard: servizio collegato a `main`, ultimo deploy riuscito `d4b666d`; resta invariato. |
| GitHub Pages - build isolata | ✅ | In copia pulita: `npm ci --legacy-peer-deps` (383 pacchetti, zero vulnerabilità), `npm run build -- --base-href /airmap-italia-gis/` superato; base path e copia `index.html` → `404.html` verificati. |
| GitHub Pages - workflow | ✅ | Run finale `42076907953` (commit `4d3476c`) completato con build e deploy riusciti. Il primo blocco di protezione branch è stato corretto autorizzando solo il branch demo. |
| GitHub Pages - fallback route | ℹ️ | Direct URL secondari caricano la corretta vista Angular tramite `404.html`, ma restano HTTP 404 per il limite del fallback statico di GitHub Pages. Navigazione client-side dalla home funziona normalmente. |
| Screenshot/video | ➖ | Nessun file definitivo o video creato. |
| `git diff --check` | ✅ | Superato dopo le modifiche documentali e l’aggiunta del piano runtime. |

Il probe di build locale non era sufficiente a testare il sottopercorso Pages: il primo deploy ha rivelato i percorsi errati. Il fix dei path relativi è ora confermato dal browser live e dalle risposte HTTP 200 di tutti gli asset mock/i18n.

## Stato deploy

1. **Limite legale intenzionale:** le pagine sono informative e provvisorie per una demo, non costituiscono documenti legali né attestano conformità. Non promuovere la demo come servizio operativo.
2. **Render:** il servizio esistente usa `main` e deve restare intatto. Un secondo Static Site Render non è disponibile senza piano Pro; non è stato fatto alcun upgrade né sostenuto alcun costo. Per la demo è stato scelto GitHub Pages, gratuito per questo repository pubblico.
3. **Copertura e browser:** 4 unit test, build Pages, live asset e route rendering verificati. Il runtime validator MCP ha una limitazione ambientale sul reinstallare dipendenze in `node_modules` bloccati dal server locale condiviso; la validazione equivalente è stata eseguita in una copia pulita isolata, senza terminare quel server.

La demo può essere pubblicata con le avvertenze esplicite approvate dall'utente, ma non deve essere presentata come servizio di misurazione reale o come progetto legalmente certificato.

## Non eseguito

- Lint dedicato e audit sistematico di screen reader, contrasto, tastiera completa o zoom al 200%.
- Screenshot/video.

## Prossimi passi facoltativi

Il deploy richiesto è completato. In un prossimo ciclo si possono svolgere audit di accessibilità, lint dedicato e screenshot definitivi. Per questo progetto statico Angular, non occorre configurare un nuovo account Gmail o acquistare un dominio: l'indirizzo GitHub Pages è già attivo e gratuito.
