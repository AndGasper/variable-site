module.exports = {
  "transform": {
      "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "moduleNameMapper": {
    "constructs": "./src/stacks/constructs"
  },
  "moduleFileExtensions": [
    "tests/**.test.(js|ts)",
  ],
  "globals": {
    "ts-jest": {
      "diagnostics": {
        "warnOnly": true
      }
    },
  "testEnvironment": "node"
  }
}