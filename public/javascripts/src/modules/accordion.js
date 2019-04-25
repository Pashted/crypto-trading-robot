let init = () => {

    let accord = $('form .uk-accordion');

    accord.on({
        show() {
            setTimeout(() => {
                $('html,body').animate({ scrollTop: accord.offset().top - 15 }, 'fast');
            });
        }
    });

};

export { init };