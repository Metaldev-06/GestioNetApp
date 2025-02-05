import { TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { StoreUser } from '../../core/interfaces/store-user.interface';

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
})
export class LayoutComponent implements OnInit {
  private readonly storage = inject(StorageService);

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
}
