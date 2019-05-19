import React, { createContext } from 'react'

import exchange from '../../../../controllers/storage/exchangeParams'

let Context = createContext(exchange);

console.log('$$ Exchange_Context', Context, exchange);


export default Context;

export { exchange as defaultExSettings };
