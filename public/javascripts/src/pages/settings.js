import { initMain } from '../main';

import * as Symbols from '../modules/exchangeSettings';
import * as Settings from '../modules/transportLayer';
import { Message, Warning, Error } from '../modules/notify';

import { initChart } from '../modules/chart';

initMain().then(() => {

    console.log('>> RUN_ settings.js');

    // show password
    $('input[type="password"]').siblings('a').on({
        click: function () {

            let link = $(this),
                input = link.siblings('input'),
                locked = input.attr('type') === 'password',

                icon = locked ? 'unlock' : 'lock',
                tooltip = (locked ? 'Hide' : 'Show') + link.attr('uk-tooltip').replace(/^.*?(\s.*)$/, '$1');

            link.attr('uk-icon', icon);
            link.attr('uk-tooltip', tooltip);

            input.attr('type', locked ? 'text' : 'password');
        }
    });


    Symbols.init();

    let form = $('.settings-form');

    form.find('.save').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.set('Settings').catch(err => console.log(err));

        Message('Settings saved');
        btn.removeAttr('disabled');
    });


    form.find('.reset').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.reset('Settings').catch(err => console.log(err));

        Warning('Settings reset complete!');
        btn.removeAttr('disabled');
    });


    form.find('.getSymbols').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.get('Symbols').catch(err => console.log(err));

        Message('Symbols updated');
        btn.removeAttr('disabled');
    });


    form.find('.getCandles').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.get('Candles').catch(err => console.log(err));

        Message('Candles updated');
        btn.removeAttr('disabled');
    });

    form.find('.uk-accordion').on({
        shown: function () {
            $(this).attr('uk-accordion', 'collapsible:false').find('.uk-accordion-title').remove();
            initChart();
        }
    })

});
