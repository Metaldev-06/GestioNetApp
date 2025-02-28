import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[appDecimalFormat]',
})
export class DecimalFormatDirective implements OnInit {
  private regex: RegExp = new RegExp(/^\d*(,\d{0,2})?$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];
  private isFormatting: boolean = false;

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.formatValue();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value
      .replace(/\./g, '')
      .replace(/,/g, '.');
    const position = this.el.nativeElement.selectionStart;
    let next: string = [
      current.slice(0, position),
      event.key == 'Decimal' ? ',' : event.key,
      current.slice(position),
    ].join('');

    // Validar solo si es un número o coma
    if (!/^\d*(,)?\d*$/.test(event.key) && event.key !== ',') {
      event.preventDefault();
      return;
    }

    // Asegurar que solo haya un separador decimal
    if (event.key === ',' && next.indexOf(',') !== next.lastIndexOf(',')) {
      event.preventDefault();
      return;
    }

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    if (!this.isFormatting) {
      this.formatValue();
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    this.formatValue();
  }

  formatValue() {
    if (this.isFormatting) {
      return;
    }
    this.isFormatting = true;
    let value: string = this.el.nativeElement.value;
    if (value) {
      value = value.replace(/\./g, '').replace(/,/g, '.');
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        const formattedValue = numericValue.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        this.el.nativeElement.value = formattedValue;
        this.el.nativeElement.dispatchEvent(new Event('input'));
        this.cdr.detectChanges();
      }
    }
    this.isFormatting = false;
  }
}
