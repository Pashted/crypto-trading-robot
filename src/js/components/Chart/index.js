import React, { PureComponent } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import AppContext from '../Context/AppContext';

import { mergeDeep } from '../../helpers'

// groupingUnits
const units = [
        [
            'minute',
            [ 1, 5, 15, 30 ]
        ], [
            'hour',
            [ 1, 3, 6, 12 ]
        ], [
            'day',
            [ 1 ]
        ], [
            'week',
            [ 1, 2 ]
        ], [
            'month',
            [ 1 ]
        ]
    ],

    // preselect zoom values for each timeframe
    cases = {
        "1m":  9,
        "5m":  8,
        "15m": 7,
        "30m": 6,
        "1h":  5,
        "3h":  4,
        "6h":  4,
        "12h": 3,
        "1D":  2,
        "7D":  1,
        "14D": 0,
        "1M":  0,
    };


class Chart extends PureComponent {

    static contextType = AppContext;

    componentWillMount() {
        console.log('## Chart componentWillMount', this.context);

        this.setState(
            mergeDeep(
                require(`./${this.context.theme}-theme.js`).default,
                this.state
            )
        );
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

        let state = {};

        if (this.props.timeframe !== nextProps.timeframe) {
            this.defaultState.rangeSelector.selected = cases[nextProps.timeframe];
            state.rangeSelector = {
                ...this.state.rangeSelector,
                selected: cases[nextProps.timeframe]
            };
        }

        if (this.props.title !== nextProps.title)
            state.title = { text: nextProps.title };

        if (this.props.ohlc !== nextProps.ohlc)
            state.series = [
                {
                    ...this.state.series[0],
                    data: nextProps.ohlc
                },
                {
                    ...this.state.series[1],
                    data: nextProps.volume
                }
            ];

        if (state)
            this.setState(state);
    }

    componentDidUpdate() {
        console.log('## Chart componentDidUpdate', this.state);
    }


    defaultState = {
        chart:         {
            height: 800
        },
        rangeSelector: {
            allButtonsEnabled: true,
            buttons:           [
                {
                    type: 'all',
                    text: 'All'
                }, {
                    type:  'year',
                    count: 3,
                    text:  '3Y'
                }, {
                    type:  'year',
                    count: 1,
                    text:  '1Y'
                }, {
                    type:  'month',
                    count: 3,
                    text:  '3M'
                }, {
                    type:  'month',
                    count: 1,
                    text:  '1M'
                }, {
                    type:  'day',
                    count: 7,
                    text:  '7D'
                }, {
                    type:  'day',
                    count: 3,
                    text:  '3D'
                }, {
                    type:  'day',
                    count: 1,
                    text:  '1D'
                }, {
                    type:  'hour',
                    count: 6,
                    text:  '6h'
                }, {
                    type:  'hour',
                    count: 1,
                    text:  '1h'
                },
            ],

            buttonTheme: {
                width: 40
            },

            selected: cases[this.props.timeframe]
        },

        title: {
            text: this.props.title
        },

        yAxis: [
            {
                labels:    {
                    align: "right",
                    x:     -3
                },
                title:     {
                    text: "OHLC"
                },
                height:    "80%",
                lineWidth: 2,
                resize:    {
                    enabled: true
                }
            },
            {
                labels:    {
                    align: "right",
                    x:     -3
                },
                title:     {
                    text: "Volume"
                },
                top:       "82%",
                height:    "18%",
                offset:    0,
                lineWidth: 2
            }
        ],

        tooltip: {
            split: true
        },

        series: [
            {
                type:         "candlestick",
                name:         "Price",
                data:         this.props.ohlc,
                dataGrouping: { units }
            },
            {
                type:         "column",
                name:         "Volume",
                data:         this.props.volume,
                yAxis:        1,
                dataGrouping: { units }
            }
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
