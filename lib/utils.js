import prettyMilliseconds from 'pretty-ms';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

export const calculateTimeAgo = (date) => {
  return !isNaN(date) ? prettyMilliseconds(Math.abs(new Date() - new Date(date)), {compact: true}) : ''
}

export const generateNameFromSeed = (seed) => {
    const config = {
        dictionaries: [colors, animals ],
        separator: '-',
        seed,
      };
      
      return uniqueNamesGenerator(config);
}

