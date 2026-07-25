import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appFocusVisible]',
  standalone: true,
})
export class FocusVisibleDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostListener('focus')
  onFocus(): void {
    this.elementRef.nativeElement.classList.add('focus-visible');
  }

  @HostListener('blur')
  onBlur(): void {
    this.elementRef.nativeElement.classList.remove('focus-visible');
  }
}
