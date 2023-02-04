import { h } from 'preact'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import * as d3 from 'd3'
import dayjs from 'dayjs'

import styles from './line-chart.scss'

const margins = {
  top: 8,
  right: 24,
  bottom: 42,
  left: 16,
}

const LineChart = ({ data, dateFormat }) => {
  const containerRef = useRef(null)
  const chartCanvasRef = useRef(null)
  const [range, setRange] = useState([])
  const [containerWidth, setContainerWidth] = useState(null)

  const drawLine = () => {
    const { width, height } = containerRef.current.getBoundingClientRect()

    const innerWidth = width - margins.left - margins.right
    const innerHeight = height - margins.top - margins.bottom

    const root = d3
      .select(chartCanvasRef.current)
      .attr('width', width)
      .attr('height', height)

    root.selectAll('*').remove()
    const svg = root
      .append('g')
      .attr('transform', `translate(${margins.left}, ${margins.top})`)
    const x = d3.scaleTime().range([0, innerWidth])
    const y = d3.scaleLinear().range([innerHeight, 0])

    const yMin = d3.min(data, (d) => d.y)
    const yMax = d3.max(data, (d) => d.y)
    x.domain([d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)])
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
          .tickFormat((d) => dayjs(d).format(dateFormat || 'DD/MM')),
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

    //  THE LINE
    svg
      .append('path')
      .data([data])
      .attr('class', styles.line)
      .attr('d', valueLine)
      .attr('transform', `translate(${margins.left}, 0)`)

    const tooltip = d3
      .select(containerRef.current)
      .append('div')
      .attr('id', 'bar-tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('padding', '4px')
      .style('background', 'rgba(0,0,0,0.6)')
      .style('border-radius', '4px')
      .style('color', '#fff')
      .on('click', () => {
        tooltip.style('visibility', 'hidden')
      })

    // Dots
    const dotGroup = svg.append('g')
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
        tooltip
          .html(`<div>${d.y ? d.y.toFixed(2) : null}</div>`)
          .style('visibility', 'visible')
          .style('top', `${y(d.y) - margins.top - 20}px`)
          .style('left', `${x(d.x)}px`)
      })
    dotGroup
      .selectAll('innerDots')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.x))
      .attr('cy', (d) => y(d.y))
      .attr('r', 2)
      .attr('transform', `translate(${margins.left}, 0)`)
      .on('click', (e, d) => {
        tooltip
          .html(`<div>${d.y ? d.y.toFixed(2) : null}</div>`)
          .style('visibility', 'visible')
          .style('top', `${y(d.y) - margins.top - 20}px`)
          .style('left', `${x(d.x)}px`)
      })

    setRange([yMin, yMax])
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
  }, [containerWidth])

  return (
    <div class={styles.lineChart}>
      {range?.length ? (
        <p class="text-center">
          min: {range[0]?.toFixed(2)} - max: {range[1]?.toFixed(2)}
        </p>
      ) : null}
      <div ref={containerRef} class="relative">
        <svg
          ref={chartCanvasRef}
          width={containerWidth}
          height={containerWidth * 0.6}
        />
      </div>
    </div>
  )
}

export default LineChart
