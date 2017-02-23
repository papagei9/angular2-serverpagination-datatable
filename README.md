# Table component with server sorting and server pagination for Angular2

This version has slightly different syntax due to backwards-compatilibity to the angular2-datatable module.

This version is based on [https://github.com/Ants24/angular2-serverpagination-datatable](https://github.com/Ants24/angular2-serverpagination-datatable)

## Demo

**NOT UPDATED** ~~Check [~~live demo~~](http://plnkr.co/edit/VPTypWHfFnqC1LpOpf8P?p=preview) in plunker~~

## Installation

Module is currently not published on npm. Use the .tgz archive to install it locally.

```
npm i -S angular2-serverpagination-datatable-abilium-1.5.4.tgz --save
```

## Usage example

AppModule.ts
```typescript
import {NgModule} from "@angular/core";
...
import {ServerDataTableModule} from "angular2-serverpagination-datatable-abilium";

@NgModule({
    imports: [
        ...
        ServerDataTableModule
    ],
    ...
})
export class AppModule {

}
```

UserComponent.html
```html
<table class="table table-striped" [smfData]="data | dataFilter : filterQuery" #smf="mfDataTable"
                   [smfRowsOnPage]="rowsOnPage" [(smfSortBy)]="sortBy" [(smfSortOrder)]="sortOrder" [smfActivePage]="activePage"
                    (smfOnPageChange)="onPageChange($event)" [(smfAmountOfRows)]="itemsTotal" (smfSortOrderChange)="onSortOrder($event)">
                <thead>
                <tr>
                    <th style="width: 10%"></th>
                    <th style="width: 20%">
                        <smfDefaultSorter by="name">Name</smfDefaultSorter>
                    </th>
                    <th style="width: 40%">
                        <smfDefaultSorter by="email">Email</smfDefaultSorter>
                    </th>
                    <th style="width: 10%">
                        <smfDefaultSorter by="age">Age</smfDefaultSorter>
                    </th>
                    <th style="width: 20%">
                        <smfDefaultSorter [by]="sortByWordLength">City</smfDefaultSorter>
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
                        <smfBootstrapPaginator [rowsOnPageSet]="[5,10,15]"></smfBootstrapPaginator>
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
                    this.data = _.slice(this.data, (this.activePage-1)*this.rowsOnPage, (this.activePage-1)*this.rowsOnPage + this.rowsOnPage);
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

 - selector: `table[smfData]`
 - exportAs: `smfDataTable`
 - inputs
   - `smfData: any[]` - array of data to display in table
   - `smfRowsOnPage: number` - number of rows should be displayed on page (default: 1000)
   - `smfActivePage: number` - page number (default: 1)
   - `smfSortBy: any` - sort by parameter
   - `smfSortOrder: string` - sort order parameter, "asc" or "desc"
 - outputs
   - `smfSortByChange: any` - sort by parameter
   - `smfSortOrderChange: any` - sort order parameter
   - `smfOnPageChange: any` - page change parameter(rowsOnPage,activePage)
 
### `smfDefaultSorter` component

 - selector: `smfDefaultSorter`
 - inputs
   - `by: any` - specify how to sort data (argument for lodash function [_.sortBy ](https://lodash.com/docs#sortBy))
 
### `smfBootstrapPaginator` component
Displays buttons for changing current page and number of displayed rows using bootstrap template (css for bootstrap is required). If array length is smaller than current displayed rows on page then it doesn't show button for changing page. If array length is smaller than min value rowsOnPage then it doesn't show any buttons.

 - selector: `smfBootstrapPaginator`
 - inputs
   - `rowsOnPageSet: number` - specify values for buttons to change number of diplayed rows
