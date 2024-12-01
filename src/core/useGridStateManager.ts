import { useState } from 'react';
import { GridApi } from 'ag-grid-community';
import { AgGridReactProps } from 'ag-grid-react';

import { IAgGridState } from '../shared/contracts/IAgGridState';
import { IStateManagementOptions } from '../shared/contracts/IStateManagementOptions';

/**
 * Hook to manage AG Grid state and provide utility methods.
 * @author pradeep.betty@gmail.com
 * @createdOn Nov/20/2024
 */
export const useGridStateManager = ({
   gridKey,
   defaultGridState,
   onStateChange,
}: IStateManagementOptions) => {

   const [agGridApi, setAgGridApi] = useState<GridApi | undefined>();
   const [currentGridState, setCurrentGridState] = useState<IAgGridState | undefined>(defaultGridState);

   // Handles grid state changes and triggers the `onStateChange` callback
   const handleGridStateChange = async () => {
      if (agGridApi) {

         const newState: IAgGridState = {
            openedToolPanel: agGridApi.getOpenedToolPanel(),
            columnState: agGridApi.getColumnState(),
            filterModel: agGridApi.getFilterModel(),
            advancedFilterModel: agGridApi.getAdvancedFilterModel(),
         };

         setCurrentGridState(newState);

         if (onStateChange) {
            onStateChange(gridKey, newState);
         }
      }
   };

   // Clears all grid state
   const clearGridState = () => {
      if (agGridApi) {
         agGridApi.resetColumnState();
         agGridApi.resetColumnGroupState();
         agGridApi.resetRowHeights();
         agGridApi.setFilterModel(null);
         agGridApi.setAdvancedFilterModel(null);

         // clear
         setCurrentGridState(undefined);
      }
   };

   // Resets the grid state to the default
   const resetGridState = async () => {
      if (defaultGridState) {
         await setGridState(defaultGridState);
      } else {
         clearGridState();
      }
   };

   // Applies the grid state (can be called asynchronously)
   const setGridState = async (gridState?: IAgGridState) => {
      if (agGridApi && gridState) {
         const { openedToolPanel, columnState, filterModel, advancedFilterModel } = gridState;

         if (openedToolPanel) {
            agGridApi.openToolPanel(openedToolPanel);
         } else {
            agGridApi.closeToolPanel();
         }

         if (columnState) {
            agGridApi.applyColumnState({
               state: columnState,
               applyOrder: true,
            });
         }

         if (filterModel) {
            agGridApi.setFilterModel(filterModel);
         }

         if (advancedFilterModel) {
            agGridApi.setAdvancedFilterModel(advancedFilterModel);
         }

         setCurrentGridState(gridState);
      }
   };

   // Wraps internal and user-defined event handlers
   const wrapEventHandler = (
      internalHandler: Function,
      userHandler?: Function
   ) => {
      return async (...args: any[]) => {
         await internalHandler(...args);
         if (userHandler) {
            await userHandler(...args);
         }
      };
   };

   // Props to pass to AG Grid
   const getStateManagementProps = (
      additionalProps?: Partial<AgGridReactProps>
   ): Partial<AgGridReactProps> => {

      return {
         onGridReady: wrapEventHandler((e: any) => {
            setAgGridApi(e.api);
            if (defaultGridState) {
               setGridState(defaultGridState);
            }
         }, additionalProps?.onGridReady),

         onSortChanged: wrapEventHandler(handleGridStateChange, additionalProps?.onSortChanged),
         onFilterChanged: wrapEventHandler(handleGridStateChange, additionalProps?.onFilterChanged),
         onToolPanelVisibleChanged: wrapEventHandler(handleGridStateChange, additionalProps?.onToolPanelVisibleChanged),
         onColumnVisible: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnVisible),
         onColumnPinned: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnPinned),
         onColumnResized: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnResized),
         onColumnMoved: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnMoved),
         onColumnRowGroupChanged: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnRowGroupChanged),
         onColumnValueChanged: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnValueChanged),
         onColumnPivotChanged: wrapEventHandler(handleGridStateChange, additionalProps?.onColumnPivotChanged),
      };
   };

   // ---
   return {
      gridKey, currentGridState,
      setGridState, resetGridState, clearGridState,
      getStateManagementProps,
   };
};