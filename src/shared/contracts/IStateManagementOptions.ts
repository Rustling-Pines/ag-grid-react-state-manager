import { IAgGridState } from "./IAgGridState";

/**
 * @author Pradeep <pradeep.betty@gmail.com>
 * @createdOn 01/01/2023
*/
export interface IStateManagementOptions {
    gridKey: string;
    defaultGridState?: IAgGridState;
    onStateChange?: (gridKey: string, state: IAgGridState) => void;
}