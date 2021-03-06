const markdownlint = require('markdownlint');
const chalk = require('chalk');
const config = require('./config');

const buildinRules = [
  require('./lib/full-width-punctuation'),
  require('./lib/period-outside-brackets'),
  require('./lib/cn-en-spaces'),
  require('./lib/use-cn-quote'),
];

const options = {
  // files: ['./test/cn-en.md'],
  customRules: [],
  config,
};

const result = markdownlint.sync(options);

module.exports = ({ files, rules }) =>
  markdownlint.sync({
    ...options,
    files,
    customRules: [...buildinRules, ...rules],
  });

module.exports.outputFormatter = output => {
  const filenames = Object.keys(output);
  const [boldError, shinError, info] = [chalk.bold.red, chalk.red, chalk.gray];
  filenames.forEach(filename => {
    const errorList = output[filename];
    if (!Array.isArray(errorList) || errorList.length <= 0) return;

    errorList.forEach(item => {
      const {
        lineNumber,
        errorRange,
        ruleNames,
        ruleDescription,
        errorDetail,
        errorContext,
      } = item;

      const eTitle = `${filename}:${lineNumber}${
        errorRange && errorRange.length >= 1 ? `:${errorRange[0]}` : ''
      }`;
      let description = ruleDescription;
      if (errorDetail) description += ` [${errorDetail}]`;
      if (errorContext) description += ` [${errorContext}]`;
      console.log(
        boldError(eTitle),
        shinError(`[${ruleNames.join('/')}]`),
        info(description)
      );
    });
  });
};
