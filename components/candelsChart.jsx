import React from 'react'
import loadable from 'loadable-components'
import { Button, Box } from '@material-ui/core'
import Axios from 'axios'

const Chart = loadable(() => import('react-apexcharts'))

export default class CandlesChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: {
        chart: {
          id: 'test-candels',
        },
        plotOptions: {
          bar: {
            columnWidth: '10px',
          },
        },
      },
      series: [{
        data: [],
      }],
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  async fetchData() {
    let { data } = await Axios.get((process.env.APP_ENV === 'debug' ? process.env.TEST_SERVER_URL : process.env.SERVER_URL), {
      params: {
      },
    })

    console.log(data)

    data = data.map((candle) => {
      const high = candle[3]
      const close = candle[2]

      candle[3] = candle[4]
      candle[4] = close
      candle[2] = high
      candle.pop()

      return candle
    })

    this.setState((prevState) => ({
      ...prevState,
      series: [{
        data,
      }],
    }))
  }

  render() {
    return (
      <Box>
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="candlestick"
          width="1100"
        />
        <Button variant="contained" color="primary" onClick={this.fetchData}>
          Update
        </Button>
      </Box>
    )
  }
}
