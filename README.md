# AIRMAP ITALIA

Stato della verifica di presentabilità: [DEMO_READINESS.md](./DEMO_READINESS.md).

AIRMAP ITALIA e una demo GIS Angular per esplorare dati ambientali sintetici e statici, con mappe interattive, poligoni GeoJSON, dashboard analitiche e layer geografici. Non mostra misurazioni reali o aggiornate e non deve essere usata per decisioni ambientali o sanitarie.

Repository: https://github.com/federicocroletti-tech/airmap-italia-gis.git  
Autore: Federico Croletti

## Obiettivo

La demo illustra come esplorare e confrontare indicatori simulati tra aree urbane. I valori sono mock e non descrivono la qualita dell'aria reale di Milano.

## Stack Tecnologico

- Angular 22, standalone components, routing lazy-loaded
- TypeScript, RxJS, Angular Signals
- Angular Material con tema Material Design 3
- Tailwind CSS e SCSS
- Leaflet, OpenStreetMap, GeoJSON
- NgRx Store, Effects, Selectors, Facade Pattern
- ngx-translate con italiano e inglese
- Chart.js
- Architettura predisposta per GeoServer, WMS, WFS, raster, vettoriali e sensori IoT

## Funzionalita Principali

- Mappa Leaflet di Milano con layer OpenStreetMap
- Poligoni GeoJSON colorati in base all'indice AQI
- Tooltip su hover con sintesi GIS dell'area e indicatore tematizzato
- Pannello dettaglio area su click con storico AQI e azioni
- Aggiornamento stile poligoni al cambio zoom
- Layer panel con visibilita e opacita configurabili
- Navigazione responsive e avviso persistente sulla natura sintetica dei dati
- Ricerca per area, quartiere, livello, AQI e coordinate
- Dashboard KPI con grafici Chart.js
- Analytics con classifiche, filtri, tabella Material, sort e paginazione
- Tema chiaro/scuro persistito in localStorage
- Multilingua IT/EN
- Avviso trasparente sull'uso di localStorage e sulle richieste alle tessere OpenStreetMap
- Informative dimostrative in italiano e inglese su dati locali, servizi di terze parti e limiti della demo

## Architettura

```text
src/app/
  core/
    config/
    constants/
    guards/
    interceptors/
    layout/
    services/
    utils/
    error-handling/
  shared/
    components/
    directives/
    pipes/
    models/
    design-system/
  features/
    map/
    air-quality/
    dashboard/
    analytics/
    layers/
    settings/
    legal/
  store/
    app.actions.ts
    app.reducer.ts
    app.selectors.ts
    app.effects.ts
    app.state.ts
src/assets/
  mock/air-quality-areas.geojson
  mock/map-layers.json
  mock/sensors.json
  mock/air-quality-history.json
  mock/dashboard-summary.json
  i18n/it.json
  i18n/en.json
```

La UI passa tramite facade e non accede direttamente allo store. I dati mock sono isolati nei servizi, cosi la sostituzione con API HTTP reali resta localizzata.

## Installazione

```bash
npm install
```

## Avvio Locale

```bash
npm start
```

URL locale predefinito:

```text
http://localhost:4200/
```

## Build Produzione

```bash
npm run build
```

Output:

```text
dist/airmap-italia-gis/browser
```

## Deploy Render

Configurazione consigliata per Render Static Site.

Build Command:

```bash
npm ci --legacy-peer-deps && npm run build
```

Publish Directory:

```text
dist/airmap-italia-gis/browser
```

Environment Variables:

```text
NODE_VERSION=22
NPM_CONFIG_LEGACY_PEER_DEPS=true
```

Redirect/Rewrites Render per SPA Angular:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

## Deploy demo gratuita (GitHub Pages)

Il workflow GitHub Actions pubblica il branch `demo/airmap-italia-gis` su:

```text
https://federicocroletti-tech.github.io/airmap-italia-gis/
```

Il build imposta il base path del repository, risolve gli asset relativi a quel base path e crea `404.html` per supportare le route Angular dirette. GitHub Pages può restituire HTTP 404 per una route secondaria anche se il fallback carica correttamente la vista Angular. Questo deploy è separato dal servizio Render esistente e non modifica `main`.

## Test

```bash
npm test
```

## Screenshot

Non sono ancora stati prodotti screenshot definitivi. I percorsi storici `docs/screenshots/map-desktop.png`, `dashboard.png` e `analytics.png` sono segnaposto documentali e i file non sono presenti.

## Dati sintetici

Tutti i valori ambientali nelle viste e nei file in `src/assets/mock/` sono dati sintetici, statici e non aggiornati in tempo reale:

- `air-quality-areas.geojson`: 15 aree urbane mock con geometrie irregolari e tondeggianti
- `map-layers.json`: configurazione dei layer dimostrativi
- `sensors.json`: sensori ambientali mock
- `air-quality-history.json`: storico mock per il pannello dettaglio
- `dashboard-summary.json`: KPI e serie dati della dashboard

Il file `src/assets/mock/air-quality-areas.geojson` include:

- Quarto Oggiaro
- Certosa
- Portello
- Bovisa
- Cascina Merlata
- Gallaratese
- CityLife
- Centrale
- Isola
- Navigli
- Porta Romana
- Lambrate
- Niguarda
- San Siro
- Bicocca

Le feature includono indicatori ambientali dimostrativi e timestamp fissi. Non sono presenti valutazioni di popolazione esposta o di rischio sanitario. La mappa legge gli asset via HttpClient; non collegare i valori a fonti o misurazioni reali senza una revisione scientifica e una nuova validazione dei contenuti.

## Roadmap

- Collegamento a backend reale con API ambientali
- Integrazione GeoServer WMS/WFS funzionante
- Layer raster storici e heatmap temporali
- Sensori IoT in tempo reale via WebSocket o MQTT bridge
- Import dataset ARPA / Copernicus / OpenData comunali
- Autenticazione, ruoli e workspace multi-tenant
- Export CSV/PDF e report schedulati
- Test E2E e visual regression

## Note Produzione

I testi legali sono placeholder e vanno revisionati prima di promuovere o pubblicare il progetto come servizio. Il contatto non e configurato. La mappa usa tile OpenStreetMap con attribuzione visibile. Non sono presenti secret nel frontend. Gli URL applicativi sono centralizzati in `src/environments` e `src/app/core/config/app.config.ts`.
