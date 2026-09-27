import qa1Scenarios from './qa1/example.json';
import qa2Scenarios from './qa2/example.json';

export interface ScenarioTestData {
  url: string;
  title?: string;
  username?: string;
  password?: string;
  landingUrl?: string;
}

const environments: Record<string, Record<string, ScenarioTestData>> = {
  qa1: qa1Scenarios,
  qa2: qa2Scenarios
};

const environment = process.env.TEST_ENV ?? 'qa1';

if (!environments[environment]) {
  throw new Error(`Unknown TEST_ENV "${environment}". Use qa1 or qa2.`);
}

export function getScenarioData(scenarioName: string): ScenarioTestData {
  const scenarioData = environments[environment][scenarioName];

  if (!scenarioData) {
    throw new Error(`No test data found for scenario "${scenarioName}" in ${environment}.`);
  }

  return scenarioData;
}