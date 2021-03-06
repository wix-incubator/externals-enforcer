# externals-enforcer [![Build Status][ci-img]][ci]
[ci-img]:  https://travis-ci.org/wix-incubator/externals-enforcer.svg
[ci]:      https://travis-ci.org/wix-incubator/externals-enforcer

![moo]

[moo]: https://static.wixstatic.com/media/7c303e_fced13e8662946baaab2b3f21211f075~mv2.png/v1/fill/w_200,h_200,al_c,q_80,usm_0.66_1.00_0.01/7c303e_fced13e8662946baaab2b3f21211f075~mv2.png

## About
This webpack plugin enforces your webpack externals - i.e. makes sure they don't "sneak" into your bundle.

When defining `externals: {'lodash': '_'}` in your webpack config file, you may think that no part of lodash will find it's way into your bundle, yet sometimes it does. If you use a "deep link" import (e.g. `import values from 'lodash/values`) the values file and all it's dependencies will end up, to your dismay, in your bundle.  This happens because only exact matches are "externalized" (not bundled).

One way to solve this is by adding `'lodash/values': '_.values'` to your webpack externals config.

The main problem with this is that you will probably not notice this is happening. One day, one of your teammates can simply add the "bad" import, maybe even his IDE is the one who inserted the import, and your bundle grew a whole bunch for no reason.

Enter: **externals-enforcer**, a webpack plugin that simply breaks the bundling process if it detects any "bad imports" unless, they too, are set as externals. 

 

## Usage
1. `npm i --save-dev externals-enforcer`
2. In your webpack config:
```
const ExternalsEnforcerPlugin = require('externals-enforcer');

{
    ...
    plugins: [
        ...
        new ExternalsEnforcerPlugin(),
        ...
    ]
    ...
}
```

## How to fix
At some point after using this plugin it may catch a sneaky external trying to get into your bundle and will break your bundling process. In order to fix this issue you have two options:
1. ***fix the import***, assuming that the problem was introduced in code that you have control over it is best to change the import to work with the *exact* external import. So for example use `import {values} from 'lodash'` instead of `import values from 'lodash/values'`. Since it is an `lodash` is an external this will bring you the function you wanted without the side effect of enlarging your bundle. The external is anyway fetched sepreratly in it's entirety.

2. **add the "bad" import path as an external**,when you hav no control over the code containing the problematic import (e.g `import values from 'lodash/values'`), you can instead add it too as an external `(e.g. 'lodash/values': '_.values`). this will cause the "bad" import to be treated as an external and not be imported into the bundle.
