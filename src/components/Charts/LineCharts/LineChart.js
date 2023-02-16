import { h } from 'preact'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import * as d3 from 'd3'
import dayjs from 'dayjs'

import styles from './line-chart.scss'
import { formatToFixed } from '../../../utilities.js/formatNumbers'

import useTheme from '../../../context/theme'

const margins = {
  top: 8,
  right: 24,
  bottom: 42,
  left: 16,
}

const LineChart = ({ data, dateFormat, renderTooltip }) => {
  const { theme } = useTheme()

  const containerRef = useRef(null)
  const chartCanvasRef = useRef(null)
  const [range, setRange] = useState([])
  const [mean, setMean] = useState(null)
  const [bookends, setBookends] = useState([])
  const [containerWidth, setContainerWidth] = useState(null)
  const tooltipRef = useRef(null)

  const [selectedData, setSelectedData] = useState(null)

  const drawLine = () => {
    const { width, height } = containerRef.current.getBoundingClientRect()

    const innerWidth = width - margins.left - margins.right
    const innerHeight = height - margins.top - margins.bottom

    const root = d3
      .select(chartCanvasRef.current)
      .attr('width', width)
      .attr('height', height)

    root.selectAll('*').remove()
    setSelectedData(null)
    const svg = root
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
    const x = d3.scaleTime().range([0, innerWidth])
    const y = d3.scaleLinear().range([innerHeight, 0])

    const yMin = d3.min(data, (d) => d.y)
    const yMax = d3.max(data, (d) => d.y)
    const xMin = d3.min(data, (d) => d.x)
    const xMax = d3.max(data, (d) => d.x)
    x.domain([xMin, xMax])
    y.domain([yMin - yMin * 0.05, yMax + yMax * 0.05])

    const valueLine = d3
      .line()
      .x((d) => {
        return x(d.x)
      })
      .y((d) => {
        return y(d.y)
      })

    // Add the X Axis
    svg
      .append('g')
      .attr('transform', `translate(${margins.left},${innerHeight})`)
      .attr('class', `${styles.axis} ${styles.xAxis}`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat((d) => dayjs(d).format(dateFormat || 'DD/MM'))
          .ticks(data?.length < 10 ? data?.length : 10),
      )
      .selectAll('text')
      .attr('y', 0)
      .attr('x', -margins.bottom)
      .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'start')

    // Add the Y Axis
    svg
      .append('g')
      .attr('class', `${styles.axis}`)
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => d)
          .ticks(10)
          .tickSize(-innerWidth),
      )
      .attr('transform', `translate(${margins.left}, 0)`)
      .append('text')
      .attr('class', styles.text)
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${16}, 0)`)
      .text('value')

    // THE MEAN
    const average = d3.mean(data, (d) => d.y)
    svg
      .append('line')
      .attr('class', styles.meanLine)
      .attr('x1', 0)
      .attr('y1', y(average)) // y position of the first end of the line
      .attr('x2', innerWidth)
      .attr('y2', y(average))
      .attr('transform', `translate(${margins.left}, 0)`)
      .style('stroke-dasharray', '3, 3')

    const firstEntry = data.find((entry) => entry.x === xMin)
    const lastEntry = data.find((entry) => entry.x === xMax)

    if (firstEntry?.y && lastEntry?.y) {
      svg
        .append('line')
        .attr('class', styles.timeLine)
        .attr('x1', x(xMin))
        .attr('x2', x(xMax))
        .attr('y1', y(firstEntry?.y))
        .attr('y2', y(lastEntry?.y))
        .attr('transform', `translate(${margins.left}, 0)`)
        .style('stroke-dasharray', '3, 3')

      setBookends([firstEntry?.y, lastEntry?.y])
    } else {
      setBookends([])
    }

    //  THE LINE
    svg
      .append('path')
      .data([data])
      .attr('class', styles.line)
      .attr('d', valueLine)
      .attr('transform', `translate(${margins.left}, 0)`)

    // Dots
    const dotGroup = svg.append('g')

    dotGroup
      .selectAll('innerDots')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('fill', theme === 'dark' ? '#fff' : '#000')
      .attr('r', 2)
      .attr('transform', `translate(${margins.left}, 0)`)

    dotGroup
      .selectAll('dots')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 6)
      .attr('fill', 'transparent')
      .attr('transform', `translate(${margins.left}, 0)`)
      .on('click', (e, d) => {
        setSelectedData(d)
        tooltipRef.current.style.top = `${y(d.y) - margins.top - 20}px`
        tooltipRef.current.style.left = `${x(d.x)}px`
      })
    setRange([yMin, yMax])
    setMean(average)
  }

  useLayoutEffect(() => {
    if (!containerWidth) {
      const wrapper = containerRef?.current
      const initialWidth = wrapper?.getBoundingClientRect()?.width || 400
      setContainerWidth(initialWidth)
    } else {
      drawLine()
    }

    function checkWidth() {
      const wrapper = containerRef?.current
      const newWidth = wrapper?.getBoundingClientRect()?.width || 400
      if (newWidth !== containerWidth) {
        setContainerWidth(newWidth)
      }
    }

    window.addEventListener('resize', checkWidth)

    return () => window.removeEventListener('resize', checkWidth)
  }, [containerWidth, theme])

  return (
    <div
      class={`${styles.lineChart} ${theme === 'dark' ? styles.darkChart : ''}`}
    >
      <div ref={containerRef} class="relative">
        <svg
          ref={chartCanvasRef}
          width={containerWidth}
          height={containerWidth * 0.6}
        />
        <div
          onClick={() => {
            setSelectedData(null)
          }}
          ref={tooltipRef}
          class={`absolute bg-black bg-opacity-50 p-2
            transform -translate-y-1/2 rounded-md
          ${selectedData ? '' : 'hidden'}`}
        >
          {selectedData && (
            <>
              {renderTooltip ? (
                renderTooltip(selectedData)
              ) : (
                <>
                  <p class="text-white text-center">
                    {formatToFixed(selectedData?.y)}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div class="py-4">
        {bookends?.length ? (
          <p class="text-center text-highlight-400">
            {formatToFixed(bookends[0])} to {formatToFixed(bookends[1])}
          </p>
        ) : null}
        {range?.length ? (
          <p class="text-center">
            min: {formatToFixed(range[0])} - max: {formatToFixed(range[1])}
          </p>
        ) : null}
        <p class="text-center text-blue-400 dark:text-blue-100">
          Average {formatToFixed(mean)}
        </p>
      </div>
    </div>
  )
}

export default LineChart
