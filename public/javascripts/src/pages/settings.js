import { initMain } from '../main';

import { serializeJSON as serialize } from '../modules/serializeJSON';

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

        syms = form.find('#symbol'),
        pairs = form.find('#pair'),

        selected_pair = form.find('#selected-pair'),

        last_pair = pairs.data('value'),

        section_icon = $('aside .uk-active [uk-icon]').attr('uk-icon'),
        note_timeout = 3,
        note_style = 'success';

    syms.on({
        change() {

            pairs.html('');

            let opt = syms.trigger('chosen:updated').find('option').eq(syms[0].selectedIndex);
            if (!opt.length)
                return false;

            let values = opt.data('pairs').split(',');

            $.each(values, (i, e) => {
                pairs.append(`<option value="${e}">${e}</option>`)
            });

            if ($.inArray(last_pair, values) < 0)
                last_pair = pairs.data('default');

            pairs.val(last_pair)
                .trigger('change');
        }
    });

    pairs.on({
        change() {
            last_pair = pairs.trigger('chosen:updated').val();

            if (!selected_pair.is(':focus'))
                selected_pair.val(syms.val() + last_pair);
        }
    });

    syms.trigger('change');

    selected_pair.on({
        input() {
            let val = selected_pair.val(),

                cur = val.substr(0, 3), // first currency in pair
                pair = val.substr(3); // second currency in pair

            if (syms.find(`option[value="${cur}"]`).length)
                syms.val(cur)
                    .trigger('change');

            if (pairs.find(`option[value="${pair}"]`).length)
                pairs.val(pair)
                    .trigger('change');

        },
        blur() {
            pairs.trigger('change')
        }
    });


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
