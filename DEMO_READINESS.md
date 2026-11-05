# Airmap Italia GIS — verifica di presentabilità

Ultimo controllo: 5 novembre 2026. Questa è una verifica tecnica e UX preliminare, non una certificazione legale, scientifica o di accessibilità.

## Stato attuale

**Il primo deploy GitHub Pages è attivo, ma il controllo browser ha trovato risorse non caricate sotto il sottopercorso del repository.** I percorsi di traduzioni e dati mock sono stati resi relativi al base href. Build Pages e 4 test passano in una copia pulita isolata; il commit correttivo e il nuovo controllo live sono ancora da completare. L'utente ha approvato informative provvisorie da demo, indicato il recapito `federico.croletti@gmail.com`, confermato il regime proprietario attuale e richiesto un hosting gratuito separato da `main`.

Il codice applicativo è nel commit `b948adff985346bc3b44040494c476f5d72014fd`. Il servizio Render esistente è collegato a `main` e serve il commit `d4b666d`; non è stato modificato. È stato abilitato GitHub Pages con `build_type: workflow`, source branch `demo/airmap-italia-gis`, e un workflow che pubblica solo quel branch su `https://federicocroletti-tech.github.io/airmap-italia-gis/`.

## Baseline e stato Git

- Repository: `federicocroletti-tech/airmap-italia-gis`.
- Branch: `demo/airmap-italia-gis`; il commit applicativo è `b948adf` (`Prepare Airmap demo release and remediate dependencies`).
- `main` resta a `d4b666dfa285af0e7df29f6ffe1e93c845d629ce`. Non fare push su `main`.
- Il servizio Render esistente `airmap-italia-gis` è collegato al repository `federicocroletti-tech/airmap-italia-gis`, branch `main`; l'ultimo deploy riuscito punta a `d4b666d`. Lasciarlo invariato.
- GitHub Pages è configurato in modalità workflow con source branch `demo/airmap-italia-gis`; workflow `.github/workflows/deploy-demo-pages.yml`. URL previsto: `https://federicocroletti-tech.github.io/airmap-italia-gis/`.
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
- Aggiornati README e questo handoff per descrivere l'hosting Pages e registrare la validazione runtime più recente.
- Dopo il primo deploy, il controllo browser ha mostrato che prefix `/assets/...` puntavano alla root del dominio e restituivano 404. Resi relativi il prefix i18n e gli URL dei mock in entrambi gli environment; così si risolvono rispetto al `<base href>` Pages senza alterare l'hosting alla root.

## Verifiche eseguite dopo le modifiche

| Controllo | Esito | Dettaglio |
|---|---|---|
| Installazione pulita | ✅ | `npm ci --legacy-peer-deps` su copia pulita: 383 pacchetti installati, zero vulnerabilità riportate. |
| Build produzione | ✅ | `npm run build` sulla copia correttamente sincronizzata; bundle iniziale 474,77 kB, sotto il budget di 500 kB. |
| Test unitari | ✅ | `npm test -- --watch=false --isolate=false`: 2 file, 4 test passati, inclusa persistenza dell'avviso browser. |
| NPM audit | ✅ | `npm audit`: zero vulnerabilità nell'intero lockfile dopo gli aggiornamenti. |
| Scansione CVE | ✅ | Prima scansione: 81 finding. Dopo aggiornamenti: zero finding noti nelle dipendenze individuate come interessate; report iniziale/finale e riepilogo in `.tsupgrader/`. |
| Probe HTTP della build pulita | ✅ | Entry e route SPA `/`, `/map`, `/privacy-policy`, `/cookie-policy`, `/termini-servizio` e asset IT/EN rispondono 200; traduzioni correnti controllate. |
| Runtime validation MCP | ⚠️ | Una precedente esecuzione standalone è passata (build, 4 test, audit, probe home). Il rerun dopo la correzione è stato bloccato durante `npm ci` da `EBUSY` su `node_modules` utilizzato dal server locale condiviso; non è stato terminato. Il report corrente è in `.tsupgrader/runtime-validation/standalone-result.json`. |
| Build Pages isolata dopo fix | ✅ | Copia temporanea pulita: `npm ci --legacy-peer-deps` (383 pacchetti, zero vulnerabilità), build con `--base-href /airmap-italia-gis/` (474,77 kB iniziali), 4/4 test. Verificata presenza di `assets/i18n/it.json`, mock GeoJSON e `<base href="/airmap-italia-gis/">` nell'output. |
| Browser Playwright/CDP | ⚠️ ambiente | La registrazione Playwright non ha creato la spec; Edge si è chiuso. Le pagine condivise e il tentativo di aprire la build locale hanno poi restituito timeout CDP. Non è stato verificato un flusso interattivo automatizzato in questo giro. |
| Dati mock | ✅ strutturali | 15 poligoni, 4 sensori, 2 layer, 7 punti storici, 5 KPI; JSON valido, coordinate e geometrie controllate; nessun campo `populationExposure`/`riskLevel` nelle feature. Non è una validazione scientifica. |
| Traduzioni | ✅ | 127 chiavi in ciascun file IT/EN, nessuna chiave mancante; disclosure presente in entrambe. |
| Browser locale | ✅ | A 1440×900, 1366×768, 768×1024 e 390×844, navigazione e avviso visibili; nessun overflow orizzontale. A 390×844 ricerca e layer sono prima della mappa; input ricerca a y≈263 px. |
| Navigazione mobile | ✅ | Link a Mappa, Dashboard, Analytics, Layer e Impostazioni visibili; tutte e quattro le route secondarie aperte e heading verificato. |
| Flusso di ricerca | ✅ | Ricerca “Centrale”, selezione risultato, apertura dettaglio; dettaglio senza popolazione esposta o rischio sanitario. |
| Analytics e lingua | ✅ | Route Analytics caricata senza colonne di rischio/esposizione; avviso inglese controllato. |
| Preview Render esistente | ⚠️ vecchia versione live | `https://airmap-italia-gis.onrender.com/` risponde HTTP 200 ma serve ancora la vecchia traduzione. Dashboard: servizio collegato a `main`, ultimo deploy riuscito `d4b666d`; resta invariato. |
| GitHub Pages - build isolata | ✅ | In copia pulita: `npm ci --legacy-peer-deps` (383 pacchetti, zero vulnerabilità), `npm run build -- --base-href /airmap-italia-gis/` superato; base path e copia `index.html` → `404.html` verificati. |
| GitHub Pages - workflow | ✅ | Run `42075389935` concluso con esito successivo positivo su build e deploy. Un iniziale blocco di protezione branch è stato corretto restringendo la policy dell'ambiente al branch demo. |
| GitHub Pages - browser live | ⚠️ | La home e la route `/map` si aprono, ma traduzioni e risorse mock risultano 404 per URL assoluti `/assets/...`. Fix applicato localmente; serve pushare e verificare il nuovo deploy, le route e le risorse. |
| Screenshot/video | ➖ | Nessun file definitivo o video creato. |
| `git diff --check` | ✅ | Superato dopo le modifiche documentali e l’aggiunta del piano runtime. |

Il probe HTTP precedente sulla build di produzione non ha individuato i percorsi asset root assoluti. Il controllo browser sul deploy live li ha rilevati; il fix va ancora confermato sul nuovo deploy.

## Stato deploy

1. **Limite legale intenzionale:** le pagine sono informative e provvisorie per una demo, non costituiscono documenti legali né attestano conformità. Non promuovere la demo come servizio operativo.
2. **Render:** il servizio esistente usa `main` e deve restare intatto. Un secondo Static Site Render non è disponibile senza piano Pro; non è stato fatto alcun upgrade né sostenuto alcun costo. Per la demo è stato scelto GitHub Pages, gratuito per questo repository pubblico.
3. **Copertura e browser:** 4 unit test e build Pages passano in copia pulita; il browser live ha trovato e localizzato i 404 degli asset, ora corretti nel worktree. L'installazione nel repository è evitata perché il server locale condiviso blocca alcuni file `node_modules`.

La demo può essere pubblicata con le avvertenze esplicite approvate dall'utente, ma non deve essere presentata come servizio di misurazione reale o come progetto legalmente certificato.

## Non eseguito

- Lint dedicato; audit screen reader, contrasto sistematico, tastiera completa o zoom al 200%.
- Screen reader, audit sistematico di contrasto, tastiera completa o zoom al 200%.
- Push del fix dei percorsi asset e verifica browser delle traduzioni, mock e route sul nuovo deploy.
- Screenshot/video.

## Ripresa: un solo prossimo passo

**Completare il fix live**: committare e pushare i percorsi relativi in `src/app/app.config.ts` e `src/environments/`, più questo handoff, solo sul branch `demo/airmap-italia-gis`. Poi controllare GitHub Actions e le risorse IT/EN/mock, nonché le route `/map`, `/privacy-policy`, `/cookie-policy`, `/termini-servizio`. Non toccare `main` né il servizio Render esistente.
