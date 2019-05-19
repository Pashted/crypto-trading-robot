import React, { createContext } from 'react'

import user from '../../../../controllers/storage/userParams'

let Context = createContext(user);

console.log('$$ User_Context', Context, user);


export default Context;

export { user as defaultUserSettings };
