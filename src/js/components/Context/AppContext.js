import React, { createContext } from 'react'

import params from '../../../../components/storage/data/appParams'

let Context = createContext(params);

// console.log('$$ App_Context', Context, params);


export default Context;

export { params as defaultAppSettings };
