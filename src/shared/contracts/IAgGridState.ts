import { AdvancedFilterModel, ColumnState, FilterModel } from "ag-grid-enterprise";

/**
 * @author Pradeep <pradeep.betty@gmail.com>
 * @createdOn 01/01/2023
*/
export interface IAgGridState {
    openedToolPanel: string | null;
    columnState: ColumnState[] | null;
    filterModel: FilterModel | null;
    advancedFilterModel: AdvancedFilterModel | null;
}