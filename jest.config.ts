// jest.config.ts
import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./__test__'],
  moduleFileExtensions: ['js', 'ts'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  verbose: true

}
export default config