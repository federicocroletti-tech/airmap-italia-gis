# AIRMAP ITALIA

AIRMAP ITALIA e una piattaforma GIS sviluppata in Angular per il monitoraggio della qualita dell'aria urbana, con mappe interattive, poligoni GeoJSON colorati in base all'AQI, dashboard analitiche, layer geografici e predisposizione WMS/WFS/GeoServer.

Repository: https://github.com/federicocroletti-tech/airmap-italia-gis.git  
Autore: Federico Croletti

## Obiettivo

Il progetto permette di individuare rapidamente zone piu inquinate, aree salubri, aree critiche, trend dell'inquinamento e differenze tra quartieri urbani. La prima versione usa dati mock realistici su Milano e una mappa Leaflet centrata su coordinate `45.4642, 9.1900`.

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
- Ricerca per area, quartiere, livello, rischio, AQI e coordinate
- Dashboard KPI con grafici Chart.js
- Analytics con classifiche, filtri, tabella Material, sort e paginazione
- Tema chiaro/scuro persistito in localStorage
- Multilingua IT/EN
- Cookie banner con preferenze estendibili
- Pagine legali base: Privacy Policy, Cookie Policy, Termini di Servizio

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
dist/airmap-italia
```

## Test

```bash
npm test
```

## Screenshot Placeholder

- `docs/screenshots/map-desktop.png`
- `docs/screenshots/dashboard.png`
- `docs/screenshots/analytics.png`

## Dati Mock

I file mock modificabili sono in `src/assets/mock/`:

- `air-quality-areas.geojson`: 15 aree urbane mock con geometrie irregolari e tondeggianti
- `map-layers.json`: layer cartografici reali accendibili in mappa, come poligoni qualita aria e centraline ambientali
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

Ogni feature include AQI, PM10, PM2.5, NO2, O3, CO, CO2, trend, popolazione esposta e rischio stimato. La mappa legge questi asset via HttpClient, quindi puoi modificare i dati senza toccare i componenti Angular.

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

I testi legali sono placeholder e vanno revisionati prima della pubblicazione. Non sono presenti secret nel frontend. Gli URL applicativi sono centralizzati in `src/environments` e `src/app/core/config/app.config.ts`.
