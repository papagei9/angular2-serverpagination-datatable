import {Component, Input, SimpleChange, OnChanges, Optional} from "@angular/core";
import {ServerDataTable, ServerPageEvent} from "./ServerDataTable";

@Component({
    selector: "smfPaginator",
    template: `<ng-content></ng-content>`
})
export class ServerPaginator implements OnChanges {

    @Input("smfTable") inputMfTable: ServerDataTable;

    private mfTable: ServerDataTable;

    public activePage: number;
    public rowsOnPage: number;
    public dataLength: number = 0;
    public lastPage: number;

    public constructor(@Optional() private injectMfTable: ServerDataTable) {
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): any {
        this.mfTable = this.inputMfTable || this.injectMfTable;
        this.onPageChangeSubscriber(this.mfTable.getPage());
        this.mfTable.onPageChange.subscribe(this.onPageChangeSubscriber);
    }

    public setPage(pageNumber: number): void {
        this.mfTable.setPage(pageNumber, this.rowsOnPage);
    }

    public setRowsOnPage(rowsOnPage: number): void {
        this.mfTable.setPage(this.activePage, rowsOnPage);
    }

    private onPageChangeSubscriber = (event: ServerPageEvent)=> {
        this.activePage = event.activePage;
        this.rowsOnPage = event.rowsOnPage;
        this.dataLength = event.dataLength;
        this.lastPage = Math.ceil(this.dataLength / this.rowsOnPage);
    };
}