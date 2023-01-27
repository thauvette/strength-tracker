import dayjs from 'dayjs'
import { h } from 'preact'
import LineChart from '../../components/Charts/LineCharts/LineChart'

const Charts = ({ days }) => {
  return (
    <div>
      <h2>Charts</h2>
      <LineChart
        dateFormat="DD/MMM"
        data={days.map((day) => ({
          x: dayjs(day.dayKey).toDate().getTime(),
          y: day.average,
        }))}
      />
    </div>
  )
}

export default Charts
