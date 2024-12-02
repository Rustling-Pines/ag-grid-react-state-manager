import { useState, useCallback, useRef, useMemo } from 'react';
import { GridApi } from 'ag-grid-community';
import { AgGridReactProps } from 'ag-grid-react';

import { IAgGridState } from '../shared/contracts/IAgGridState';
import { IStateManagementOptions } from '../shared/contracts/IStateManagementOptions';

/**
 * Hook to manage AG Grid state and provide utility methods.
 * @author Pradeep <pradeep.betty@gmail.com>
 * @createdOn 01/01/2023
*/
export const useGridStateManager = ({
   gridKey,
   defaultGridState,
   onStateChange,
}: IStateManagementOptions) => {
   const agGridApiRef = useRef<GridApi | null>(null); // Use `useRef` for mutable reference
   const [currentGridState, setCurrentGridState] = useState<IAgGridState | undefined>(defaultGridState);

   // Handles grid state changes and triggers the `onStateChange` callback
   const handleGridStateChange = useCallback(async () => {
      const agGridApi = agGridApiRef.current;
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
   }, [agGridApiRef, gridKey, onStateChange]);

   // Clears all grid state
   const clearGridState = useCallback(() => {
      const agGridApi = agGridApiRef.current;
      if (agGridApi) {
         agGridApi.resetColumnState();
         agGridApi.resetColumnGroupState();
         agGridApi.resetRowHeights();
         agGridApi.setFilterModel(null);
         agGridApi.setAdvancedFilterModel(null);

         setCurrentGridState(undefined);
      }
   }, []);

   // Resets the grid state to the default
   const resetGridState = useCallback(async () => {
      if (defaultGridState) {
         await setGridState(defaultGridState);
      } else {
         clearGridState();
      }
   }, [defaultGridState, clearGridState]);

   // Applies the grid state (can be called asynchronously)
   const setGridState = useCallback(async (gridState?: IAgGridState) => {
      const agGridApi = agGridApiRef.current;
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
   }, []);

   // Wraps internal and user-defined event handlers
   const wrapEventHandler = useCallback(
      (internalHandler: Function, userHandler?: Function) =>
         async (...args: any[]) => {
            await internalHandler(...args);
            if (userHandler) {
               await userHandler(...args);
            }
         },
      []);

   // Props to pass to AG Grid
   const getStateManagementProps = useMemo(
      () => (additionalProps?: Partial<AgGridReactProps>): Partial<AgGridReactProps> => ({
         onGridReady: wrapEventHandler((e: any) => {
            agGridApiRef.current = e.api; // Store Grid API in ref
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
      }),
      [wrapEventHandler, handleGridStateChange, setGridState, defaultGridState]
   );

   // ---
   return {
      gridKey,
      currentGridState,
      setGridState,
      resetGridState,
      clearGridState,
      getStateManagementProps,
   };
};