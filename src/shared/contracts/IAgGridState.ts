import { AdvancedFilterModel, ColumnState, FilterModel } from "ag-grid-enterprise";

/**
 * Author: pradeep.betty@gmail.com
 * CreatedOn: Nov/20/2024
*/
export interface IAgGridState {
    openedToolPanel: string | null;
    columnState: ColumnState[] | null;
    filterModel: FilterModel | null;
    advancedFilterModel: AdvancedFilterModel | null;
}