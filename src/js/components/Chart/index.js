import React, { PureComponent } from 'react'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

import AppContext from '../Context/AppContext';

import { mergeDeep } from '../../helpers'

let groupingUnits = [
    /*[
        'millisecond', // unit name
        [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
    ], [
        'second', // 1
        [1, 2, 5, 10, 15, 30]
    ], */[
        'minute',
        [1, 5, 15, 30]
    ], [
        'hour',
        [1, 3, 6, 12]
    ], [
        'day',
        [1]
    ], [
        'week',
        [1]
    ], /*[
        'month',
        [1, 3, 6]
    ], [
        'year',
        null
    ]*/
];


class Chart extends PureComponent {

    static contextType = AppContext;

    componentWillMount() {
        console.log('## Chart componentWillMount', this.context);

        this.setState(
            mergeDeep(
                require(`./${this.context.theme}-theme.js`).default,
                this.defaultState
            )
        );
    }

    componentDidMount() {
        console.log('## Chart componentDidMount', this.state);

        Highcharts.charts.pop().reflow();
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log('## Chart componentWillReceiveProps',
            '\n _this.props', this.props,
            '\n _this.state', this.state,
            '\n _nextProps', nextProps,
            '\n _nextState', nextState
        );

        let state = {};

        if (this.props.title !== nextProps.title)
            state.title = { text: nextProps.title };

        if (this.props.ohlc !== nextProps.ohlc)
            state.series = [
                {
                    ...this.defaultState.series[0],
                    data: nextProps.ohlc
                },
                {
                    ...this.defaultState.series[1],
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
                    type:         'all',
                    text:         'All/1M',
                    dataGrouping: {
                        forced: true,
                        units:  [['month', [1, 3, 6]]]
                    }
                }, {
                    type:         'year',
                    count:        3,
                    text:         '3Y/7D',
                    dataGrouping: {
                        forced: true,
                        units:  [['week', [1]]]
                    }
                }, {
                    type:         'year',
                    count:        1,
                    text:         '1Y/1D',
                    dataGrouping: {
                        forced: true,
                        units:  [['day', [1]]]
                    }
                }, {
                    type:         'month',
                    count:        3,
                    text:         '3M/12h',
                    dataGrouping: {
                        forced: true,
                        units:  [['hour', [12]]]
                    }
                }, {
                    type:         'month',
                    count:        1,
                    text:         '1M/6h',
                    dataGrouping: {
                        forced: true,
                        units:  [['hour', [6]]]
                    }
                }, {
                    type:         'day',
                    count:        7,
                    text:         '7D/1h',
                    dataGrouping: {
                        forced: true,
                        units:  [['hour', [1]]]
                    }
                }, {
                    type:         'day',
                    count:        3,
                    text:         '3D/30m',
                    dataGrouping: {
                        forced: true,
                        units:  [['minute', [30]]]
                    }
                }, {
                    type:         'day',
                    count:        1,
                    text:         '1D/15m',
                    dataGrouping: {
                        forced: true,
                        units:  [['minute', [15]]]
                    }
                }, {
                    type:         'hour',
                    count:        12,
                    text:         '6h/5m',
                    dataGrouping: {
                        forced: true,
                        units:  [['minute', [5]]]
                    }
                },
                {
                    type:         'hour',
                    count:        2,
                    text:         '1h/1m',
                    dataGrouping: {
                        forced: true,
                        units:  [['minute', [1]]]
                    }
                },
            ],

            buttonTheme: {
                width: 60
            },

            selected: 0
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
                height:    "60%",
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
                top:       "65%",
                height:    "35%",
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
                dataGrouping: {
                    units: groupingUnits
                }
            },
            {
                type:         "column",
                name:         "Volume",
                data:         this.props.volume,
                yAxis:        1,
                dataGrouping: {
                    units: groupingUnits
                }
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
