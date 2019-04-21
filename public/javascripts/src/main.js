require('chosenjs');
require('uikit-icons');


(function ($) {
    $(document).ready(function () {
        console.log('>> RUN_ main.js');


        $('select').chosen({
            disable_search_threshold: 12
        });


    let is_popstate = false,
        switcher = $('section .uk-switcher > div');

        switcher.on({
            show: function () {
                if (!is_popstate)
                    history.pushState(null, null, "?tab=" + (switcher.index($(this)) + 1));

                is_popstate = false;
            }
        });

        // TODO: if no tab has performed, but popstate has fired, go on 1st tab, if it possible

        let tabs = $('aside .uk-open .uk-tab');

        window.onpopstate = function () {
            is_popstate = true;

            let tab = window.location.search.replace(/^.*?tab=(\d).*$/, '$1');

            if (tab > 0)
                UIkit.tab(tabs).show(tab - 1);

        };

    });
})(jQuery);