import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_CONFIRM } from '@taiga-ui/kit';
import { AuthenticatedUserService } from '../../../../core/services/authenticated-user.service';
import { TitleCasePipe } from '@angular/common';

interface MenuItem {
  title: string;
  icon?: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly authService = inject(AuthenticatedUserService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

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
