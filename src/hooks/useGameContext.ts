import { useContext } from "react";
import {
  EnhancedDataContext,
  GameDataContext,
  MapStatePreviewDispatchContext,
  MapReplayContext,
} from "@/app/providers/context/GameContextProvider";
import type { buildGameContext } from "@/app/providers/context/utils/buildGameContext";
import type {
  GameDataState,
  MapReplayState,
  MapStatePreview,
} from "@/app/providers/context/types";
import { useFowViewStore } from "@/utils/fowViewStore";

export function useGameContext():
  | ReturnType<typeof buildGameContext>
  | undefined {
  return useContext(GameDataContext);
}

export function useGameDataState(): GameDataState | undefined {
  const contextValue = useContext(EnhancedDataContext);
  return contextValue?.dataState;
}

// Simple alias for clarity in components
export function useGameData(): ReturnType<typeof useGameContext> {
  return useGameContext();
}

/**
 * True only for the GM's own unfiltered view - not while previewing as a specific player.
 * The backend's X-Viewer-Is-Gm header stays true during preview too (so "view as" controls
 * keep showing), so gameData.viewerIsGm alone can't be used to gate FoW-hidden UI: it would
 * keep showing GM-only elements even while the GM is trying to see a player's actual view.
 */
export function useIsTrueGmView(): boolean {
  const gameData = useGameData();
  const viewAsPlayerId = useFowViewStore((state) => state.viewAsPlayerId);
  return Boolean(gameData?.viewerIsGm) && viewAsPlayerId === null;
}

export function useDecalOverrides(): {
  decalOverrides: Record<string, string>;
  setDecalOverride: (faction: string, decalId: string | null) => void;
  clearDecalOverride: (faction: string) => void;
} {
  const contextValue = useContext(EnhancedDataContext);
  return {
    decalOverrides: contextValue?.decalOverrides ?? {},
    setDecalOverride: contextValue?.setDecalOverride ?? (() => {}),
    clearDecalOverride: contextValue?.clearDecalOverride ?? (() => {}),
  };
}

export function useColorOverrides(): {
  colorOverrides: Record<string, string>;
  setColorOverride: (faction: string, colorAlias: string | null) => void;
  clearColorOverride: (faction: string) => void;
} {
  const contextValue = useContext(EnhancedDataContext);
  return {
    colorOverrides: contextValue?.colorOverrides ?? {},
    setColorOverride: contextValue?.setColorOverride ?? (() => {}),
    clearColorOverride: contextValue?.clearColorOverride ?? (() => {}),
  };
}

export function useMapStatePreview(): (
  preview: MapStatePreview | null,
) => void {
  return useContext(MapStatePreviewDispatchContext);
}

export function useMapReplay(): MapReplayState {
  return useContext(MapReplayContext);
}
