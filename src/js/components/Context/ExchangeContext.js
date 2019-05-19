import React, { createContext } from 'react'

import params from '../../../../controllers/storage/exchangeParams'

let Context = createContext(params);

console.log('$$ Exchange_Context', Context, params);


export default Context;

export { params as defaultExSettings };
