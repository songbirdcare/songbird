import tracer from "dd-trace";

import { SETTINGS } from "./settings";

if (SETTINGS.dd.apiKey) {
  tracer.init();
}
export default tracer;
