# Table component with server sorting and server pagination for Angular2
[![npm version](https://badge.fury.io/js/angular2-serverpagination-datatable.svg)](https://badge.fury.io/js/angular2-serverpagination-datatable)
[![Build Status](https://travis-ci.org/ants24/angular2-serverpagination-datatable.svg?branch=master)](https://travis-ci.org/ants24/angular2-serverpagination-datatable)
[![Code Climate](https://codeclimate.com/github/ants24/angular2-serverpagination-datatable/badges/gpa.svg)](https://codeclimate.com/github/mariuszfoltak/angular2-serverpagination-datatable)
[![Test Coverage](https://codeclimate.com/github/ants24/angular2-serverpagination-datatable/badges/coverage.svg)](https://codeclimate.com/github/ants24/angular2-serverpagination-datatable/coverage)
[![npm downloads](https://img.shields.io/npm/dm/angular2-serverpagination-datatable.svg)](https://npmjs.org/angular2-serverpagination-datatable)
## Demo

Check [live demo](http://plnkr.co/edit/VPTypWHfFnqC1LpOpf8P?p=preview) in plunker

## Installation

```
npm i -S angular2-serverpagination-datatable
```

## Usage example

AppModule.ts
```typescript
import {NgModule} from "@angular/core";
...
import {DataTableModule} from "angular2-serverpagination-datatable";

@NgModule({
    imports: [
        ...
        DataTableModule
    ],
    ...
})
export class AppModule {

}
```

UserComponent.html
```html
<table class="table table-striped" [mfData]="data | dataFilter : filterQuery" #mf="mfDataTable"
                   [mfRowsOnPage]="rowsOnPage" [(mfSortBy)]="sortBy" [(mfSortOrder)]="sortOrder" [mfActivePage]="activePage"
                    (mfOnPageChange)="onPageChange($event)" [(mfAmountOfRows)]="itemsTotal" (mfSortOrderChange)="onSortOrder($event)">
                <thead>
                <tr>
                    <th style="width: 10%"></th>
                    <th style="width: 20%">
                        <mfDefaultSorter by="name">Name</mfDefaultSorter>
                    </th>
                    <th style="width: 40%">
                        <mfDefaultSorter by="email">Email</mfDefaultSorter>
                    </th>
                    <th style="width: 10%">
                        <mfDefaultSorter by="age">Age</mfDefaultSorter>
                    </th>
                    <th style="width: 20%">
                        <mfDefaultSorter [by]="sortByWordLength">City</mfDefaultSorter>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let item of mf.data">
                    <td>
                        <button (click)="remove(item)" class="btn btn-danger">x</button>
                    </td>
                    <td>{{item.name}}</td>
                    <td>{{item.email}}</td>
                    <td class="text-right">{{item.age}}</td>
                    <td>{{item.city | uppercase}}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="5">
                        <mfBootstrapPaginator [rowsOnPageSet]="[5,10,15]"></mfBootstrapPaginator>
                    </td>
                </tr>
                </tfoot>
            </table>
```

UserComponent.ts
```typescript

ngOnInit(): void {
        this.loadData();
    }

    public loadData() {
        this.http.get("/app/data.json")
            .subscribe((data) => {
                setTimeout(() => {

                    this.data = _.orderBy(data.json(), this.sortBy, [this.sortOrder]);
                    this.data = _.slice(this.data, this.activePage, this.activePage + this.rowsOnPage);
                    this.itemsTotal = data.json().length;
                }, 2000);
            });
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    public remove(item) {
        let index = this.data.indexOf(item);
        if (index > -1) {
            this.data.splice(index, 1);
        }
    }
    public onPageChange(event) {
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.loadData();
    }

    public onSortOrder(event) {
        this.loadData();
    }


```
## API

### `mfData` directive

 - selector: `table[mfData]`
 - exportAs: `mfDataTable`
 - inputs
   - `mfData: any[]` - array of data to display in table
   - `mfRowsOnPage: number` - number of rows should be displayed on page (default: 1000)
   - `mfActivePage: number` - page number (default: 1)
   - `mfSortBy: any` - sort by parameter
   - `mfSortOrder: string` - sort order parameter, "asc" or "desc"
 - outputs
   - `mfSortByChange: any` - sort by parameter
   - `mfSortOrderChange: any` - sort order parameter
   - `mfOnPageChange: any` - page change parameter(rowsOnPage,activePage)
 
### `mfDefaultSorter` component

 - selector: `mfDefaultSorter`
 - inputs
   - `by: any` - specify how to sort data (argument for lodash function [_.sortBy ](https://lodash.com/docs#sortBy))
 
### `mfBootstrapPaginator` component
Displays buttons for changing current page and number of displayed rows using bootstrap template (css for bootstrap is required). If array length is smaller than current displayed rows on page then it doesn't show button for changing page. If array length is smaller than min value rowsOnPage then it doesn't show any buttons.

 - selector: `mfBootstrapPaginator`
 - inputs
   - `rowsOnPageSet: number` - specify values for buttons to change number of diplayed rows
