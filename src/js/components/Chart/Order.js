import Highcharts from 'highcharts/highstock'
import { Notify } from '../uikit'

export const

    chartOptions = {
        scatter: {
            marker:  {
                radius: 7,
                states: {
                    hover: {
                        enabled:   true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states:  {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat:  '{point.x:%Y-%m-%d %H:%M}, {point.y}'
            }
        }
    },

    chartSeries = [
        {
            // 3
            type:   "scatter",
            name:   "Active sell order",
            color:  'rgba(235,76,92, .2)',
            data:   [],
            zIndex: 100
        },
        {
            // 4
            type:   "scatter",
            name:   "Executed sell order",
            color:  'rgba(235,76,92, 1)',
            data:   [],
            zIndex: 100
        },
        {
            // 5
            type:   "scatter",
            name:   "Active buy order",
            color:  'rgba(83,185,134, .2)',
            data:   [],
            zIndex: 100
        },
        {
            // 6
            type:   "scatter",
            name:   "Executed buy order",
            color:  'rgba(83,185,134, 1)',
            data:   [],
            zIndex: 100
        }
    ],


    sell = {
        add:  ({ order }) => Highcharts.charts.slice(-1)[0].series[3].addPoint(order),

        exec: ({ order, data }) => {
            Notify.sell(data);

            Highcharts.charts.slice(-1)[0].series[4].addPoint(order);
        },

        edit: ({ order }) => {
            const { series } = Highcharts.charts.slice(-1)[0];

            series[3].removePoint(order, false);
            series[3].addPoint(order);
        }
    },

    buy = {
        add:  ({ order }) => Highcharts.charts.slice(-1)[0].series[5].addPoint(order),

        exec: ({ order, data }) => {
            Notify.buy(data);

            Highcharts.charts.slice(-1)[0].series[6].addPoint(order)
        },

        edit: ({ order }) => {
            const { series } = Highcharts.charts.slice(-1)[0];

            series[5].removePoint(order, false);
            series[5].addPoint(order);
        }
    },

    goToStart = () => {
        const [ xAxis ] = Highcharts.charts.slice(-1)[0].xAxis,
            { dataMin, min, max } = xAxis.getExtremes();


        xAxis.setExtremes(dataMin, dataMin + (max - min));
    },

    showNext = ts => {
        const [ xAxis ] = Highcharts.charts.slice(-1)[0].xAxis,
            { min, max } = xAxis.getExtremes();

        if (ts > max)
            xAxis.setExtremes(max, max + (max - min));

    },

    clear = () => {
        goToStart();

        const { series } = Highcharts.charts.slice(-1)[0];

        series[3].setData([], false);
        series[4].setData([], false);
        series[5].setData([], false);
        series[6].setData([], false);

    };