import { Pipe, PipeTransform } from '@angular/core';
import { PollutionLevel } from '../../features/air-quality/models/air-quality.model';

const LEVEL_LABELS: Record<PollutionLevel, string> = {
  excellent: 'Eccellente',
  good: 'Buona',
  moderate: 'Moderata',
  high: 'Elevata',
  'very-high': 'Molto elevata',
  critical: 'Critica',
};

@Pipe({
  name: 'pollutionLevelLabel',
  standalone: true,
})
export class PollutionLevelLabelPipe implements PipeTransform {
  transform(value: PollutionLevel | null | undefined): string {
    return value ? LEVEL_LABELS[value] : '-';
  }
}
