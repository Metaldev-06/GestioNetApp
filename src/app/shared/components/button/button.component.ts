import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public label = input('');
  public disabled = input<boolean>(false);
  public type = input<string>('submit');
  public background = input<'add' | 'reduce' | 'debt'>();
  public icon = input<string>('');
}
