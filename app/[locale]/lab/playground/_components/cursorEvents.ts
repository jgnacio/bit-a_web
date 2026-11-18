/**
 * Contract between the toy stage and the custom cursor.
 *
 * The stage dispatches `pg:cursor` on `window` when a toy is hovered
 * (`detail` is the label and the service color) and again with `null` when
 * the pointer leaves. The custom cursor, added later, listens for it.
 */
export const PG_CURSOR_EVENT = "pg:cursor";

export interface PgCursorDetail {
  label: string;
  /** Hex color of the hovered service. */
  color: string;
}

export function emitCursor(detail: PgCursorDetail | null): void {
  window.dispatchEvent(new CustomEvent<PgCursorDetail | null>(PG_CURSOR_EVENT, { detail }));
}
