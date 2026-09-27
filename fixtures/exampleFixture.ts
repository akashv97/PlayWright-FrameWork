import { getScenarioData } from './index';

const exampleData = getScenarioData('Load example.com and verify its title');

export const exampleFixture = {
  url: exampleData.url,
  titlePattern: exampleData.title
};
