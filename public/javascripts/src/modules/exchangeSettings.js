export let init = () => {

    let form = $('.settings-form'),
        syms = form.find('#symbol'),
        pairs = form.find('#pair'),

        selected_pair = form.find('#selected-pair'),

        last_pair = pairs.data('value');

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
};