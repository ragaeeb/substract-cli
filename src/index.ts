#!/usr/bin/env bun
import welcome from 'cli-welcome';
import logSymbols from 'log-symbols';
import { substract } from 'substract';

import { name, version } from './utils/constants.js';
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
    const result = await substract(inputSource, options);

    if (result) {
        console.log(`${logSymbols.success} written ${result}`);
    } else {
        console.warn(`${logSymbols.error} Nothing written`);
    }
};

main();
