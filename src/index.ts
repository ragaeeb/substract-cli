#!/usr/bin/env bun
/* eslint-disable no-undef */
import welcome from 'cli-welcome';
import logSymbols from 'log-symbols';
import { substract } from 'substract';

import { name, version } from './utils/constants.js';
import { mapFlagsToOptions } from './utils/optionsMapping.js';
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

    const result = await substract(cli.input[0], options);

    if (result) {
        console.log(`${logSymbols.success} written ${result}`);
    } else {
        console.warn(`Nothing written ${logSymbols.error}`);
    }
};

main();
