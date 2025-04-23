import { TitleCasePipe } from '@angular/common';
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
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TuiDialogService } from '@taiga-ui/core';
import { TUI_CONFIRM } from '@taiga-ui/kit';

import { StorageService } from '../../core/services/storage.service';
import { StoreUser } from '../../core/interfaces/store-user.interface';
import { AuthenticatedUserService } from '../../core/services/authenticated-user.service';

interface MenuItem {
  title: string;
  icon?: string;
  link: string;
}

@Component({
  selector: 'app-layout',
  imports: [TitleCasePipe, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly authService = inject(AuthenticatedUserService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(TuiDialogService);
  private readonly route = inject(ActivatedRoute);

  public user = signal<StoreUser>({} as StoreUser);
  public pageTitle = signal<string>('');

  public isSidebarCollapsed = signal<boolean>(false);
  public isMobile = signal<boolean>(false);

  public menuItems: MenuItem[] = [
    {
      title: 'crear cliente',
      icon: 'pi pi-user-plus',
      link: '/create-customer',
    },
    {
      title: 'ver clientes',
      icon: 'pi pi-users',
      link: '/view-customers',
    },
    {
      title: 'modificar balance',
      icon: 'pi pi-money-bill',
      link: '/modify-balance',
    },
    {
      title: 'reportes',
      icon: 'pi pi-chart-bar',
      link: '/create-client',
    },
    {
      title: 'historial',
      icon: 'pi pi-history',
      link: '/create-client',
    },
  ];

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
    if (!this.isMobile) {
      this.isSidebarCollapsed.set(false); // Asegura que la sidebar esté visible en desktop
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
  }

  public updateTitle = effect(() => {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pageTitle.set(this.route.children[0].snapshot.data['title']);
      });
  });

  logout(): void {
    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: '¿Estás seguro de que quieres cerrar sesión?',
        data: {
          content: 'Esta acción no se puede deshacer',
          yes: 'Salir',
          no: 'Cancelar',
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
