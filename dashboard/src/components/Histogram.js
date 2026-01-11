import * as d3 from 'd3';
import anime from 'animejs/lib/anime.es.js';

export function createHistogram(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<h3>Distribution of Medical Charges</h3>';

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.charges)])
        .range([0, width]);

    // Histogram bins
    const histogram = d3.bin()
        .value(d => d.charges)
        .domain(x.domain())
        .thresholds(x.ticks(40)); // ~40 bins

    const bins = histogram(data);

    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .range([height, 0]);

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d => `$${d / 1000}k`))
        .attr('class', 'axis');

    svg.append('g')
        .call(d3.axisLeft(y).ticks(5))
        .attr('class', 'axis');

    // Bars
    const bars = svg.selectAll('rect')
        .data(bins)
        .enter()
        .append('rect')
        .attr('x', 1)
        .attr('transform', d => `translate(${x(d.x0)}, ${height})`) // Start at bottom
        .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr('height', 0)
        .style('fill', '#f472b6')
        .attr('rx', 2);

    // Animation
    anime({
        targets: bars.nodes(),
        y: d => y(d.length) - height, // Relative translation
        height: d => height - y(d.length),
        delay: anime.stagger(20),
        easing: 'easeOutQuad',
        duration: 800,
        update: function (anim) {
            // Since we used transform translate for X and Y in D3, 
            // AnimeJS modifying 'y' or 'height' attributes might conflict if not careful.
            // However, D3 rects use 'y' attribute usually, but here I used transform for X. 
            // Let's adjust D3 setup to be more Anime-friendly or use attr updating.
        }
    });

    // Re-do animation in a cleaner way without conflict:
    // Set initial state in D3
    bars.attr('transform', d => `translate(${x(d.x0)}, ${y(d.length)})`)
        .attr('y', d => height - y(d.length)) // Push down initially? No, SVG coords.
        .attr('height', 0)
        .attr('y', d => 0); // Start from top of bar? No.

    // Let's reset and do it simply.
    // Standard SVG rect: x, y (top-left), width, height.
    bars
        .attr('transform', null)
        .attr('x', d => x(d.x0) + 1)
        .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr('y', height)
        .attr('height', 0);

    anime({
        targets: bars.nodes(),
        y: d => y(d.length),
        height: d => height - y(d.length),
        delay: anime.stagger(15),
        easing: 'spring(1, 80, 10, 0)',
        duration: 1000
    });

    // Tooltip
    const tooltip = d3.select('body').selectAll('.tooltip-hist').data([0]).join('div')
        .attr('class', 'tooltip tooltip-hist')
        .style('opacity', 0);

    bars.on('mouseover', (event, d) => {
        d3.select(event.currentTarget).style('fill', '#a78bfa');
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
      <strong>Range:</strong> $${Math.round(d.x0 / 1000)}k - $${Math.round(d.x1 / 1000)}k<br/>
      <strong>Count:</strong> ${d.length}
    `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
    })
        .on('mouseout', (event) => {
            d3.select(event.currentTarget).style('fill', '#f472b6');
            tooltip.transition().duration(500).style('opacity', 0);
        });
}
