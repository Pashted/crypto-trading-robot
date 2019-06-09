import React, { PureComponent } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import * as HighchartsMore from 'highcharts/highcharts-more'

import { units, cases, buttons } from './_params'
import {
    chartOptions as ordersOptions,
    chartSeries as ordersSeries
} from './Order'

import processFibLevels from './Fibonacci'

HighchartsMore(Highcharts);

import AppContext from '../Context/AppContext';

const defaultOptions = { ...Highcharts.getOptions() };


class Chart extends PureComponent {

    static contextType = AppContext;

    componentWillMount() {
        console.log('## Chart componentWillMount', this.context);

        this.ResetOptions();

        Highcharts.setOptions(require(`./${this.context.theme}-theme.js`).default);
    }

    componentDidMount() {
        console.log('## Chart componentDidMount', this.state);

        Highcharts.charts.slice(-1)[0].reflow();
    }

    componentWillReceiveProps(nextProps) {
        console.log('## Chart componentWillReceiveProps',
            '\n _this.props', this.props,
            '\n _this.state', this.state,
            '\n _nextProps', nextProps
        );

        let options = {};

        if (this.props.timeframe !== nextProps.timeframe) {

            this.defaultState.rangeSelector.selected = cases[nextProps.timeframe];

            options.rangeSelector = {
                ...this.state.rangeSelector,
                selected: cases[nextProps.timeframe]
            };
        }

        if (this.props.title !== nextProps.title)
            options.title = { text: nextProps.title };

        if (this.props.data !== nextProps.data)
            options.series = [
                {
                    ...this.state.series[0],
                    data: nextProps.data.ohlc || []
                },
                {
                    ...this.state.series[1],
                    data: nextProps.data.dc || []
                },
                {
                    ...this.state.series[2],
                    data: nextProps.data.volume || []
                },

                ...ordersSeries,

                ...processFibLevels(nextProps.data.fib),
            ];

        if (options)
            this.setState(options);
    }

    componentDidUpdate() {
        console.log('## Chart componentDidUpdate', this.state);
    }


    /**
     * Reset charts options for switching themes
     * @constructor
     */
    ResetOptions = () => {
        let options = Highcharts.getOptions();

        for (let prop in options)
            if (options.hasOwnProperty(prop) && typeof options[prop] !== 'function')
                delete options[prop];


        Highcharts.setOptions(defaultOptions);
    };


    defaultState = {
        chart: { height: 800 },

        rangeSelector: {
            buttons,
            allButtonsEnabled: true,
            buttonTheme:       { width: 40 },
            selected:          cases[this.props.timeframe]
        },

        plotOptions: ordersOptions,

        title: { text: this.props.title },

        yAxis: [
            {
                labels:    { align: "right", x: -3 },
                title:     { text: "Price" },
                height:    "80%",
                lineWidth: 2,
                resize:    { enabled: true }
            },
            {
                labels:    { align: "right", x: -3 },
                title:     { text: "Volume" },
                top:       "82%",
                height:    "18%",
                offset:    0,
                lineWidth: 2
            }
        ],

        tooltip: { split: true },

        series: [
            {
                type:         "candlestick",
                name:         "Price",
                data:         this.props.data.ohlc,
                dataGrouping: { units },
                zIndex:       10
            },
            {
                type:         "arearange",
                name:         "DC",
                fillColor:    'rgba(0,157,255,0.05)',
                lineColor:    'rgba(0,157,255,0.65)',
                data:         this.props.data.dc,
                dataGrouping: { units },
            },
            {
                type:         "column",
                name:         "Volume",
                data:         this.props.data.volume,
                yAxis:        1,
                dataGrouping: { units }
            },

            ...ordersSeries,

            ...processFibLevels(this.props.data.fib)

        ]
    };


    state = this.defaultState;


    render() {
        return <div className='uk-margin'>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={this.state}
            />
        </div>
    }
}

export default Chart
