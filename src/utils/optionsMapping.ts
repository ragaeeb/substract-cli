import meow from 'meow';
import path from 'node:path';
import { SubstractOptions } from 'substract';

import { HELP_TEXT } from './constants.js';

export const mapFlagsToOptions = (): SubstractOptions => {
    const {
        flags: {
            appleBinaryPath,
            bottom,
            concurrency,
            duplicateTextThreshold,
            frequency,
            left,
            outputFile,
            right,
            top,
        },
        input,
    } = meow(HELP_TEXT, {
        flags: {
            appleBinaryPath: {
                isRequired: true,
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
                isRequired: (flags, input) => input.length === 0,
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
        },

        importMeta: import.meta,
    });

    const [inputFile] = input;

    const parsed = path.parse(inputFile);

    const hasCropOptions = Boolean(top || bottom || left || right);

    return {
        ...(concurrency && { concurrency }),
        ...(duplicateTextThreshold && { duplicateTextThreshold }),
        ...((hasCropOptions || frequency) && {
            frameOptions: {
                ...(frequency && { frequency }),
                ...(hasCropOptions && {
                    cropOptions: {
                        ...(top && { top }),
                        ...(left && { left }),
                        ...(right && { right }),
                        ...(bottom && { bottom }),
                    },
                }),
            },
        }),
        ocrOptions: { appleBinaryPath },
        outputOptions: { outputFile: outputFile || path.format({ ...parsed, ext: '.json' }) },
    };
};
