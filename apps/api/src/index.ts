import { log } from "@repo/logger";
import { app } from "./server";

const port = 4000;

app.listen(port, () => {
  log(`api running on ${port}`);
});
