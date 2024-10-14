import { web } from "./application/web";
import { logger } from "./application/logging";
import * as dotenv from "dotenv";

web.listen(5000, () => {
    logger.info("App start");
});

export default web;