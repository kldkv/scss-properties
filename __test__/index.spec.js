const path = require('path');
const sassTrue = require('sass-true');
const glob = require('glob');

describe('Sass', () => {
  const sassTestFiles = glob.sync(
    path.resolve(process.cwd(), './__test__/*.spec.scss')
  )
  
  sassTestFiles.forEach(file =>
    sassTrue.runSass({file}, {describe, it})
  )
})