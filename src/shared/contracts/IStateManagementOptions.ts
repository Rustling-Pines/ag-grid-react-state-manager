import { IAgGridState } from "./IAgGridState";

/**
 * Author: Pradeep <pradeep.betty@gmail.com>
 * CreatedOn: Nov/20/2024
*/
export interface IStateManagementOptions {
    gridKey: string;
    defaultGridState?: IAgGridState;
    onStateChange?: (gridKey: string, state: IAgGridState) => void;
}