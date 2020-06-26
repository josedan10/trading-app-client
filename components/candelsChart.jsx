import React from 'react'
import loadable from 'loadable-components'
import { Button, Box } from '@material-ui/core'
import Axios from 'axios'

const Chart = loadable(() => import('react-apexcharts'))

function formatter(value, timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${
    year < 10 ? `0${year}` : year
  } ${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }` // The formatter function overrides format property
}

export default class CandlesChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: {
        tooltip: {
          y: {
            format: 'dd/MM/yyyy HH:mm',
            formatter,
          },
        },
        xaxis: {
          labels: {
            format: 'dd/MM/yyyy HH:mm',
            formatter,
          },
        },
        yaxis: {
          tickAmount: 10,
          decimalsInFloat: 0,
        },
        chart: {
          id: 'test-candels',
        },
        plotOptions: {
          bar: {
            columnWidth: '30px',
          },
        },
      },
      series: [
        {
          data: [],
        },
      ],
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const obj = this

    Axios.get(
      `${
        // process.env.TEST_SERVER_URL ||
        'https://mysterious-brook-83261.herokuapp.com'
      }/api/chart`,
      {
        params: {
          limit: 40,
        },
      }
    )
      .then(({ data }) => {
        const dataArray = data.map((candle) => {
          const newCandle = []
          const open = candle[1]
          const high = candle[3]
          const low = candle[4]
          const close = candle[2]

          newCandle.push(candle[0])
          newCandle.push([open, high, low, close])

          return newCandle
        })

        obj.setState((prevState) => ({
          ...prevState,
          series: [
            {
              data: dataArray,
            },
          ],
        }))
      })
      .catch((err) => console.error(err))
  }

  render() {
    const { state } = this
    return (
      <Box>
        <Chart
          options={state.options}
          series={state.series}
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
