/**
 * Fires UIKit notifications
 * @param text
 * @param icon
 * @param style
 * @param time
 * @param place
 */
let show = (text, style, icon, time, place) => {

        let i = icon || $('aside .uk-active [uk-icon]').attr('uk-icon');

        UIkit.notification({
            message: `<span uk-icon='${i}'></span> ${text}`,
            status:  style || 'primary',
            timeout: time || 3000,
            pos:     place || 'bottom-right',
        });
    },

    Message = text => show(text, 'success'),
    Warning = text => show(text, 'warning', 'info', 6000),
    Error = text => show(text, 'danger', 'warning', 60000),
    Buy = order => show(`Buy ${order.pair}<br>P: ${order.price}, V: ${order.volume}`, 'success', 'bolt', null, 'bottom-left'),
    Sell = order => show(`Sell ${order.pair}<br>P: ${order.price}, V: ${order.volume}`, 'danger', 'bolt', null, 'bottom-left');


export { Message, Warning, Error, Buy, Sell };