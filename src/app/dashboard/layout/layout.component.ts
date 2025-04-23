import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TuiDialogService, TuiPopup } from '@taiga-ui/core';

import { StorageService } from '../../core/services/storage.service';
import { StoreUser } from '../../core/interfaces/store-user.interface';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TuiDrawer } from '@taiga-ui/kit';

interface MenuItem {
  title: string;
  icon?: string;
  link: string;
}

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, TuiPopup, TuiDrawer],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(TuiDialogService);
  private readonly route = inject(ActivatedRoute);

  protected readonly open = signal(false);

  public user = signal<StoreUser>({} as StoreUser);
  public pageTitle = signal<string>('');

  public isSidebarCollapsed = signal<boolean>(false);
  public isMobile = signal<boolean>(false);

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  ngOnInit(): void {
    this.user.set(this.storage.get('user')!);
    this.pageTitle.set(this.route.children[0].snapshot.data['title']);
    this.checkScreenWidth();
  }

  checkScreenWidth(): void {
    this.isMobile.set(window.innerWidth <= 781); // Ajusta el ancho según tu breakpoint

    if (!this.isMobile()) {
      this.isSidebarCollapsed.set(false); // Asegura que la sidebar esté visible en desktop
      this.open.set(false); // Asegura que el popup esté cerrado en desktop
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
    this.open.set(false);
  }

  public updateTitle = effect(() => {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pageTitle.set(this.route.children[0].snapshot.data['title']);
      });
  });

  public onClose(): void {
    this.open.set(false);
  }
}
