/**
 * Fires UIKit notifications
 * @param text
 * @param icon
 * @param style
 * @param time
 * @param place
 */
let show = (text, icon, style, time, place) => {

        let i = icon || $('aside .uk-active [uk-icon]').attr('uk-icon');

        UIkit.notification({
            message: `<span uk-icon='${i}'></span> ${text}`,
            status:  style || 'primary',
            timeout: time || 2500,
            pos:     place || 'bottom-right',
        });
    },

    Message = text => show(text),
    Warning = text => show(text, 'info', 'warning', 6000),
    Error = text => show(text, 'warning', 'danger', 60000);


export { Message, Warning, Error };