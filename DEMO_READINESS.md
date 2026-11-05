# Airmap Italia GIS — verifica di presentabilità

Ultimo controllo: 5 novembre 2026. Questa è una verifica tecnica e UX preliminare, non una certificazione legale, scientifica o di accessibilità.

## Stato attuale

**Pronta la versione per la pubblicazione come demo non operativa, non come servizio ambientale o sanitario.** Build, test, audit npm, scansione CVE e probe HTTP sulla copia pulita sono superati. L'utente ha approvato informative provvisorie da demo, indicato il recapito `federico.croletti@gmail.com`, confermato il regime proprietario attuale e chiesto di pubblicare su Render. Il deploy non è ancora stato eseguito; la validazione automatizzata MCP continua a scadere nel setup, mentre i controlli equivalenti sono stati eseguiti manualmente.

Non sono ancora stati effettuati commit, push o deploy. Le modifiche applicative e documentali sono nel worktree.

## Baseline e stato Git

- Repository: `federicocroletti-tech/airmap-italia-gis`.
- Branch: `demo/airmap-italia-gis`.
- HEAD: `35a4e0fbf11084a448bada4e1255ceabc9b1cd67` (`Add illustrative user demo assets`, 2026-10-31).
- Alla verifica del 5 novembre, `git ls-remote` ha confermato `origin/demo/airmap-italia-gis` a `35a4e0fbf11084a448bada4e1255ceabc9b1cd67`; `main` punta a `d4b666dfa285af0e7df29f6ffe1e93c845d629ce`. Non fare push su `main`.
- Modifiche locali attese: dati/UI demo responsive, disclosure privacy/cookie/termini, dipendenze, README, Render blueprint, piano e report di validazione. Controllare `git status` prima di continuare.
- Aggiunto `.tsupgrader/runtime-validation/eval-plan.json` per ripetere installazione, build, test e probe HTTP; usa il probe come fallback perché la registrazione Playwright non è riuscita.

## Modifiche applicate in questo ciclo

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

## Verifiche eseguite dopo le modifiche

| Controllo | Esito | Dettaglio |
|---|---|---|
| Installazione pulita | ✅ | `npm ci --legacy-peer-deps` su copia pulita: 383 pacchetti installati, zero vulnerabilità riportate. |
| Build produzione | ✅ | `npm run build` sulla copia correttamente sincronizzata; bundle iniziale 474,77 kB, sotto il budget di 500 kB. |
| Test unitari | ✅ | `npm test -- --watch=false --isolate=false`: 2 file, 4 test passati, inclusa persistenza dell'avviso browser. |
| NPM audit | ✅ | `npm audit`: zero vulnerabilità nell'intero lockfile dopo gli aggiornamenti. |
| Scansione CVE | ✅ | Prima scansione: 81 finding. Dopo aggiornamenti: zero finding noti nelle dipendenze individuate come interessate; report iniziale/finale e riepilogo in `.tsupgrader/`. |
| Probe HTTP della build pulita | ✅ | Entry e route SPA `/`, `/map`, `/privacy-policy`, `/cookie-policy`, `/termini-servizio` e asset IT/EN rispondono 200; traduzioni correnti controllate. |
| Runtime validation MCP | ⚠️ bloccata | Il runner è scaduto nuovamente in `setup[0]:npm`, con `complete: false`, cleanup completato e nessuna asserzione. Esito in `.tsupgrader/runtime-validation/standalone-result.json`; build/test/audit/probe sono stati eseguiti direttamente in una copia pulita. |
| Browser Playwright/CDP | ⚠️ ambiente | La registrazione Playwright non ha creato la spec; Edge si è chiuso. Le pagine condivise e il tentativo di aprire la build locale hanno poi restituito timeout CDP. Non è stato verificato un flusso interattivo automatizzato in questo giro. |
| Dati mock | ✅ strutturali | 15 poligoni, 4 sensori, 2 layer, 7 punti storici, 5 KPI; JSON valido, coordinate e geometrie controllate; nessun campo `populationExposure`/`riskLevel` nelle feature. Non è una validazione scientifica. |
| Traduzioni | ✅ | 127 chiavi in ciascun file IT/EN, nessuna chiave mancante; disclosure presente in entrambe. |
| Browser locale | ✅ | A 1440×900, 1366×768, 768×1024 e 390×844, navigazione e avviso visibili; nessun overflow orizzontale. A 390×844 ricerca e layer sono prima della mappa; input ricerca a y≈263 px. |
| Navigazione mobile | ✅ | Link a Mappa, Dashboard, Analytics, Layer e Impostazioni visibili; tutte e quattro le route secondarie aperte e heading verificato. |
| Flusso di ricerca | ✅ | Ricerca “Centrale”, selezione risultato, apertura dettaglio; dettaglio senza popolazione esposta o rischio sanitario. |
| Analytics e lingua | ✅ | Route Analytics caricata senza colonne di rischio/esposizione; avviso inglese controllato. |
| Preview Render esistente | ✅ raggiungibile, ⚠️ da aggiornare | L'utente ha confermato `https://airmap-italia-gis.onrender.com/`. Il servizio ha servito in precedenza la build vecchia; verificare bundle e disclosure dopo il push e il deploy automatico. |
| Screenshot/video | ➖ | Nessun file definitivo o video creato. |
| `git diff --check` | ✅ | Superato dopo le modifiche documentali e l’aggiunta del piano runtime. |

Il probe HTTP è stato eseguito sulla build di produzione della copia corretta; non equivale a una verifica browser visuale né alla verifica del deployment live.

## Blocchi prima di commit remoto o deploy pubblico

1. **Limite legale intenzionale:** le pagine sono informative e provvisorie per una demo, non costituiscono documenti legali né attestano conformità. Non promuovere la demo come servizio operativo.
2. **Render:** la URL è confermata, ma il branch collegato al servizio non è esposto in `render.yaml`. Pushare solo sul branch `demo/airmap-italia-gis`, quindi verificare che Render lo deployi; se il bundle non cambia, fermarsi e chiedere accesso/istruzioni per collegare il branch.
3. **Copertura e browser:** 4 unit test e probe HTTP passano; i flussi UI sono coperti solo da verifiche manuali precedenti, perché Playwright/CDP non è disponibile in questo ambiente.
4. **Runtime MCP:** il runner continua a scadere sull'installazione anche quando `npm ci`, build, test, audit e probe manuali passano. Non cambiare i controlli per forzare un pass.

La demo può essere pubblicata con le avvertenze esplicite approvate dall'utente, ma non deve essere presentata come servizio di misurazione reale o come progetto legalmente certificato.

## Non eseguito

- Lint dedicato; audit screen reader, contrasto sistematico, tastiera completa o zoom al 200%.
- Screen reader, audit sistematico di contrasto, tastiera completa o zoom al 200%.
- Commit, push e deploy; verificare il bundle e le pagine aggiornate su Render dopo il push.
- Screenshot/video.

## Ripresa: un solo prossimo passo

**Completare la pubblicazione**: eseguire commit e push sul solo branch `demo/airmap-italia-gis`, attendere l'eventuale deploy automatico, quindi verificare che la URL Render serva il nuovo bundle, l'avviso browser e le pagine informative. Se non parte il deploy, non cambiare branch o configurazioni Render senza conferma.
