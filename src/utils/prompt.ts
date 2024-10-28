import fs from 'fs';
import meow, { Result } from 'meow';

import config from './config.js';
import { HELP_TEXT } from './constants.js';

export type SubstractFlags = {
    appleBinaryPath: {
        isRequired: true;
        shortflag: string;
        type: 'string';
    };
    bottom: {
        shortflag: string;
        type: 'number';
    };
    concurrency: {
        shortflag: string;
        type: 'number';
    };
    duplicateTextThreshold: {
        shortflag: string;
        type: 'number';
    };
    frequency: {
        shortflag: string;
        type: 'number';
    };
    left: {
        shortflag: string;
        type: 'number';
    };
    outputFile: {
        isRequired: (flags: Readonly<any>, input: readonly string[]) => boolean;
        shortflag: string;
        type: 'string';
    };
    right: {
        shortflag: string;
        type: 'number';
    };
    top: {
        shortflag: string;
        type: 'number';
    };
};

export const getCliArgs = (): Result<SubstractFlags> => {
    const myFlags = {
        appleBinaryPath: {
            isRequired: () => {
                const binaryPath = config.get('appleBinaryPath') as string;
                return !binaryPath || !fs.existsSync(binaryPath);
            },
            shortflag: 'a',
            type: 'string',
        },
        bottom: {
            shortflag: 'b',
            type: 'number',
        },
        concurrency: {
            shortflag: 'c',
            type: 'number',
        },
        duplicateTextThreshold: {
            shortflag: 'd',
            type: 'number',
        },
        frequency: {
            shortflag: 'f',
            type: 'number',
        },
        left: {
            shortflag: 'l',
            type: 'number',
        },
        outputFile: {
            isRequired: (flags: any, input: string[]) => input.length === 0,
            shortflag: 'o',
            type: 'string',
        },
        right: {
            shortflag: 'r',
            type: 'number',
        },
        top: {
            shortflag: 't',
            type: 'number',
        },
    };

    const result = meow(HELP_TEXT, {
        flags: myFlags as any,
        importMeta: import.meta,
    });

    if (result.flags.appleBinaryPath) {
        config.set('appleBinaryPath', result.flags.appleBinaryPath);
    } else {
        result.flags.appleBinaryPath = config.get('appleBinaryPath');
    }

    return result;
};
