import '../less/index.less'

import UIKit from 'uikit'
import Icons from 'uikit/dist/js/uikit-icons';

UIKit.use(Icons);

import { connect as WebSocketConnect } from './ws'
import AppInit from './components/App'

WebSocketConnect()
    .catch(err => console.log(err))
    .then(AppInit);

