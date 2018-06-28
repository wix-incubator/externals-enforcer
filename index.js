module.exports = function ExternalsEnforcer (options) {
  this.options = options;

  this.apply = (compiler) => {
    compiler.hooks.afterCompile.tap("ExternalsEnforcerPlugin", ({options, requestShortener, fileDependencies}) => {
      const base = '/node_modules/';

      const externals = Object.keys(options.externals);
      // const fileDependencies = [...requestShortener.cache.keys()].filter(a => a[0] !== '/' && a[0] !== '.');

      const wronglyImportedExternals = {};
      const paths = [];

      fileDependencies.forEach((filename) => {
        let possibleWronglyImportedExternals = [];
        let isSpecificExternal = false;

        externals.forEach((external) => {
          const index = filename.indexOf(`${base}${external}/`);
          if (index < 0) {
            return;
          }

          const dependencyPath = filename.substr(index);

          if (dependencyPath === '') {
            isSpecificExternal = true;
          }

          possibleWronglyImportedExternals.push(external);
        });

        if (!isSpecificExternal && possibleWronglyImportedExternals.length) {
          possibleWronglyImportedExternals.forEach(external => {
            wronglyImportedExternals[external] = true;
          });

          paths.push(filename.substr(filename.indexOf(base)));
        }
      });

      const badExternals = Object.keys(wronglyImportedExternals);

      if (badExternals.length) {
        throw `Found wrongly imported external${(badExternals.length > 1) ? 's' : ''} [${badExternals.join(', ')}] in bundle.
Remove the following imports from your projects:${paths.map(path => `\n- ${path}`).join('')}`;
      }
    });
  }
};
