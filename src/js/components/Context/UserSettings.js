import React, { createContext } from 'react'

import settings from '../../../../controllers/storage/userParams'

let Context = createContext(settings);

console.log('$$ UserSettings_Context', Context, settings);


export default Context;

export { settings as defaultSettings };
