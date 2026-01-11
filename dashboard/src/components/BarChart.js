import * as d3 from 'd3';
import anime from 'animejs/lib/anime.es.js';

export function createBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<h3>Average Charges by Region & Gender</h3>';

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Data Processing: Group by Region -> Sex -> Mean(Charges)
    // We want an array like: [{region: 'NE', male: 12000, female: 13000}, ...]
    const regions = Array.from(new Set(data.map(d => d.region)));
    const subgroups = ['male', 'female'];

    const processedData = regions.map(region => {
        const regionData = data.filter(d => d.region === region);
        const maleAvg = d3.mean(regionData.filter(d => d.sex === 'male'), d => d.charges);
        const femaleAvg = d3.mean(regionData.filter(d => d.sex === 'female'), d => d.charges);
        return { region, male: maleAvg, female: femaleAvg };
    });

    // Scales
    const x0 = d3.scaleBand()
        .domain(regions)
        .rangeRound([0, width])
        .paddingInner(0.2);

    const x1 = d3.scaleBand()
        .domain(subgroups)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => Math.max(d.male, d.female))])
        .rangeRound([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#38bdf8', '#a78bfa']); // Blue (Male), Purple (Female)

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .attr('class', 'axis')
        .call(g => g.select(".domain").remove()); // Remove bottom line for cleaner look

    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d / 1000}k`))
        .attr('class', 'axis')
        .call(g => g.select(".domain").remove());

    // Bars
    const slice = svg.selectAll('.slice')
        .data(processedData)
        .enter().append('g')
        .attr('class', 'g')
        .attr('transform', d => `translate(${x0(d.region)},0)`);

    const bars = slice.selectAll('rect')
        .data(d => subgroups.map(key => ({ key, value: d[key] })))
        .enter().append('rect')
        .attr('x', d => x1(d.key))
        .attr('y', height) // Start at bottom for animation
        .attr('width', x1.bandwidth())
        .attr('height', 0) // Start with 0 height
        .attr('fill', d => color(d.key))
        .attr('rx', 4);

    // Animation
    anime({
        targets: bars.nodes(),
        y: d => y(d.value),
        height: d => height - y(d.value),
        delay: anime.stagger(100),
        easing: 'spring(1, 80, 10, 0)',
        duration: 1000
    });

    // Tooltip
    const tooltip = d3.select('body').selectAll('.tooltip-bar').data([0]).join('div')
        .attr('class', 'tooltip tooltip-bar')
        .style('opacity', 0);

    bars.on('mouseover', (event, d) => {
        d3.select(event.currentTarget).style('opacity', 0.8);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
      <strong>${d.key}</strong><br/>
      Avg Charge: $${d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
    `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
        .on('mouseout', (event) => {
            d3.select(event.currentTarget).style('opacity', 1);
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 100}, 0)`);

    subgroups.forEach((cat, i) => {
        const row = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
        row.append('rect').attr('width', 10).attr('height', 10).attr('fill', color(cat)).attr('rx', 2);
        row.append('text').attr('x', 20).attr('y', 9).text(cat.charAt(0).toUpperCase() + cat.slice(1)).style('font-size', '12px').attr('fill', '#cbd5e1');
    });
}
