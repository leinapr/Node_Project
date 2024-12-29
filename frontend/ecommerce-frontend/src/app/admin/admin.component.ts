import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';


ModuleRegistry.registerModules([ClientSideRowModelModule]);

export interface ProductModel {
  id: number;
  name: string;
  type: string;
  score: string;
  status: string;
  volumes: number | null;
  genres: string[];
  demographics: string[];
  authors: string[];
  description: string;
  price: string;
  image: string;
  url: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, AgGridModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private gridApi!: GridApi<ProductModel>;
  isBrowser: boolean;

  rows$ = new BehaviorSubject<ProductModel[]>([]);
  colDefs: ColDef<ProductModel>[] = [
    { headerName: 'Id', field: 'id', sortable: true, filter: 'agNumberColumnFilter', width: 100, editable: false },
    { headerName: 'Name', field: 'name', sortable: true, filter: true, width: 200, editable: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true, width: 150, editable: true },
    { headerName: 'Score', field: 'score', sortable: true, filter: 'agNumberColumnFilter', width: 100, editable: true },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, width: 150, editable: true },
    { headerName: 'Volumes', field: 'volumes', sortable: true, filter: 'agNumberColumnFilter', width: 120, editable: true },
    {
      headerName: 'Genres',
      valueGetter: (params) => params.data?.genres?.join(', ') || 'N/A',
      sortable: true,
      filter: true,
      width: 200,
      editable: true,
      valueSetter: (params) => {
        params.data.genres = params.newValue.split(',').map((item: string) => item.trim());
        return true;
      },
    },
    {
      headerName: 'Demographics',
      valueGetter: (params) => params.data?.demographics?.join(', ') || 'N/A',
      sortable: true,
      filter: true,
      width: 200,
      editable: true,
      valueSetter: (params) => {
        params.data.demographics = params.newValue.split(',').map((item: string) => item.trim());
        return true;
      },
    },
    {
      headerName: 'Authors',
      valueGetter: (params) => params.data?.authors?.join(', ') || 'N/A',
      sortable: true,
      filter: true,
      width: 200,
      editable: true,
      valueSetter: (params) => {
        params.data.authors = params.newValue.split(',').map((item: string) => item.trim());
        return true;
      },
    },
    { headerName: 'Description', field: 'description', sortable: false, filter: false, width: 300, editable: true },
    { headerName: 'Price', field: 'price', sortable: true, filter: 'agNumberColumnFilter', width: 100, editable: true },
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

  loadGridData(): void {
    fetch('http://localhost:3000/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.products)) {
          this.rows$.next(data.products);
        } else {
          this.rows$.next([]);
        }
      })
      .catch((error) => {
        console.error('Failed to load products:', error);
        this.rows$.next([]);
      });
  }

  onBtExport(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv();
    } else {
      console.error('Grid API not initialized.');
    }
  }

  // UPDATE
  updateProduct(): void {
    if (this.gridApi) {
      const updatedData = this.gridApi.getSelectedRows();
      updatedData.forEach((product) => {
        fetch(`http://localhost:3000/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })
          .then((response) => response.json())
          .catch((error) => console.error('Failed to update product:', error));
      });
    }
  }

  // DELETE
  deleteSelectedProduct(): void {
    if (this.gridApi) {
      const selectedData = this.gridApi.getSelectedRows();
      selectedData.forEach((product) => {
        fetch(`http://localhost:3000/products/${product.id}`, {
          method: 'DELETE',
        })
          .then(() => {
            this.rows$.next(this.rows$.value.filter((item) => item.id !== product.id));
          })
          .catch((error) => console.error('Failed to delete product:', error));
      });
    }
  }
}
