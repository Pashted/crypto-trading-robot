import '../less/index.less'

import UIKit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons';

UIKit.use(Icons);

import * as ws from './ws'
import AppInit from './components/App'

ws.connect()
    .then(() => ws.send({ method: 'getSettings' }))
    .then(res => AppInit(res))
    .catch(err=> console.log(err));

