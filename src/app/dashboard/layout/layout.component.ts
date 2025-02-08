import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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

  public user = signal<StoreUser>({} as StoreUser);

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
      title: 'reportes',
      icon: 'pi pi-chart-bar',
      link: '/dashboard/create-client',
    },
    {
      title: 'historial',
      icon: 'pi pi-history',
      link: '/dashboard/create-client',
    },
  ];

  ngOnInit(): void {
    this.user.set(this.storage.get('user')!);
  }

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
