import { Result } from 'meow';
import path from 'node:path';
import { SubstractOptions } from 'substract';

import { SubstractFlags } from './prompt.js';

export const mapFlagsToOptions = ({
    flags: { appleBinaryPath, bottom, concurrency, duplicateTextThreshold, frequency, left, outputFile, right, top },
    input,
}: Result<SubstractFlags>): SubstractOptions => {
    const [inputFile] = input;

    const parsed = path.parse(path.resolve(inputFile));

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
        outputOptions: { outputFile: outputFile || path.format({ dir: parsed.dir, ext: '.json', name: parsed.name }) },
    };
};
