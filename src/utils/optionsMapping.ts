import ytdl from '@distube/ytdl-core';
import getFbVideoInfo from 'fb-downloader-scrapper';
import { Result } from 'meow';
import os from 'node:os';
import path from 'node:path';
import { URL } from 'node:url';
import { SubstractOptions } from 'substract';
import { TwitterDL } from 'twitter-downloader';

import logger from './logger.js';
import { SubstractFlags } from './prompt.js';

export const urlToFilename = (urlString: string): string => {
    const url = new URL(urlString);

    // 1. Check for a "v" query parameter, often used in video URLs
    if (url.searchParams.get('v')) {
        return url.searchParams.get('v') as string;
    }

    // 2. Fall back to using the last part of the pathname if no "v" parameter exists
    const pathParts = url.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1];
};

const isValidUrl = (urlString: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
    return urlRegex.test(urlString);
};

const parseOutputFile = (input: string[]) => {
    const [inputFile] = input;

    if (isValidUrl(inputFile)) {
        const name = urlToFilename(inputFile);
        return path.format({ dir: os.tmpdir(), ext: '.txt', name });
    }

    const parsed = path.parse(path.resolve(inputFile));
    return path.format({ dir: os.tmpdir(), ext: '.txt', name: parsed.name });
};

export const mapFlagsToOptions = ({
    flags: { appleBinaryPath, bottom, concurrency, duplicateTextThreshold, frequency, left, outputFile, right, top },
    input,
}: Result<SubstractFlags>): SubstractOptions => {
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
        outputOptions: { outputFile: outputFile || parseOutputFile(input) },
    };
};

export const mapFileOrUrlToInputSource = async (inputs: string[]): Promise<string[]> => {
    let [inputSource] = inputs;

    if (ytdl.validateURL(inputSource)) {
        const info = await ytdl.getInfo(inputSource);
        const { url: streamUrlForVideo } = ytdl.chooseFormat(info.formats, {
            filter: 'videoonly',
        });

        const { url: streamUrlForAudioVideo } = ytdl.chooseFormat(info.formats, {
            filter: 'audioandvideo',
        });

        return [streamUrlForVideo, streamUrlForAudioVideo];
    } else if (inputSource.includes('/facebook.com/')) {
        const info = await getFbVideoInfo(inputSource);
        logger.debug('Facebook format', info);

        return [info.sd, info.hd].filter(Boolean);
    } else if (inputSource.includes('/x.com/') || inputSource.includes('/twitter.com/')) {
        const info = await TwitterDL(inputSource);
        const { videos = [] } = info.result?.media[0] || {};

        logger.debug('Twitter format', videos);
        const averageQualityVideo = videos.find((v) => v.quality === '1280x720');
        const rest = videos.filter((v) => v.quality !== '1280x720');

        if (averageQualityVideo) {
            rest.unshift(averageQualityVideo);
        }

        return rest.map((v) => v.url);
    }

    return [inputSource];
};
