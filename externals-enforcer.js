module.exports = function ExternalsEnforcer (options) {
  this.options = options;

  this.apply = (compiler) => {
    compiler.hooks.afterCompile.tap("ExternalsEnforcerPlugin", ({options, fileDependencies}) => {
      const base = '/Users/nachshons/Projects/ecom/client/wixstores-client/wixstores-client-settings-editor/node_modules/';

      const externals = Object.keys(options.externals);
      externals.push('fbjs'); // TODO: remove

      const wronglyImportedExternals = {};
      const paths = [];

      externals.forEach((external) => {
        fileDependencies.forEach((filename) => {
          if (filename.indexOf(`${base}${external}/`) !== 0) {
            return;
          }

          wronglyImportedExternals[external] = true;
          paths.push(filename.slice(base.length));
        });
      });

      compiler.hooks.parser.tap('Ext', function (expr) {
        console.log(expr);
      });

      const badExternals = Object.keys(wronglyImportedExternals);

      if (badExternals.length) {
        throw `Found wrongly imported external${(badExternals.length > 1) ? 's' : ''} [${badExternals.join(', ')}] in bundle.
Remove the following imports from your projects:${paths.map(path => `\n- ${path}`).join('')}`;
      }
    });
  }
};
