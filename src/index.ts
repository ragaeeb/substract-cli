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
    const inputSources = await mapFileOrUrlToInputSource(cli.input);

    if (!inputSources.length) {
        logger.warn(`${logSymbols.error} No video found at ${cli.input}`);
    }

    for (const inputSource of inputSources) {
        try {
            const result = await substract(inputSource, options);

            if (result) {
                logger.info(`${logSymbols.success} written ${result}`);
            } else {
                logger.warn(`${logSymbols.error} Nothing written`);
            }

            break;
        } catch (err: any) {
            logger.error(err);
        }
    }
};

main();
