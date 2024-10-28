#!/usr/bin/env bun
import welcome from 'cli-welcome';

import { name, version } from '../package.json'; // Adjust path if necessary
import { mapFlagsToOptions } from './utils/optionsMapping.js';

const main = () => {
    welcome({
        bgColor: `#FADC00`,
        bold: true,
        clear: true,
        color: `#000000`,
        title: name,
        version,
    });

    const options = mapFlagsToOptions();
};

main();
