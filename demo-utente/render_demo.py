from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
ASSETS = PROJECT / "src" / "assets" / "mock"
FPS = 30
SCENE_SECONDS = 5.5
FADE_SECONDS = 0.55
TEAL = "#176B87"
INK = "#122033"
MUTED = "#5D6D7F"
PAGE = "#F4F7FA"
WHITE = "#FFFFFF"
LINE = "#D8E2EB"
PALE = "#EEF5F7"
FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_REGULAR = FONT_DIR / "segoeui.ttf"
FONT_BOLD = FONT_DIR / "segoeuib.ttf"
FONT_CACHE: dict[tuple[int, bool], ImageFont.FreeTypeFont] = {}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    key = (size, bold)
    if key not in FONT_CACHE:
        path = FONT_BOLD if bold else FONT_REGULAR
        if not path.exists():
            path = FONT_DIR / ("arialbd.ttf" if bold else "arial.ttf")
        FONT_CACHE[key] = ImageFont.truetype(str(path), max(9, size))
    return FONT_CACHE[key]


def read_json(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


FEATURES = read_json(ASSETS / "air-quality-areas.geojson")["features"]
HISTORY = read_json(ASSETS / "air-quality-history.json")["default"]
AREAS = [feature["properties"] for feature in FEATURES]
CENTRALE = next(area for area in AREAS if area["name"] == "Centrale")


def aqi_color(value: int) -> str:
    if value <= 50:
        return "#2E7D32"
    if value <= 100:
        return "#F5C542"
    if value <= 150:
        return "#EF8F2F"
    if value <= 200:
        return "#D84343"
    return "#7B3F98"


def canvas(ratio: str) -> tuple[Image.Image, ImageDraw.ImageDraw, int, int, float]:
    width, height = (1920, 1080) if ratio == "wide" else (1080, 1920)
    scale = width / 1920
    image = Image.new("RGB", (width, height), PAGE)
    return image, ImageDraw.Draw(image), width, height, scale


def rounded(draw: ImageDraw.ImageDraw, x: float, y: float, width: float, height: float,
            color: str, radius: int = 12, outline: str | None = None, stroke: int = 1) -> None:
    draw.rounded_rectangle((x, y, x + width, y + height), radius=max(2, int(radius)),
                           fill=color, outline=outline, width=max(1, int(stroke)))


def put(draw: ImageDraw.ImageDraw, x: float, y: float, value: str, size: int,
        color: str = INK, bold: bool = False, anchor: str = "la") -> None:
    draw.text((x, y), value, fill=color, font=font(size, bold), anchor=anchor)


def rule(draw: ImageDraw.ImageDraw, x: float, y: float, width: float, color: str = LINE,
         stroke: int = 1) -> None:
    draw.line((x, y, x + width, y), fill=color, width=max(1, int(stroke)))


def badge(draw: ImageDraw.ImageDraw, x: float, y: float, value: str, color: str,
          scale: float, text_color: str = WHITE) -> None:
    size = max(10, int(14 * scale))
    text_width = draw.textlength(value, font=font(size, True))
    width, height = text_width + 26 * scale, 29 * scale
    rounded(draw, x, y, width, height, color, 12 * scale)
    put(draw, x + 13 * scale, y + height / 2, value, size, text_color, True, "lm")


def pointer(draw: ImageDraw.ImageDraw, x: float, y: float, scale: float) -> None:
    r = 20 * scale
    draw.ellipse((x - r, y - r, x + r, y + r), outline="#FFFFFF", width=max(2, int(3 * scale)))
    draw.ellipse((x - r * .58, y - r * .58, x + r * .58, y + r * .58), outline=TEAL,
                 width=max(2, int(4 * scale)))
    draw.ellipse((x - 4 * scale, y - 4 * scale, x + 4 * scale, y + 4 * scale), fill=TEAL)


def search_icon(draw: ImageDraw.ImageDraw, x: float, y: float, size: float, color: str) -> None:
    radius = size * .31
    draw.ellipse((x - radius, y - radius, x + radius, y + radius),
                 outline=color, width=max(1, int(size * .1)))
    draw.line((x + radius * .7, y + radius * .7, x + size * .48, y + size * .48),
              fill=color, width=max(1, int(size * .1)))


def chrome(draw: ImageDraw.ImageDraw, ratio: str, title: str, scale: float, height: int) -> tuple[int, int]:
    if ratio == "wide":
        sidebar = int(248 * scale)
        draw.rectangle((0, 0, sidebar, height), fill="#FFFFFF")
        rounded(draw, 24 * scale, 25 * scale, 42 * scale, 42 * scale, TEAL, 9 * scale)
        put(draw, 45 * scale, 46 * scale, "AI", int(16 * scale), WHITE, True, "mm")
        put(draw, 78 * scale, 36 * scale, "AIRMAP ITALIA", int(17 * scale), INK, True)
        put(draw, 78 * scale, 56 * scale, "MILANO AQI GIS", int(10 * scale), MUTED, True)
        navs = ["Mappa", "Dashboard", "Analytics", "Layer", "Impostazioni"]
        for index, label in enumerate(navs):
            y = 115 * scale + index * 52 * scale
            if label == title:
                rounded(draw, 14 * scale, y - 12 * scale, sidebar - 28 * scale, 42 * scale, "#E4EDF2", 8 * scale)
            draw.ellipse((26 * scale, y - 1 * scale, 38 * scale, y + 11 * scale),
                         fill=TEAL if label == title else "#A8B8C4")
            put(draw, 58 * scale, y + 7 * scale, label, int(15 * scale), TEAL if label == title else INK, label == title, "lm")
        draw.rectangle((sidebar, 0, 1920, 76 * scale), fill=WHITE)
        rule(draw, sidebar, 76 * scale, 1920 - sidebar)
        put(draw, sidebar + 24 * scale, 25 * scale, "AIRMAP ITALIA", int(16 * scale), INK, True)
        put(draw, sidebar + 24 * scale, 50 * scale, "Milano · monitoraggio GIS della qualità dell'aria", int(12 * scale), MUTED)
        put(draw, 1848 * scale, 39 * scale, "IT  ◉", int(13 * scale), TEAL, True, "mm")
        return sidebar + int(14 * scale), int(90 * scale)

    draw.rectangle((0, 0, 1080, 112), fill=WHITE)
    draw.rectangle((0, 0, 1080, 112), outline=LINE)
    rounded(draw, 28, 24, 52, 52, TEAL, 10)
    put(draw, 54, 50, "AI", 19, WHITE, True, "mm")
    put(draw, 96, 38, "AIRMAP ITALIA", 22, INK, True)
    put(draw, 96, 68, "MILANO AQI GIS", 13, MUTED, True)
    rounded(draw, 980, 42, 38, 30, PALE, 7, LINE)
    put(draw, 999, 57, "IT", 12, TEAL, True, "mm")
    for index in range(3):
        draw.line((1030, 43 + index * 9, 1054, 43 + index * 9), fill=TEAL, width=2)
    return 24, 130


def add_disclaimer(draw: ImageDraw.ImageDraw, ratio: str, width: int, height: int, scale: float) -> None:
    label = "DATI MOCK · 24 LUG 2026 · NON IN TEMPO REALE"
    size = max(11, int(12 * scale))
    text_width = draw.textlength(label, font=font(size, True))
    box_width, box_height = text_width + 22 * scale, 27 * scale
    x = width - box_width - 18 * scale
    y = height - box_height - 12 * scale
    rounded(draw, x, y, box_width, box_height, "#FFF4DE", 8 * scale, "#F1D8A8")
    put(draw, x + 11 * scale, y + box_height / 2, label, size, "#75520D", True, "lm")


def map_panel(draw: ImageDraw.ImageDraw, box: tuple[float, float, float, float],
              scale: float, selected: str | None = None) -> None:
    x, y, width, height = box
    rounded(draw, x, y, width, height, "#E7EEF0", 10 * scale, LINE)
    draw.rectangle((x + 2 * scale, y + 2 * scale, x + width - 2 * scale, y + height - 2 * scale),
                   fill="#E8F0F1")
    # Schematic streets and blocks; no live tile service or third-party imagery is used.
    roads = [
        [(0.04, .18), (.31, .23), (.57, .12), (.96, .2)],
        [(0.03, .48), (.28, .4), (.49, .51), (.76, .37), (.98, .45)],
        [(0.02, .78), (.24, .67), (.55, .79), (.77, .63), (.98, .75)],
        [(.17, .02), (.23, .31), (.18, .57), (.29, .97)],
        [(.47, .01), (.43, .22), (.52, .49), (.46, .7), (.53, .98)],
        [(.76, .01), (.69, .29), (.8, .55), (.73, .99)],
    ]
    for path in roads:
        coords = [(x + px * width, y + py * height) for px, py in path]
        draw.line(coords, fill="#CFDADB", width=max(2, int(3 * scale)), joint="curve")
    for path in roads[:3]:
        coords = [(x + px * width, y + py * height) for px, py in path]
        draw.line(coords, fill="#FBFCFA", width=max(1, int(1.5 * scale)), joint="curve")

    coords_all = [coordinate for feature in FEATURES for coordinate in feature["geometry"]["coordinates"][0]]
    longitudes = [coordinate[0] for coordinate in coords_all]
    latitudes = [coordinate[1] for coordinate in coords_all]
    min_lon, max_lon = min(longitudes) - .008, max(longitudes) + .008
    min_lat, max_lat = min(latitudes) - .008, max(latitudes) + .008
    inner = (x + width * .06, y + height * .06, width * .88, height * .86)

    def project(lon: float, lat: float) -> tuple[float, float]:
        px = inner[0] + (lon - min_lon) / (max_lon - min_lon) * inner[2]
        py = inner[1] + (max_lat - lat) / (max_lat - min_lat) * inner[3]
        return px, py

    label_centers: list[tuple[dict, tuple[float, float]]] = []
    for feature in FEATURES:
        props = feature["properties"]
        polygon = [project(lon, lat) for lon, lat in feature["geometry"]["coordinates"][0]]
        is_selected = props["id"] == selected
        color = aqi_color(props["aqi"])
        draw.polygon(polygon, fill=color, outline="#FFFFFF" if is_selected else "#758893",
                     width=max(1, int((4 if is_selected else 2) * scale)))
        center = (sum(point[0] for point in polygon[:-1]) / max(1, len(polygon) - 1),
                  sum(point[1] for point in polygon[:-1]) / max(1, len(polygon) - 1))
        label_centers.append((props, center))
        if is_selected:
            radius = 18 * scale
            draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius),
                         outline=WHITE, width=max(2, int(4 * scale)))
            draw.ellipse((center[0] - 7 * scale, center[1] - 7 * scale, center[0] + 7 * scale,
                          center[1] + 7 * scale), fill="#B91C1C")
        else:
            radius = 5 * scale
            draw.ellipse((center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius),
                         fill=WHITE, outline="#50616C", width=max(1, int(scale)))
    if width > 600 * scale:
        visible_names = {"Cascina Merlata", "Quarto Oggiaro", "Bovisa", "Bicocca",
                         "San Siro", "Centrale", "Porta Romana", "Lambrate"}
        for props, center in label_centers:
            if props["name"] not in visible_names:
                continue
            label_size = max(9, int(10 * scale))
            label = f"{props['name']} · {props['aqi']}"
            rounded(draw, center[0] + 7 * scale, center[1] - 14 * scale,
                    draw.textlength(label, font=font(label_size, True)) + 10 * scale,
                    20 * scale, "#FFFFFF", 5 * scale)
            put(draw, center[0] + 12 * scale, center[1] - 4 * scale, label, label_size, INK, True, "lm")

    legend_y = y + height - 36 * scale
    rounded(draw, x + 12 * scale, legend_y - 7 * scale, min(width - 24 * scale, 500 * scale),
            28 * scale, WHITE, 8 * scale, LINE)
    put(draw, x + 24 * scale, legend_y + 6 * scale, "AQI", int(11 * scale), MUTED, True, "lm")
    legend = [("≤50", "#2E7D32"), ("51–100", "#F5C542"), ("101–150", "#EF8F2F"),
              ("151–200", "#D84343"), (">200", "#7B3F98")]
    lx = x + 68 * scale
    for value, color in legend:
        draw.ellipse((lx, legend_y, lx + 10 * scale, legend_y + 10 * scale), fill=color)
        put(draw, lx + 14 * scale, legend_y + 5 * scale, value, int(10 * scale), INK, False, "lm")
        lx += (draw.textlength(value, font=font(max(9, int(10 * scale)))) + 34 * scale)


def area_metrics(draw: ImageDraw.ImageDraw, x: float, y: float, width: float, scale: float) -> None:
    metrics = [("PM10", str(CENTRALE["pm10"]), "µg/m³"),
               ("PM2.5", str(CENTRALE["pm25"]), "µg/m³"),
               ("NO₂", str(CENTRALE["no2"]), "µg/m³")]
    gap = 8 * scale
    card_w = (width - gap * 2) / 3
    for index, (label, value, unit) in enumerate(metrics):
        cx = x + index * (card_w + gap)
        rounded(draw, cx, y, card_w, 60 * scale, "#F4F7FA", 8 * scale, LINE)
        put(draw, cx + 9 * scale, y + 15 * scale, label, int(11 * scale), MUTED, True)
        put(draw, cx + 9 * scale, y + 39 * scale, f"{value} {unit}", int(14 * scale), INK, True)


def details_panel(draw: ImageDraw.ImageDraw, box: tuple[float, float, float, float], scale: float) -> None:
    x, y, width, height = box
    rounded(draw, x, y, width, height, WHITE, 12 * scale, LINE)
    put(draw, x + 20 * scale, y + 24 * scale, "MILANO CENTRO", int(11 * scale), MUTED, True)
    put(draw, x + 20 * scale, y + 55 * scale, "Centrale", int(24 * scale), INK, True)
    badge(draw, x + 20 * scale, y + 82 * scale, "MOLTO ELEVATA", "#D84343", scale)
    put(draw, x + width - 23 * scale, y + 47 * scale, "176", int(40 * scale), "#B42323", True, "ra")
    put(draw, x + width - 23 * scale, y + 95 * scale, "AQI", int(12 * scale), MUTED, True, "ra")
    rule(draw, x + 20 * scale, y + 120 * scale, width - 40 * scale)
    put(draw, x + 20 * scale, y + 143 * scale, "INDICATORI", int(11 * scale), MUTED, True)
    area_metrics(draw, x + 20 * scale, y + 155 * scale, width - 40 * scale, scale)
    put(draw, x + 20 * scale, y + 237 * scale, "Storico AQI · dati demo", int(14 * scale), INK, True)
    chart_x, chart_y = x + 22 * scale, y + 255 * scale
    chart_w, chart_h = width - 48 * scale, min(92 * scale, max(45 * scale, height - 330 * scale))
    draw.rectangle((chart_x, chart_y, chart_x + chart_w, chart_y + chart_h), fill="#FBFCFD")
    for fraction in (.25, .5, .75):
        rule(draw, chart_x, chart_y + chart_h * fraction, chart_w, "#E7EDF1", max(1, scale))
    values = [point["aqi"] for point in HISTORY]
    low, high = min(values) - 8, max(values) + 8
    points = [(chart_x + i * chart_w / (len(values) - 1),
               chart_y + chart_h - (value - low) / (high - low) * chart_h)
              for i, value in enumerate(values)]
    draw.line(points, fill=TEAL, width=max(2, int(3 * scale)), joint="curve")
    for px, py in points:
        draw.ellipse((px - 3 * scale, py - 3 * scale, px + 3 * scale, py + 3 * scale), fill=TEAL)
    if height > 400 * scale:
        put(draw, x + 20 * scale, chart_y + chart_h + 17 * scale,
            f"PM10 {CENTRALE['pm10']}  ·  PM2.5 {CENTRALE['pm25']}  ·  NO₂ {CENTRALE['no2']}",
            int(12 * scale), MUTED)
        action_y = y + height - 52 * scale
        rounded(draw, x + 20 * scale, action_y, width - 40 * scale, 38 * scale, TEAL, 8 * scale)
        put(draw, x + width / 2, action_y + 19 * scale, "ANALIZZA AREA  →", int(13 * scale), WHITE, True, "mm")


def map_workspace(draw: ImageDraw.ImageDraw, ratio: str, step: int, scale: float) -> None:
    width, height = (1920, 1080) if ratio == "wide" else (1080, 1920)
    selected = step >= 2
    nav_title = "Mappa"
    content_x, content_y = chrome(draw, ratio, nav_title, scale, height)
    add_disclaimer(draw, ratio, width, height, scale)

    if ratio == "wide":
        panel_y, panel_h = content_y + 18 * scale, 845 * scale
        control_x, control_w = content_x, 304 * scale
        map_x = control_x + control_w + 12 * scale
        map_w = (width - map_x - 24 * scale - (420 * scale + 12 * scale if selected else 0))
        put(draw, content_x + 2 * scale, content_y + 4 * scale,
            "Mappa della qualità dell'aria", int(21 * scale), INK, True)
        put(draw, content_x + 2 * scale, content_y + 31 * scale,
            "Esplora le aree urbane e approfondisci gli indicatori ambientali.", int(12 * scale), MUTED)
        controls_y = content_y + 66 * scale
        rounded(draw, control_x, controls_y, control_w, panel_h - 48 * scale, WHITE, 10 * scale, LINE)
        put(draw, control_x + 16 * scale, controls_y + 29 * scale, "Cerca area", int(12 * scale), MUTED, True)
        search_y = controls_y + 43 * scale
        rounded(draw, control_x + 14 * scale, search_y, control_w - 28 * scale, 42 * scale,
                WHITE, 7 * scale, "#BAC9D4")
        query = "Centrale" if step >= 1 else "Cerca quartiere o area"
        search_icon(draw, control_x + 26 * scale, search_y + 21 * scale, 13 * scale, MUTED)
        put(draw, control_x + 42 * scale, search_y + 21 * scale, query,
            int(13 * scale), INK if step >= 1 else MUTED, step >= 1, "lm")
        if step == 1:
            rounded(draw, control_x + 14 * scale, search_y + 44 * scale, control_w - 28 * scale,
                    52 * scale, WHITE, 6 * scale, LINE)
            put(draw, control_x + 29 * scale, search_y + 60 * scale, "Centrale", int(13 * scale), INK, True)
            put(draw, control_x + 29 * scale, search_y + 79 * scale, "AQI 176 · Milano Centro", int(10 * scale), MUTED)
            pointer(draw, control_x + control_w - 34 * scale, search_y + 69 * scale, scale)
        put(draw, control_x + 16 * scale, controls_y + 136 * scale, "LAYER CARTOGRAFICI", int(10 * scale), MUTED, True)
        rounded(draw, control_x + 15 * scale, controls_y + 151 * scale, 18 * scale, 18 * scale, TEAL, 4 * scale)
        put(draw, control_x + 43 * scale, controls_y + 161 * scale, "Zone qualità aria", int(12 * scale), INK, True, "lm")
        put(draw, control_x + 43 * scale, controls_y + 184 * scale, "Centraline ambientali", int(11 * scale), MUTED)
        put(draw, control_x + 16 * scale, controls_y + 228 * scale, "AQI · Scala indicativa", int(11 * scale), MUTED, True)
        for index, (value, color) in enumerate([("Buona", "#2E7D32"), ("Moderata", "#F5C542"),
                                                ("Elevata", "#EF8F2F"), ("Molto elevata", "#D84343")]):
            by = controls_y + (257 + index * 35) * scale
            draw.ellipse((control_x + 18 * scale, by - 6 * scale, control_x + 30 * scale, by + 6 * scale), fill=color)
            put(draw, control_x + 42 * scale, by, value, int(11 * scale), INK, False, "lm")
        map_y = controls_y
        map_h = panel_h - 48 * scale
        map_panel(draw, (map_x, map_y, map_w, map_h), scale, "centrale" if selected else None)
        if selected:
            detail_x = map_x + map_w + 12 * scale
            details_panel(draw, (detail_x, map_y, 420 * scale, map_h), scale)
            if step in (2, 3):
                pointer(draw, detail_x + 210 * scale, map_y + map_h - 48 * scale, scale)
        elif step == 1:
            pointer(draw, map_x + map_w * .69, map_y + map_h * .52, scale)
        return

    put(draw, content_x, content_y, "Mappa della qualità dell'aria", 22, INK, True)
    put(draw, content_x, content_y + 31, "Milano · esplora i dati per area", 14, MUTED)
    controls_y = content_y + 57
    rounded(draw, content_x, controls_y, width - 48, 228, WHITE, 12, LINE)
    put(draw, content_x + 18, controls_y + 27, "Cerca area", 14, MUTED, True)
    rounded(draw, content_x + 16, controls_y + 40, width - 80, 44, WHITE, 7, "#BAC9D4")
    search_icon(draw, content_x + 29, controls_y + 62, 14, MUTED)
    put(draw, content_x + 48, controls_y + 62, "Centrale" if step >= 1 else "Cerca quartiere o area",
        14, INK if step >= 1 else MUTED, step >= 1, "lm")
    if step == 1:
        rounded(draw, content_x + 16, controls_y + 83, width - 80, 58, WHITE, 7, LINE)
        put(draw, content_x + 30, controls_y + 101, "Centrale", 14, INK, True)
        put(draw, content_x + 30, controls_y + 123, "AQI 176 · Milano Centro", 11, MUTED)
        pointer(draw, width - 76, controls_y + 111, 1)
    put(draw, content_x + 18, controls_y + 165, "LAYER", 11, MUTED, True)
    rounded(draw, content_x + 84, controls_y + 150, 18, 18, TEAL, 4)
    put(draw, content_x + 110, controls_y + 160, "Zone qualità aria", 12, INK, True, "lm")
    legend_colors = ["#2E7D32", "#F5C542", "#EF8F2F", "#D84343"]
    lx = content_x + 18
    for color in legend_colors:
        draw.ellipse((lx, controls_y + 187, lx + 13, controls_y + 200), fill=color)
        lx += 30
    map_y = controls_y + 240
    detail_h = 450 if selected else 0
    map_h = 770 if selected else 1190
    map_panel(draw, (content_x, map_y, width - 48, map_h), 1, "centrale" if selected else None)
    if selected:
        details_panel(draw, (content_x, map_y + map_h + 12, width - 48, detail_h), 1)
        if step == 2:
            pointer(draw, width / 2, map_y + map_h + detail_h - 16, 1)
    elif step == 1:
        pointer(draw, width * .68, map_y + map_h * .52, 1)


def analytics_workspace(draw: ImageDraw.ImageDraw, ratio: str, step: int, scale: float) -> None:
    width, height = (1920, 1080) if ratio == "wide" else (1080, 1920)
    content_x, content_y = chrome(draw, ratio, "Analytics", scale, height)
    add_disclaimer(draw, ratio, width, height, scale)
    title_size = int(25 * scale) if ratio == "wide" else 24
    title_y = content_y + (10 * scale if ratio == "wide" else 14)
    subtitle_y = content_y + (38 * scale if ratio == "wide" else 46)
    put(draw, content_x, title_y, "Analisi territoriali", title_size, INK, True)
    put(draw, content_x, subtitle_y, "Confronta le aree e individua i valori più significativi.",
        int(12 * scale) if ratio == "wide" else 13, MUTED)

    if ratio == "wide":
        fy = content_y + 65 * scale
        labels = [("QUARTIERE", "Tutti"), ("LIVELLO", "Tutti"), ("PERIODO", "24h"), ("INDICATORE", "AQI")]
        gap = 12 * scale
        card_w = (width - content_x - 28 * scale - gap * 3) / 4
        for i, (key, value) in enumerate(labels):
            x = content_x + i * (card_w + gap)
            rounded(draw, x, fy, card_w, 51 * scale, WHITE, 8 * scale, LINE)
            put(draw, x + 13 * scale, fy + 15 * scale, key, int(9 * scale), MUTED, True)
            put(draw, x + 13 * scale, fy + 36 * scale, value + "  ▾", int(13 * scale), INK, True)
        cards_y = fy + 67 * scale
        cards_h = 277 * scale
        card_gap = 12 * scale
        card_w = (width - content_x - 28 * scale - card_gap * 2) / 3
        ranking = [
            ("ZONE PIÙ INQUINATE", [("Centrale", 176), ("Porta Romana", 154), ("Portello", 148)]),
            ("ZONE MENO INQUINATE", [("San Siro", 44), ("Niguarda", 52), ("Cascina Merlata", 58)]),
            ("MEDIA AQI PER QUARTIERE", [("Milano Centro", 176), ("Milano Sud-Est", 154), ("Milano Ovest", 44)]),
        ]
        for c, (heading, rows) in enumerate(ranking):
            x = content_x + c * (card_w + card_gap)
            rounded(draw, x, cards_y, card_w, cards_h, WHITE, 10 * scale, LINE)
            put(draw, x + 17 * scale, cards_y + 29 * scale, heading, int(11 * scale), MUTED, True)
            for r, (name, aqi) in enumerate(rows):
                ry = cards_y + (80 + r * 58) * scale
                color = "#B42323" if name == "Centrale" else INK
                put(draw, x + 18 * scale, ry, name, int(14 * scale), color, name == "Centrale")
                badge(draw, x + card_w - 80 * scale, ry - 14 * scale, f"AQI {aqi}",
                      aqi_color(aqi), scale, INK if aqi <= 100 else WHITE)
                if r < 2:
                    rule(draw, x + 16 * scale, ry + 18 * scale, card_w - 32 * scale)
        tx, ty = content_x, cards_y + cards_h + 14 * scale
        tw = width - content_x - 28 * scale
        rounded(draw, tx, ty, tw, 342 * scale, WHITE, 10 * scale, LINE)
        put(draw, tx + 18 * scale, ty + 29 * scale, "Ranking aree · indicatore AQI", int(15 * scale), INK, True)
        table = sorted(AREAS, key=lambda a: a["aqi"], reverse=True)[:5]
        for i, area in enumerate(table):
            ry = ty + (68 + i * 48) * scale
            if area["name"] == "Centrale":
                rounded(draw, tx + 12 * scale, ry - 17 * scale, tw - 24 * scale, 41 * scale, "#FFF2F0", 7 * scale)
            put(draw, tx + 26 * scale, ry, area["name"], int(12 * scale), INK, area["name"] == "Centrale")
            put(draw, tx + tw * .43, ry, area["district"], int(11 * scale), MUTED)
            put(draw, tx + tw * .74, ry, str(area["aqi"]), int(12 * scale), aqi_color(area["aqi"]), True)
            put(draw, tx + tw * .84, ry, f"{area['pm25']} µg/m³", int(11 * scale), MUTED)
            rule(draw, tx + 16 * scale, ry + 20 * scale, tw - 32 * scale)
        if step == 3:
            pointer(draw, content_x + 80 * scale, cards_y + 80 * scale, scale)
        return

    rounded(draw, content_x, content_y + 76, width - 48, 100, WHITE, 12, LINE)
    put(draw, content_x + 17, content_y + 100, "FILTRI", 12, MUTED, True)
    put(draw, content_x + 17, content_y + 141, "Quartiere  Tutti   ·   Periodo  24h   ·   Indicatore  AQI  ▾", 13, INK, True)
    ranking_y = content_y + 192
    ranking = [
        ("ZONE PIÙ INQUINATE", [("Centrale", 176), ("Porta Romana", 154)]),
        ("ZONE MENO INQUINATE", [("San Siro", 44), ("Cascina Merlata", 58)]),
    ]
    for idx, (heading, rows) in enumerate(ranking):
        x = content_x + idx * ((width - 48 - 12) / 2 + 12)
        card_w = (width - 48 - 12) / 2
        rounded(draw, x, ranking_y, card_w, 185, WHITE, 12, LINE)
        put(draw, x + 14, ranking_y + 26, heading, 11, MUTED, True)
        for row_index, (name, aqi) in enumerate(rows):
            ry = ranking_y + 72 + row_index * 53
            put(draw, x + 14, ry, name, 13, "#B42323" if name == "Centrale" else INK, True)
            badge(draw, x + card_w - 83, ry - 16, f"AQI {aqi}", aqi_color(aqi), 1,
                  INK if aqi <= 100 else WHITE)
    table_y = ranking_y + 199
    rounded(draw, content_x, table_y, width - 48, 388, WHITE, 12, LINE)
    put(draw, content_x + 16, table_y + 28, "Ranking aree · AQI", 15, INK, True)
    table = sorted(AREAS, key=lambda a: a["aqi"], reverse=True)[:5]
    for i, area in enumerate(table):
        ry = table_y + 72 + i * 58
        if area["name"] == "Centrale":
            rounded(draw, content_x + 10, ry - 20, width - 68, 46, "#FFF2F0", 7)
        put(draw, content_x + 18, ry, area["name"], 13, INK, area["name"] == "Centrale")
        put(draw, width - 175, ry, f"AQI {area['aqi']}", 13, aqi_color(area["aqi"]), True)
        rule(draw, content_x + 14, ry + 20, width - 80)


def intro_or_outro(draw: ImageDraw.ImageDraw, ratio: str, scale: float, closing: bool) -> None:
    width, height = (1920, 1080) if ratio == "wide" else (1080, 1920)
    if ratio == "wide":
        draw.rectangle((0, 0, width, height), fill="#101B28")
        # Small map motif built from the very same demo polygons as the walkthrough.
        map_panel(draw, (1000, 120, 790, 760), scale, "centrale")
        if not closing:
            badge(draw, 140, 218, "DEMO UTENTE · AIR QUALITY GIS", TEAL, scale)
            put(draw, 140, 340, "Dalla mappa", 70, WHITE, True)
            put(draw, 140, 426, "all'analisi di un quartiere.", 58, WHITE, True)
            put(draw, 143, 535, "Un percorso guidato in AirMap Italia.", 25, "#BBC9D3")
            put(draw, 143, 622, "CERCA   →   SELEZIONA   →   CONFRONTA", 16, "#86D7E8", True)
        else:
            badge(draw, 140, 272, "AIRMAP ITALIA", TEAL, scale)
            put(draw, 140, 395, "Un quartiere alla volta.", 58, WHITE, True)
            put(draw, 143, 485, "Dati demo statici · interfaccia dimostrativa", 23, "#BBC9D3")
            put(draw, 143, 566, "Esplora la mappa e confronta le aree.", 22, "#86D7E8", True)
    else:
        draw.rectangle((0, 0, width, height), fill="#101B28")
        map_panel(draw, (58, 730, 964, 720), 1, "centrale")
        if not closing:
            badge(draw, 60, 240, "DEMO UTENTE · AIR QUALITY GIS", TEAL, 1)
            put(draw, 60, 368, "Dalla mappa", 57, WHITE, True)
            put(draw, 60, 442, "all'analisi di", 51, WHITE, True)
            put(draw, 60, 508, "un quartiere.", 57, WHITE, True)
            put(draw, 62, 595, "Un percorso guidato in AirMap Italia.", 21, "#BBC9D3")
            put(draw, 62, 670, "CERCA  →  SELEZIONA  →  CONFRONTA", 15, "#86D7E8", True)
        else:
            badge(draw, 60, 260, "AIRMAP ITALIA", TEAL, 1)
            put(draw, 60, 390, "Un quartiere", 56, WHITE, True)
            put(draw, 60, 458, "alla volta.", 56, WHITE, True)
            put(draw, 62, 550, "Dati demo statici · interfaccia dimostrativa", 19, "#BBC9D3")
            put(draw, 62, 610, "Esplora la mappa e confronta le aree.", 20, "#86D7E8", True)
    add_disclaimer(draw, ratio, width, height, scale)


def render_scene(index: int, ratio: str) -> Image.Image:
    image, draw, _, _, scale = canvas(ratio)
    if index == 0:
        intro_or_outro(draw, ratio, scale, False)
    elif index in (1, 2):
        map_workspace(draw, ratio, index, scale)
    elif index == 3:
        map_workspace(draw, ratio, index, scale)
    elif index == 4:
        analytics_workspace(draw, ratio, index, scale)
    else:
        intro_or_outro(draw, ratio, scale, True)
    captions = [
        "Apri la mappa AQI di Milano.",
        "Cerca Centrale tra i quartieri.",
        "Seleziona l'area e apri il dettaglio.",
        "Leggi indicatori e storico dimostrativo.",
        "Confronta Centrale con le altre zone.",
        "Dati demo: non sono aggiornati in tempo reale.",
    ]
    caption = captions[index]
    caption_size = 22 if ratio == "wide" else 25
    caption_width = 1260 if ratio == "wide" else 890
    caption_height = 54 if ratio == "wide" else 64
    caption_x = (image.width - caption_width) / 2
    caption_y = image.height - (116 if ratio == "wide" else 176)
    rounded(draw, caption_x, caption_y, caption_width, caption_height, "#14212C", 12, "#356276", 2)
    put(draw, image.width / 2, caption_y + caption_height / 2,
        caption, caption_size, WHITE, True, "mm")
    return image


def run(command: list[str]) -> None:
    result = subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    if result.returncode:
        details = result.stderr.decode("utf-8", errors="replace").strip()
        raise RuntimeError(f"Comando fallito ({result.returncode}): {' '.join(command)}\n{details}")


def make_audio() -> Path:
    audio_path = ROOT / "airmap-voiceover-it.wav"
    ps_script = ROOT / "generate-voiceover.ps1"
    if not audio_path.exists():
        run(["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(ps_script)])
    return audio_path


def export_video(ffmpeg: str, ratio: str) -> None:
    size = (1920, 1080) if ratio == "wide" else (1080, 1920)
    audio_path = make_audio()
    scene_count = 6
    total_duration = scene_count * SCENE_SECONDS - (scene_count - 1) * FADE_SECONDS
    with tempfile.TemporaryDirectory(prefix="airmap-user-demo-") as folder:
        temp = Path(folder)
        scene_paths = []
        for index in range(scene_count):
            frame = render_scene(index, ratio)
            path = temp / f"scene-{index:02}.png"
            frame.save(path)
            scene_paths.append(path)
            if index == 0:
                frame.save(ROOT / f"cover-{ratio}.png")

        args = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error"]
        for frame in scene_paths:
            args += ["-loop", "1", "-framerate", str(FPS), "-t", str(SCENE_SECONDS), "-i", str(frame)]
        args += ["-i", str(audio_path)]
        filters = [
            f"[{i}:v]fps={FPS},settb=1/{FPS},setpts=PTS-STARTPTS,scale={size[0]}:{size[1]},format=yuv420p[v{i}]"
            for i in range(scene_count)
        ]
        previous = "v0"
        for i in range(1, scene_count):
            out = f"x{i}"
            offset = i * (SCENE_SECONDS - FADE_SECONDS)
            filters.append(f"[{previous}][v{i}]xfade=transition=fade:duration={FADE_SECONDS}:offset={offset:.2f}[{out}]")
            previous = out
        filters.append(f"[{scene_count}:a]apad,atrim=duration={total_duration:.2f}[aout]")
        output = ROOT / f"airmap-demo-utente-{ratio}.mp4"
        args += [
            "-filter_complex", ";".join(filters), "-map", f"[{previous}]", "-map", "[aout]",
            "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-c:a", "aac", "-b:a", "128k", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", "-shortest", str(output),
        ]
        run(args)
    print(f"Creato {output.name} · {size[0]}x{size[1]} · {total_duration:.1f} s")


def main() -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("FFmpeg non è installato o non è presente nel PATH.")
    for ratio in ("wide", "vertical"):
        export_video(ffmpeg, ratio)


if __name__ == "__main__":
    main()
