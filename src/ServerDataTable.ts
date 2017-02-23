import {
    Directive, Input, EventEmitter, SimpleChange, OnChanges, DoCheck, IterableDiffers,
    IterableDiffer, Output
} from "@angular/core";
import * as _ from "lodash";
import {ReplaySubject} from "rxjs/Rx";

export interface ServerSortEvent {
    sortBy: string|string[];
    sortOrder: string
}

export interface ServerPageEvent {
    activePage: number;
    rowsOnPage: number;
    dataLength: number;
}

export interface ServerDataEvent {
    length: number;
}

@Directive({
    selector: 'table[smfData]',
    exportAs: 'smfDataTable'
})
export class ServerDataTable implements OnChanges, DoCheck {

    private diff: IterableDiffer;
    @Input("smfData") public inputData: any[] = [];

    @Input("smfSortBy") public sortBy: string|string[] = "";
    @Input("smfSortOrder") public sortOrder = "asc";
    @Output("smfSortByChange") public sortByChange = new EventEmitter<string|string[]>();
    @Output("smfSortOrderChange") public sortOrderChange = new EventEmitter<string>();
    @Output("smfOnPageChange") public onMyPageChange = new EventEmitter<ServerPageEvent>();
    @Input("smfRowsOnPage") public rowsOnPage = 1000;
    @Input("smfActivePage") public activePage = 1;
    @Input("smfAmountOfRows") public amountOfRows = 0;


    private mustRecalculateData = false;

    public data: any[];

    public onSortChange = new ReplaySubject<ServerSortEvent>(1);
    public onPageChange = new EventEmitter<ServerPageEvent>();

    public constructor(private differs: IterableDiffers) {
        this.diff = differs.find([]).create(null);
    }

    public getSort(): ServerSortEvent {
        return {sortBy: this.sortBy, sortOrder: this.sortOrder};
    }

    public setSort(sortBy: string|string[], sortOrder: string): void {
        if (this.sortBy !== sortBy || this.sortOrder !== sortOrder) {
            this.sortBy = sortBy;
            this.sortOrder = _.includes(["asc","desc"], sortOrder) ? sortOrder : "asc";
            this.mustRecalculateData = true;
            this.onSortChange.next({sortBy: sortBy, sortOrder: sortOrder});
            this.sortByChange.emit(this.sortBy);
            this.sortOrderChange.emit(this.sortOrder);
        }
    }

    public getPage(): ServerPageEvent {
        return {activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: this.inputData.length};
    }

    public setPage(activePage: number, rowsOnPage: number): void {
        if (this.rowsOnPage !== rowsOnPage || this.activePage !== activePage) {
            this.activePage = this.activePage !== activePage ? activePage : this.calculateNewActivePage(this.rowsOnPage, rowsOnPage);
            this.rowsOnPage = rowsOnPage;
            this.mustRecalculateData = true;
            this.onMyPageChange.emit({
                activePage: this.activePage,
                rowsOnPage: this.rowsOnPage,
                dataLength: this.amountOfRows
            });
        }
    }

    private calculateNewActivePage(previousRowsOnPage: number, currentRowsOnPage: number): number {
        let firstRowOnPage = (this.activePage - 1) * previousRowsOnPage + 1;
        let newActivePage = Math.ceil(firstRowOnPage / currentRowsOnPage);
        return newActivePage;
    }

    private recalculatePage() {
        let lastPage = Math.ceil(this.amountOfRows / this.rowsOnPage);
        this.activePage = lastPage < this.activePage ? lastPage : this.activePage;
        this.activePage = this.activePage || 1;

        this.onPageChange.emit({
            activePage: this.activePage,
            rowsOnPage: this.rowsOnPage,
            dataLength: this.amountOfRows
        });
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): any {

        if (changes["sortBy"] || changes["sortOrder"]) {
            if (!_.includes(["asc", "desc"], this.sortOrder)) {
                console.warn("angular2-serverpagination-datatable: value for input smfSortOrder must be one of ['asc', 'desc'], but is:", this.sortOrder);
                this.sortOrder = "asc";
            }
            if (this.sortBy) {
                this.onSortChange.next({sortBy: this.sortBy, sortOrder: this.sortOrder});
            }
            this.mustRecalculateData = true;
        }
        if (changes["inputData"]) {
            this.inputData = changes["inputData"].currentValue || [];
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
    }

    public ngDoCheck(): any {
        let changes = this.diff.diff(this.inputData);
        if (changes) {
            this.recalculatePage();
            this.mustRecalculateData = true;
        }
        if (this.mustRecalculateData) {
            this.fillData();
            this.mustRecalculateData = false;
        }
    }

    private fillData(): void {
        this.activePage = this.activePage;
        this.rowsOnPage = this.rowsOnPage;

        let offset = (this.activePage - 1) * this.rowsOnPage;
        let data = this.inputData;
        var sortBy = this.sortBy;
        /*
        if (typeof sortBy === 'string' || sortBy instanceof String) {
            data = _.orderBy(data, this.caseInsensitiveIteratee(<string>sortBy), [this.sortOrder]);
        } else {
            data = _.orderBy(data, sortBy, [this.sortOrder]);
        }
        data = _.slice(data, offset, offset + this.rowsOnPage);
        */
        this.data = data;
    }

    private caseInsensitiveIteratee(sortBy: string) {
        return (row: any): any => {
            var value = row;
            for (let sortByProperty of sortBy.split('.')) {
                if(value) {
                    value = value[sortByProperty];
                }
            }
            if (value && typeof value === 'string' || value instanceof String) {
                return value.toLowerCase();
            }
            return value;
        };
    }
}
