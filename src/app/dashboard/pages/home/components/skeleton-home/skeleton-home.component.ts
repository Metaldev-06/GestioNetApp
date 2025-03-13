import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { TuiSkeleton } from '@taiga-ui/kit';

@Component({
  selector: 'app-skeleton-home',
  imports: [TuiSkeleton],
  templateUrl: './skeleton-home.component.html',
  styleUrl: './skeleton-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonHomeComponent implements OnInit {
  public readonly cantSkeleton = input<number>(0);
  public readonly secondary = input<boolean>(false);

  public readonly skeletonArray = signal<unknown[]>([]);

  ngOnInit() {
    this.skeletonArray.set(
      Array.from({
        length: this.cantSkeleton(),
      }),
    );
  }
}
