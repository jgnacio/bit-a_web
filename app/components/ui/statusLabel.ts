import type { Status } from "./Status";

/** The key of each status word under `Common.status` in the messages. */
export const STATUS_KEY: Record<Status, "available" | "inProgress" | "measuring" | "planned"> = {
  available: "available",
  "in-progress": "inProgress",
  measuring: "measuring",
  planned: "planned",
};
