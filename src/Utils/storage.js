import { STORAGE_KEYS } from "./constants";
import { saveJSON, loadJSON, remove } from "./localStorage";

export function saveState(state) {
  saveJSON(STORAGE_KEYS.STATE, state);
}

export function loadState() {
  return loadJSON(STORAGE_KEYS.STATE, null);
}

export function clearState() {
  remove(STORAGE_KEYS.STATE);
}