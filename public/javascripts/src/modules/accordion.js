let accord;

let init = () => {

    accord = $('form .uk-accordion');

    accord.on({
        show() {
            $('html,body').animate({ scrollTop: accord.offset().top - 15 }, 'fast');
        }
    });

};

let show = elem => {
    accord.removeClass('uk-hidden');

    if (elem !== undefined && !accord.find('li').eq(elem).hasClass('uk-open'))
        UIkit.accordion(accord).toggle(elem);
};


let fill = data => {
    let html = JSON.stringify(data, null, 4);
    accord.find('.uk-accordion-content').html(`<pre>${html}</pre>`)
};

export { init, show, fill };