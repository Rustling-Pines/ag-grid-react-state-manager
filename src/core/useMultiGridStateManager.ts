import { useState } from "react";
import { IAgGridStateCollection } from "../shared/contracts/IAgGridStateCollection";
import { IAgGridState } from "../shared/contracts/IAgGridState";
import { IStateManagementOptions } from "../shared/contracts/IStateManagementOptions";
import { useGridStateManager } from "./useGridStateManager";

/**
 * Hook to manage AG Grid state and provide utility methods.
 * @author Pradeep <pradeep.betty@gmail.com>
 * @createdOn Nov/20/2024
 */
export const useMultiGridStateManager = () => {

    const [gridStates, setGridStates] = useState<IAgGridStateCollection>({});

    /**
     * Updates the state of a specific grid.
     */
    const handleStateChange = (gridKey: string, newState: IAgGridState) => {
        setGridStates((prevStates) => ({
            ...prevStates,
            [gridKey]: newState,
        }));
    };

    /**
     * Factory function to create a state manager for a specific grid.
     * Allows passing a custom `defaultGridState`.
     */
    const createGridManager = ({
        gridKey,
        defaultGridState,
        onStateChange
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
    };

    //---
    return {
        gridStates, // Centralized state for debugging or persistence
        createGridManager, // Factory for managing individual grids
    };

}