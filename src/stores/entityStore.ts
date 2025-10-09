// ============================================
// stores/entityStore.ts - Enhanced with Persist & Immer
// ============================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Entity } from '../types/entity.types';

interface EntityState {
    // Entity identification
    currentEntityId: string | null;
    currentFiscalCode: string | null;

    // Role information (number from BORROWER_TYPES: 1=BORROWER, 2=CO_BORROWER, 5=GUARANTOR, etc.)
    currentRole: number | null;

    // Loan information (for GuarantorList)
    currentSourceSystem: string | null;
    currentUniqueLoanId: string | null;

    // Full entity data (for EntityInfo component)
    currentEntityData: Entity | null;
}

interface EntityActions {
    // Actions - Individual setters
    setCurrentEntityId: (id: string) => void;
    setCurrentFiscalCode: (fiscalCode: string) => void;
    setCurrentRole: (role: number) => void;
    setCurrentSourceSystem: (sourceSystem: string) => void;
    setCurrentUniqueLoanId: (loanId: string) => void;
    setCurrentEntityData: (entityData: Entity) => void;

    // Set all entity info at once (recommended)
    setCurrentEntity: (params: {
        entityId: string;
        fiscalCode: string;
        role: number;
        sourceSystem: string;
        uniqueLoanId: string;
        entityData: Entity;
    }) => void;

    // Clear all current entity data
    clearCurrentEntity: () => void;
}

type EntityStore = EntityState & EntityActions;

// ✅ Version 4: Combine Persist + Immer (ACTIVE)
export const useEntityStore = create<EntityStore>()(
    persist(
        immer((set) => ({
            // Initial state
            currentEntityId: null,
            currentFiscalCode: null,
            currentRole: null,
            currentSourceSystem: null,
            currentUniqueLoanId: null,
            currentEntityData: null,

            // Immer-style setters (mutate directly)
            setCurrentEntityId: (id) => set((state) => {
                state.currentEntityId = id;
            }),

            setCurrentFiscalCode: (fiscalCode) => set((state) => {
                state.currentFiscalCode = fiscalCode;
            }),

            setCurrentRole: (role) => set((state) => {
                state.currentRole = role;
            }),

            setCurrentSourceSystem: (sourceSystem) => set((state) => {
                state.currentSourceSystem = sourceSystem;
            }),

            setCurrentUniqueLoanId: (loanId) => set((state) => {
                state.currentUniqueLoanId = loanId;
            }),

            setCurrentEntityData: (entityData) => set((state) => {
                state.currentEntityData = entityData;
            }),

            setCurrentEntity: ({ entityId, fiscalCode, role, sourceSystem, uniqueLoanId, entityData }) => set((state) => {
                state.currentEntityId = entityId;
                state.currentFiscalCode = fiscalCode;
                state.currentRole = role;
                state.currentSourceSystem = sourceSystem;
                state.currentUniqueLoanId = uniqueLoanId;
                state.currentEntityData = entityData;
            }),

            clearCurrentEntity: () => set((state) => {
                state.currentEntityId = null;
                state.currentFiscalCode = null;
                state.currentRole = null;
                state.currentSourceSystem = null;
                state.currentUniqueLoanId = null;
                state.currentEntityData = null;
            }),
        })),
        {
            name: 'entity-storage', // Key in sessionStorage
            storage: createJSONStorage(() => sessionStorage), // Clears on tab close

            // Only persist essential data (not large entity object)
            partialize: (state) => ({
                currentEntityId: state.currentEntityId,
                currentFiscalCode: state.currentFiscalCode,
                currentRole: state.currentRole,
                currentSourceSystem: state.currentSourceSystem,
                currentUniqueLoanId: state.currentUniqueLoanId,
                // Skip currentEntityData to reduce storage size
            }),
        }
    )
);