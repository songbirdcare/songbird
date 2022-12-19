import { createPool } from "slonik";
import { SETTINGS } from "./settings";

export const POOL = createPool(SETTINGS.sql.uri);
