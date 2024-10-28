import logSymbols from 'log-symbols';
import { green, italic, underline } from 'picocolors';

export const HELP_TEXT = `
${logSymbols.info} Usage
    npx ${italic('substract-cli')} [options]

${logSymbols.info} Options
    ${green(underline('apple-binary-path'))}   The path to the OCR engine compiled for the Apple environment.
    ${green(underline('concurrency'))}         The number of threads to use to process the OCR. The higher the value the more CPU power will be used.
    ${green(underline('frequency'))}           The frequency in seconds after which to extract a frame for subtitles. If the subtitles change very quickly in your video use a lower value.
    ${green(underline('bottom'))}              The number of pixels from the bottom of the video to crop to extract the subtitles.
    ${green(underline('top'))}                 The number of pixels from the top of the video to crop to extract the subtitles.
    ${green(underline('left'))}                The number of pixels from the left of the video to crop to extract the subtitles.
    ${green(underline('right'))}               The number of pixels from the right of the video to crop to extract the subtitles.
    ${green(underline('output-file'))}         The output file to write the extracted subtitles to. If this is omitted, the output file will be a JSON file in the same directory as the input.

${logSymbols.success} Examples
    npx substract-cli "tmp/video.mp4" --output-file "./video.srt" --top 10 --bottom 10
`;
