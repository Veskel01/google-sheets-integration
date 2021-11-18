import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  names,
} from 'unique-names-generator';

const getRandomName = () => {
  const config: Config = {
    dictionaries: [adjectives, names],
    separator: ' ',
    length: 2,
    style: 'capital',
  };

  const randomString = uniqueNamesGenerator(config);
  const [firstname, lastname] = randomString.split(' ');
  return [firstname, lastname];
};

export { getRandomName };
