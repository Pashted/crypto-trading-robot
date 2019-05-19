import Homepage from "./Homepage";

import Emulation from "./Trading/Emulation";
import Realtime from "./Trading/Realtime";

import Exchange from "./Settings/Exchange";
import Strategy from "./Settings/Strategy";
import Interface from "./Settings/Interface";

import Help from "./Help";

const routes = [
    { name: 'Homepage', com: Homepage, url: '/', icon: 'home' },

    {
        name: 'Trading', url: '/trading/', icon: 'bolt', subSections: [
            { name: 'Emulation', com: Emulation, url: '/trading/emulation/' },
            { name: 'Realtime', com: Realtime, url: '/trading/realtime/' },
        ]
    },

    {
        name: 'Settings', url: '/settings/', icon: 'nut', subSections: [
            { name: 'Exchange', com: Exchange, url: '/settings/exchange/' },
            { name: 'Strategy', com: Strategy, url: '/settings/strategy/' },
            { name: 'Interface', com: Interface, url: '/settings/interface/' }
        ]
    },

    { name: 'Help', com: Help, url: '/help/', icon: 'question' },
];

export default routes