const path = require('path');
const clearDir = require('./clear-dir');
const flushPromises = require('flush-promises');

const ExternalsEnforcerPlugin = require('../index');

const {runWebpack} = require('./run-webpack');

const SUCESS_STATS = ['app.bundle.js'];

describe('external enforcer', () => {
  const outputDirPath = path.resolve(__dirname, './output/external-enforcer');
  const entryName = 'app';
  let stats,
    error;

  async function setup(fileName,externals) {
    try {
      stats = await runWebpack({
        output: {
          path: path.resolve(outputDirPath)
        },
        entry: {
          [entryName]: `./tests/fixtures/${fileName}.js`
        },
        externals,
        plugins: [new ExternalsEnforcerPlugin()]
      });
    } catch (e) {
      error = e;
    }
  }

  afterEach(async () => {
    clearDir(outputDirPath);
    error = undefined;
    stats = undefined;
    await flushPromises();
  });

  it('should pass when import matches the external exactly', async () => {
    await setup('test-entry', {'lodash': '_'});
    expect(stats).toEqual(SUCESS_STATS);
  });

  it('should pass when no matching external', async () => {
    await setup('test-entry', {});
    expect(stats).toEqual(SUCESS_STATS);
  });

  it('should fail when import is under nested in external', async () => {
    await setup('test-fail-entry', {'lodash': '_'});
    expect(error).toContain('[lodash]');
    expect(error).toContain('lodash/values');
  });

  it('should pass when both nested and regular external are defined and import nested', async () => {
    await setup('test-fail-entry', {'lodash': '_', 'lodash/values': 'asd'});
    expect(stats).toEqual(SUCESS_STATS);
  });

  it('should pass when import external with same prefix', async () => {
    await setup('test-entry', {'lodas': '_'});
    expect(stats).toEqual(SUCESS_STATS);
  });
});