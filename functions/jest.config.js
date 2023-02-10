module.exports = {
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!@babel).+\\.js$'],
  testRegex: '(/__tests__/.*|[^/]*(\\.|/)(test|spec))\\.[jt]sx?$',
};
