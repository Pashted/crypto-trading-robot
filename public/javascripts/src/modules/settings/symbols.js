let symbols_list;

/**
 * Connects exchange symbols list with pairs list and selected pair text field
 */
let init = () => {

    console.log('>> SYMBOLS init');

    let form = $('.settings-form'),
        pairs = form.find('#pair'),
        selected_pair = form.find('#selected-pair'),
        last_pair = pairs.data('value'); // save last validated value in case of incorrect input

    symbols_list = form.find('#symbol');

    symbols_list.on({
        change() {
            // what happens when we select another symbol from the list

            // clear pairs list
            pairs.html('');

            let selected = symbols_list.trigger('chosen:updated') // refresh chosen plugin in case of changing list value by script
                .find('option').eq(symbols_list[0].selectedIndex); // get selected element of the symbols list

            if (!selected.length)
                return false;

            // make array of available pairs for selected symbol
            let values = selected.data('pairs').split(',');

            $.each(values, (i, e) => pairs.append(`<option value="${e}">${e}</option>`));

            if ($.inArray(last_pair, values) < 0) // when last valid pair is not available for that (newly selected) symbol...
                last_pair = pairs.data('default'); // default value is used

            // apply calculated choice for pairs list
            pairs.val(last_pair)
                .trigger('change');
        }
    });

    pairs.on({
        change() {

            last_pair = pairs.trigger('chosen:updated') // refresh chosen plugin in case of changing list value by script
                .val(); // save selected value in case of incorrect input

            if (!selected_pair.is(':focus'))
                selected_pair.val(symbols_list.val() + last_pair);
        }
    });

    symbols_list.trigger('change');

    selected_pair.on({
        input() {
            let val = selected_pair.val(),

                cur = val.substr(0, 3), // first currency in pair
                pair = val.substr(3); // second currency in pair

            if (symbols_list.find(`option[value="${cur}"]`).length)
                symbols_list.val(cur)
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

/**
 * Rebuilds symbols list when external data values has received
 * @param data
 */
let change = data => {

    if (typeof data !== "object")
        return false;

    let last_val = symbols_list.val(); // save current selected symbol

    symbols_list.html('');

    // fill symbols list with new data
    $.each(data, (s, p) => symbols_list.append(`<option value="${s}" data-pairs="${p.join(',')}">${s}</option>`));

    symbols_list.val(last_val) // apply last selected symbol
        .trigger('change'); // go to pairs build operation

};

export { init, change };
