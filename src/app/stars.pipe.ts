import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stars'
})
export class StarsPipe implements PipeTransform {
  transform(rating: number): number[] {
    const count = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return Array(count).fill(0);
  }
}
