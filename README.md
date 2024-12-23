# AgGridReact StateManager

A lightweight utility that captures AG Grid state changes, such as column reordering, sorting, and filtering, and converts them into a JSON format for seamless state persistence and restoration in React applications.

This package supports both single-grid and multi-grid scenarios, providing hooks that simplify AG Grid state management and enable integration with local storage, APIs, or centralized state stores.

## Licensing Notice

This package interacts with AG Grid, which may require a separate commercial license for its Enterprise features. Ensure you comply with AG Grid’s license terms. This package does not include or distribute any AG Grid license.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Installation

```bash
npm install @rustling-pines/ag-grid-react-state-manager
```

## USAGE

### Component with a Single Grid Scenario

```tsx
import React, { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useGridStateManager, IAgGridState } from '@rustling-pines/ag-grid-react-state-manager';

const SingleGridComponent = () => {

   const {
      gridKey,              // Unique identifier for the grid
      resetGridState,       // Reset the grid to its default state
      clearGridState,       // Clear all saved grid states
      
      // Get the current grid state as a JSON object;
      // use this to save to an API or localStorage based on your needs
      currentGridState,

      // Set the grid's state programmatically from an API or localStorage
      setGridState,

      // Get the necessary props to manage grid state
      getStateManagementProps,

   } = useGridStateManager({

      // Unique identifier for the grid
      gridKey: 'grid-1', 

      // Optional! Load state from localStorage or API
      defaultGridState: JSON.parse(localStorage.getItem('grid-1') || '{}'),

      // Optional (Method-1): Listen for state change events, ignore this if observing currentState
      onStateChange: (gridKey, newState) => { 
         // Persist updated state to localStorage
         localStorage.setItem(gridKey, JSON.stringify(newState));
         console.log(`Grid [${gridKey}] state changed:`, newState);
      },

   });

   // Optional (Method-2): observe the currentGridState directly (no need to rely solely on onStateChange)
   useEffect(() => {
      localStorage.setItem(gridKey, JSON.stringify(currentGridState));
   }, [gridKey, currentGridState]);

   useEffect(() => {
      // Ensure grid state is restored on component mount from localStorage or API
      const savedState = localStorage.getItem(gridKey);
      if (savedState) {
         setGridState(JSON.parse(savedState) as IAgGridState);
      }
   }, [gridKey, setGridState]);

   return (
      <div>
         <button onClick={handleSaveToApi}>Save to Api</button>
         <button onClick={resetGridState}>Reset Grid State</button>
         <button onClick={clearGridState}>Clear Grid State</button>
         <div className="ag-theme-alpine" style={{ width: '100%', height: '400px' }}>
            <AgGridReact
               columnDefs={[
                  { field: 'name', sortable: true, filter: true },
                  { field: 'age', sortable: true, filter: true },
               ]}
               rowData={[
                  { name: 'John', age: 25 },
                  { name: 'Jane', age: 30 },
                  { name: 'Alice', age: 28 },
               ]}
               {...getStateManagementProps()}
            />
         </div>
      </div>
   );
};

export default SingleGridComponent;
```

### Component with Multiple Grids

```tsx
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useMultiGridStateManager } from '@rustling-pines/ag-grid-react-state-manager';

const MultiGridComponent = () => {

   const { gridStates, createGridManager } = useMultiGridStateManager();

   const grid1Manager = createGridManager({
      gridKey: 'grid-1',
      defaultGridState: JSON.parse(localStorage.getItem('grid-1') || '{}'), // Restore from localStorage
      onStateChange: (key, newState) => {
         // Save the updated state to localStorage
         localStorage.setItem(key, JSON.stringify(newState));
         console.log(`Grid [${key}] state changed:`, newState);
      },
   });

   const grid2Manager = createGridManager({
      gridKey: 'grid-2',
      defaultGridState: JSON.parse(localStorage.getItem('grid-2') || '{}'), // Restore from localStorage
      onStateChange: (key, newState) => {
         // Save the updated state to localStorage
         localStorage.setItem(key, JSON.stringify(newState));
         console.log(`Grid [${key}] state changed:`, newState);
      },
   });

   return (
      <div>
         <div>
            <h3>Grid 1</h3>
            <button onClick={grid1Manager.resetGridState}>Reset Grid-1</button>
            <button onClick={grid1Manager.clearGridState}>Clear Grid-1</button>
            <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
               <AgGridReact
                  columnDefs={[{ field: 'name' }, { field: 'age' }]}
                  rowData={[
                     { name: 'John', age: 25 },
                     { name: 'Jane', age: 30 }
                  ]}
                  {...grid1Manager.getStateManagementProps()}
               />
            </div>
         </div>

         <div>
            <h3>Grid 2</h3>
            <button onClick={grid2Manager.resetGridState}>Reset Grid-2</button>
            <button onClick={grid2Manager.clearGridState}>Clear Grid-2</button>
            <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
               <AgGridReact
                  columnDefs={[{ field: 'product' }, { field: 'price' }]}
                  rowData={[
                     { product: 'Apple', price: 1.2 },
                     { product: 'Banana', price: 0.8 },
                  ]}
                  {...grid2Manager.getStateManagementProps()}
               />
            </div>
         </div>

         <h3>All Grid States:</h3>
         <pre>{JSON.stringify(gridStates, null, 2)}</pre>
      </div>
   );
};

export default MultiGridComponent;
```
