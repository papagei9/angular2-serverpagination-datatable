import {Component, Input, OnInit} from "@angular/core";
import {ServerDataTable, ServerSortEvent} from "./ServerDataTable";

@Component({
    selector: "smfDefaultSorter",
    template: `
        <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
            <ng-content></ng-content>
            <span *ngIf="isSortedByMeAsc" class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>
            <span *ngIf="isSortedByMeDesc" class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
        </a>`
})
export class ServerDefaultSorter implements OnInit {
    @Input("by") sortBy: string;

    isSortedByMeAsc: boolean = false;
    isSortedByMeDesc: boolean = false;

    public constructor(private smfTable: ServerDataTable) {
    }

    public ngOnInit(): void {
        this.smfTable.onSortChange.subscribe((event: ServerSortEvent) => {
            this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
            this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == "desc");
        });
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.smfTable.setSort(this.sortBy, "desc");
        } else {
            this.smfTable.setSort(this.sortBy, "asc");
        }
    }
}