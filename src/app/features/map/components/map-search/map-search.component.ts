import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AirQualityArea } from '../../../air-quality/models/air-quality.model';
import { AirQualitySearchService } from '../../../air-quality/services/air-quality-search.service';

@Component({
  selector: 'app-map-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatePipe,
  ],
  templateUrl: './map-search.component.html',
  styleUrl: './map-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSearchComponent implements OnInit, OnChanges {
  @Input() areas: AirQualityArea[] = [];
  @Output() areaSelected = new EventEmitter<AirQualityArea>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly searchService = inject(AirQualitySearchService);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly results = signal<AirQualityArea[]>([]);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => this.updateResults(query));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['areas']) {
      this.updateResults(this.searchControl.value);
    }
  }

  selectArea(area: AirQualityArea): void {
    this.searchControl.setValue(area.name, { emitEvent: false });
    this.results.set([]);
    this.areaSelected.emit(area);
  }

  trackByAreaId(_: number, area: AirQualityArea): string {
    return area.id;
  }

  private updateResults(query: string): void {
    this.results.set(this.searchService.searchAreas(this.areas, query).slice(0, 8));
  }
}
