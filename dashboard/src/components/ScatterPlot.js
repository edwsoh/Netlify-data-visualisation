import * as d3 from 'd3';
import anime from 'animejs/lib/anime.es.js';

export function createScatterPlot(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous
    container.innerHTML = '<h3>BMI vs. Medical Charges (Impact of Smoking)</h3>';

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.bmi))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.charges)])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(['yes', 'no'])
        .range(['#f472b6', '#38bdf8']); // Pink for smoker, Blue for non-smoker

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5))
        .attr('class', 'axis')
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', '#94a3b8')
        .style('text-anchor', 'middle')
        .text('BMI');

    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d / 1000}k`))
        .attr('class', 'axis')
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -45)
        .attr('x', -height / 2)
        .attr('fill', '#94a3b8')
        .style('text-anchor', 'middle')
        .text('Charges');

    // Tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Points
    const circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.bmi))
        .attr('cy', d => y(d.charges))
        .attr('r', 0) // Start at 0 for animation
        .style('fill', d => color(d.smoker))
        .style('opacity', 0.6)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget).transition().duration(200).attr('r', 8).style('opacity', 1);
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`
        <strong>Age:</strong> ${d.age}<br/>
        <strong>BMI:</strong> ${d.bmi.toFixed(1)}<br/>
        <strong>Charges:</strong> $${d.charges.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br/>
        <strong>Smoker:</strong> ${d.smoker}
      `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', (event) => {
            d3.select(event.currentTarget).transition().duration(200).attr('r', 5).style('opacity', 0.6);
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Anime.js Animation
    // We need to target the DOM nodes. 
    // D3 selections are iterable.
    anime({
        targets: circles.nodes(),
        r: [0, 5],
        opacity: [0, 0.6],
        delay: anime.stagger(2, { start: 500 }), // stagger delay
        easing: 'easeOutElastic(1, .8)',
        duration: 1500
    });

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 100}, 20)`);

    const categories = ['Smoker', 'Non-Smoker'];
    categories.forEach((cat, i) => {
        const row = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
        row.append('circle')
            .attr('r', 5)
            .attr('fill', color(cat === 'Smoker' ? 'yes' : 'no'));
        row.append('text')
            .attr('x', 15)
            .attr('y', 4)
            .text(cat)
            .style('font-size', '12px')
            .attr('fill', '#cbd5e1');
    });
}
