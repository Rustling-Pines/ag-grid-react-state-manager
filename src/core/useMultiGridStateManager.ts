import { useState, useCallback, useMemo } from "react";
import { IAgGridStateCollection } from "../shared/contracts/IAgGridStateCollection";
import { IAgGridState } from "../shared/contracts/IAgGridState";
import { IStateManagementOptions } from "../shared/contracts/IStateManagementOptions";
import { useGridStateManager } from "./useGridStateManager";

/**
 * Hook to manage multiple AG Grid states and provide utility methods.
 * @author Pradeep <pradeep.betty@gmail.com>
 * @createdOn 01/01/2023
 */
export const useMultiGridStateManager = () => {
    const [gridStates, setGridStates] = useState<IAgGridStateCollection>({});

    /**
     * Factory function to create a state manager for a specific grid.
     * Allows passing a custom `defaultGridState`.
     */
    const createGridManager = useCallback(
        ({
            gridKey,
            defaultGridState,
            onStateChange,
        }: IStateManagementOptions) => {
            return useGridStateManager({
                gridKey,
                defaultGridState: defaultGridState || gridStates[gridKey], // Use passed default or saved state
                onStateChange: (key, newState) => {
                    // Update centralized gridStates
                    setGridStates((prevStates) => ({
                        ...prevStates,
                        [key]: newState,
                    }));

                    // Invoke the custom `onStateChange` handler if provided
                    if (onStateChange) {
                        onStateChange(key, newState);
                    }
                },
            });
        },
        [gridStates] // Dependency array ensures this function is recreated only if gridStates changes
    );

    // Memoize the return object to improve stability
    return useMemo(
        () => ({
            gridStates, // Centralized state for debugging or persistence
            createGridManager, // Factory for managing individual grids
        }),
        [gridStates, createGridManager] // Recalculate only when dependencies change
    );
}