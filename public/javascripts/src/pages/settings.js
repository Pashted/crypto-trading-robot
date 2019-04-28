import { initMain } from '../main';

import { Message, Warning, Error } from '../modules/notify';
import * as Settings from '../modules/transportLayer';
import * as Accordion from '../modules/accordion';
import * as Symbols from "../modules/settings/symbols";
import * as Chart from '../modules/chart';

initMain().then(() => {

    console.log('>> RUN_ settings.js');

    Accordion.init();

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

    form.find('.saveSettings').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        await Settings.query('saveSettings');
        window.location.reload();

        // Message('Settings saved');
        // btn.removeAttr('disabled');
    });


    form.find('.resetSettings').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        await Settings.query('resetSettings', true);
        window.location.reload();

        // Warning('Settings reset complete!');
        // btn.removeAttr('disabled');
    });


    form.find('.importSymbols').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.query('importSymbols');

        Symbols.change(response);

        Message('Symbols updated');
        btn.removeAttr('disabled');
    });


    form.find('.importCandles').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.query('importCandles');


        Chart.init(response);

        Accordion.show();
        Accordion.fill(response);

        Message('Import candles from the exchange complete');
        btn.removeAttr('disabled');
    });

    form.find('.showCandles').click(async function () {
        let btn = $(this);
        btn.attr('disabled', true);

        let response = await Settings.query('getCandles', true);

        if (!response) {

            Warning("Can't find any saved candles in the database");

        } else {

            Chart.init(response);

            Accordion.show();
            Accordion.fill(response);

            Message('Read candles from the database complete');
        }

        btn.removeAttr('disabled');
    });

});
