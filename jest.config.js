module.exports = {
  "testPathIgnorePatterns": [
    "node_modules",
    "<rootDir>/server/src/shared",
    "<rootDir>/client/src/shared",
  ],
  transform: {
    "\\.js$": "babel-jest"
  }
}
