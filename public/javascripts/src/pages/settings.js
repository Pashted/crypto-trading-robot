import { initMain } from '../main';

import { serializeJSON as serialize } from '../modules/serializeJSON';

import * as Symbols from '../modules/exchangeSettings';


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

    let form = $('.settings-form'),
        section_icon = $('aside .uk-active [uk-icon]').attr('uk-icon'),
        note_timeout = 3,
        note_style = 'success';

    Symbols.init();

    form.find('button.save').click(function () {

        let btn = form.find('button[type="submit"]'),
            data = {
                method: 'saveSettings',
                params: serialize(form)
            };

        btn.attr('disabled', true);


        $.ajax({
            url:      form.attr('action'),
            method:   form.attr('method'),
            dataType: 'json',
            data,
            success(res) {
                console.log(res);

                UIkit.notification({
                    message: `<span uk-icon='${section_icon}'></span> Settings saved`,
                    status:  note_style,
                    pos:     'bottom-right',
                    timeout: note_timeout
                });

                setTimeout(() => window.location.reload(), note_timeout / 3);

            },
            complete() {
                btn.removeAttr('disabled');
            }
        });
    });


    form.find('button.reset').click(function () {
        $(this).attr('disabled', true);

        let url = form.attr('action');

        $.ajax({
            url,
            method:   form.attr('method'),
            dataType: 'json',
            data:     { method: 'resetSettings' },
            success(res) {
                console.log(res);

                UIkit.notification({
                    message: `<span uk-icon='${section_icon}'></span> Settings reset complete!`,
                    status:  note_style,
                    pos:     'bottom-right',
                    timeout: note_timeout
                });

                setTimeout(() => window.location.reload(), note_timeout / 3);

            },
        });
    });


    form.find('button.getSymbols').click(function () {

        $(this).attr('disabled', true);

        let data = {
            method: 'getSymbols',
            params: serialize(form)
        };

        $.ajax({
            url:      form.attr('action'),
            method:   form.attr('method'),
            dataType: 'json',
            data,
            success(res) {
                console.log(res);

                UIkit.notification({
                    message: `<span uk-icon='${section_icon}'></span> Symbols updated`,
                    status:  note_style,
                    pos:     'bottom-right',
                    timeout: note_timeout
                });

                setTimeout(() => window.location.reload(), note_timeout / 3);

            },
        });
    });


    form.find('button.getCandles').click(function () {

        $(this).attr('disabled', true);

        let data = {
            method: 'getCandles',
            params: serialize(form)
        };

        $.ajax({
            url:      form.attr('action'),
            method:   form.attr('method'),
            dataType: 'json',
            data,
            success(res) {
                console.log(res);

                UIkit.notification({
                    message: `<span uk-icon='${section_icon}'></span> Candles updated`,
                    status:  note_style,
                    pos:     'bottom-right',
                    timeout: note_timeout
                });

                setTimeout(() => window.location.reload(), note_timeout / 3);

            },
        });
    });

});
