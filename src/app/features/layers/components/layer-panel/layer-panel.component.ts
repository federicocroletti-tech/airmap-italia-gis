import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { MapLayer, MapLayerType } from '../../models/map-layer.model';

@Component({
  selector: 'app-layer-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './layer-panel.component.html',
  styleUrl: './layer-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerPanelComponent {
  @Input() layers: MapLayer[] = [];
  @Input() compact = false;

  @Output() layerToggled = new EventEmitter<{ layerId: string; visible: boolean }>();
  @Output() opacityChanged = new EventEmitter<{ layerId: string; opacity: number }>();

  trackByLayerId(_: number, layer: MapLayer): string {
    return layer.id;
  }

  onOpacityInput(layer: MapLayer, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.opacityChanged.emit({ layerId: layer.id, opacity: Number(input.value) });
  }

  getLayerTypeLabelKey(layer: MapLayer): string {
    const labelKeys: Partial<Record<MapLayerType, string>> = {
      geojson: 'LAYERS.POLYGONS',
      markers: 'LAYERS.POINTS',
      wms: 'LAYERS.WMS',
      wfs: 'LAYERS.WFS',
    };

    return labelKeys[layer.type] ?? 'LAYERS.CARTOGRAPHIC_LAYER';
  }
}
