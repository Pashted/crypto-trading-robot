let accord;

let init = () => {

    accord = $('form .uk-accordion');

    accord.on({
        show() {
            $('html,body').animate({ scrollTop: accord.offset().top - 15 }, 'fast');
        }
    });

};

export { init };