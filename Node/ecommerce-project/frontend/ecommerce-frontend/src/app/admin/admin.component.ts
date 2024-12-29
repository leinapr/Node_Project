import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'; // Import the module
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

// Register required modules
ModuleRegistry.registerModules([ClientSideRowModelModule]);
export interface ProductModel {
  id: number;
  name: string;
  type: string;
  score: string;
  status: string;
  volumes: number | null;
  genres: string[]; // Array of genres
  demographics: string[]; // Array of demographics
  authors: string[]; // Array of authors
  description: string;
  price: string;
  image: string;
  url: string;
}


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, AgGridModule],
  template: `
    <div *ngIf="isBrowser; else noBrowser">
      <section id="admin-header">
        <a routerLink="/"><img src="assets/images/logo.jpg" class="logo" alt="Logo" /></a>
        <div>
          <ul id="navbar">
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/shop">Shop</a></li>
            <li><a routerLink="/about">About</a></li>
            <li><a routerLink="/contact">Contact</a></li>
            <li><a routerLink="/cart"><i class="fas fa-cart-arrow-down"></i></a></li>
            <li><a routerLink="/admin" class="active">Admin</a></li>
          </ul>
        </div>
      </section>

      <div class="admin-container">
        <h1>Admin Page</h1>
        <ag-grid-angular
          class="ag-theme-quartz"
          style="width: 100%; height: 600px;"
          [rowData]="rows$.value"
          [columnDefs]="colDefs"
          [rowModelType]="'clientSide'"
          (gridReady)="onGridReady($event)">
        </ag-grid-angular>
        <button (click)="onBtExport()">Export CSV</button>
      </div>
    </div>
    <ng-template #noBrowser>
      <p>Admin page is unavailable in server-side rendering.</p>
    </ng-template>
  `,
  styles: [
    `
      .admin-container {
        padding: 20px;
      }
      ag-grid-angular {
        margin-top: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
    `,
  ],
})
export class AdminComponent implements OnInit {
  private gridApi!: GridApi<ProductModel>;
  isBrowser: boolean;

  rows$ = new BehaviorSubject<ProductModel[]>([]); // Reactive Data

  colDefs: ColDef<ProductModel>[] = [
    { headerName: 'Id', field: 'id', sortable: true, filter: 'agNumberColumnFilter', width: 100 },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, width: 200 },
    { headerName: 'Type', field: 'type', sortable: true, filter: true, width: 150 },
    { headerName: 'Score', field: 'score', sortable: true, filter: 'agNumberColumnFilter', width: 100 },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, width: 150 },
    { headerName: 'Volumes', field: 'volumes', sortable: true, filter: 'agNumberColumnFilter', width: 120 },
    {
      headerName: 'Genres',
      valueGetter: (params) => params.data?.genres?.join(', ') || 'N/A',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Demographics',
      valueGetter: (params) => params.data?.demographics?.join(', ') || 'N/A',
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: 'Authors',
      valueGetter: (params) => params.data?.authors?.join(', ') || 'N/A',
      sortable: true,
      filter: true,
      width: 200,
    },
    { headerName: 'Description', field: 'description', sortable: false, filter: false, width: 300 },
    { headerName: 'Price', field: 'price', sortable: true, filter: 'agNumberColumnFilter', width: 100 },
  ];


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadGridData();
    }
  }

  onGridReady(params: GridReadyEvent<ProductModel>): void {
    this.gridApi = params.api;
  }

  onBtExport(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv(); // Ensure gridApi is initialized
    } else {
      console.error('Grid API not initialized.');
    }
  }

  loadGridData(): void {
    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data); // Log the response to see its structure
        if (Array.isArray(data)) {
          this.rows$.next(data); // If the response is an array, use it directly
        } else if (Array.isArray(data.products)) {
          this.rows$.next(data.products); // If the array is nested, extract it
        } else {
          console.error('Invalid data format:', data);
          this.rows$.next([]);
        }
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        this.rows$.next([]); // Handle the error gracefully by clearing the grid
      });
  }

}
