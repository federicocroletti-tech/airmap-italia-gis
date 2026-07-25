import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { LayerPanelComponent } from '../components/layer-panel/layer-panel.component';
import { LayerFacade } from '../facades/layer.facade';

@Component({
  selector: 'app-layers-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LayerPanelComponent],
  template: `
    <section class="layers-page" aria-labelledby="layers-title">
      <header>
        <p>{{ 'LAYERS.AIR_PARAMETERS' | translate }}</p>
        <h1 id="layers-title">{{ 'LAYERS.TITLE' | translate }}</h1>
      </header>
      <app-layer-panel
        [layers]="layers()"
        (layerToggled)="toggle($event)"
        (opacityChanged)="opacity($event)"
      />
    </section>
  `,
  styles: [
    `
      .layers-page {
        display: grid;
        gap: 1rem;
      }
      header p {
        color: var(--airmap-muted);
        margin: 0 0 0.25rem;
      }
      h1 {
        font-family: var(--airmap-display-font);
        font-size: clamp(1.8rem, 4vw, 2.8rem);
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayersPageComponent implements OnInit {
  private readonly layerFacade = inject(LayerFacade);
  readonly layers = toSignal(this.layerFacade.layers$, { initialValue: [] });

  ngOnInit(): void {
    this.layerFacade.loadLayers();
  }

  toggle(event: { layerId: string; visible: boolean }): void {
    this.layerFacade.toggleLayer(event.layerId, event.visible);
  }

  opacity(event: { layerId: string; opacity: number }): void {
    this.layerFacade.updateOpacity(event.layerId, event.opacity);
  }
}
