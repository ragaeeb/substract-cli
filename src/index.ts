#!/usr/bin/env bun
import welcome from 'cli-welcome';
import logSymbols from 'log-symbols';
import { substract } from 'substract';

import { name, version } from './utils/constants.js';
import logger from './utils/logger.js';
import { mapFileOrUrlToInputSource, mapFlagsToOptions } from './utils/optionsMapping.js';
import { getCliArgs } from './utils/prompt.js';

const main = async () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        color: `#000000`,
        title: name,
        version,
    });

    const cli = getCliArgs();
    const options = mapFlagsToOptions(cli);
    const inputSource = await mapFileOrUrlToInputSource(cli.input);

    if (!inputSource) {
        logger.warn(`${logSymbols.error} No video found at ${cli.input}`);
        return;
    }

    const result = await substract(inputSource, options);

    if (!result) {
        logger.warn(`${logSymbols.error} Nothing written`);
    }

    logger.info(`${logSymbols.success} written ${result}`);
};

main();
