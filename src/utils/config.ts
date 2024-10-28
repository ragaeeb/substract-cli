import Conf from 'conf';

import { name } from './constants.js';

const config = new Conf({ projectName: name });

export default config;
