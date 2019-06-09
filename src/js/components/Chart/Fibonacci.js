import { units } from './_params'

// fibonacci levels params
const labels = [ '+4.236', '+2.618', '+1.618', '-1.618', '-2.618', '-4.236' ],
    colors = i => [ `rgba(235,76,92,0.${(i % 5) + 2})`, `rgba(83,185,134,0.${7 - (i % 6)})` ][i < 3 ? 0 : 1],

    processFibLevels = data => data.reduce((lines, candle) => {
        const [ ts, ...levels ] = candle;

        levels.forEach((level, i) => {
            const data = [ ts, level ];

            if (!lines[i]) {
                lines[i] = {
                    name:         labels[i],
                    data:         [ data ],
                    dataGrouping: { units },
                    lineColor:    colors(i),
                    zIndex:       -1
                };
            } else {
                lines[i].data.push(data);
            }
        });

        return lines;
    }, []);

export default processFibLevels