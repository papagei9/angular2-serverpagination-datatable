import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ServerDataTable} from "./ServerDataTable";
import {ServerDefaultSorter} from "./ServerDefaultSorter";
import {ServerPaginator} from "./ServerPaginator";
import {ServerBootstrapPaginator} from "./ServerBootstrapPaginator";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ServerDataTable,
        ServerDefaultSorter,
        ServerPaginator,
        ServerBootstrapPaginator
    ],
    exports: [
        ServerDataTable,
        ServerDefaultSorter,
        ServerPaginator,
        ServerBootstrapPaginator
    ]
})
export class ServerDataTableModule {

}