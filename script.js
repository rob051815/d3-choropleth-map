let countiesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countiesData;
let educationData;

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {

    function findCounty(countyData) {
        let county = educationData.find((item) => {
        return item['fips'] === countyData['id']
        })
        return county;
    }
    function colorCounty(county) {
        let percentage = county['bachelorsOrHigher'];
        if (percentage <= 12) {
            return 'var(--ind-1)'
        } else if (percentage <= 21) {
            return 'var(--ind-2)'
        } else if (percentage <= 30) {
            return 'var(--ind-3)'
        } else if (percentage <= 39) {
            return 'var(--ind-4)'
        } else if (percentage <= 48) {
            return 'var(--ind-5)'
        } else if(percentage <= 57) {
            return 'var(--ind-6)'
        } else {
            return 'var(--ind-7)'
        }
    }
    
    canvas.selectAll('path')
            .data(countiesData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyData) => {
                return colorCounty(findCounty(countyData))
            })
            .attr('data-fips', (countyData) => countyData['id'])
            .attr('data-education', (countyData) => {
                let county = findCounty(countyData);
                return county['bachelorsOrHigher'];
            })
            .on('mouseover', (event, countyData) => {
                tooltip
                    .transition()
                    .style('visibility', 'visible')
                    
                let county = findCounty(countyData);

                tooltip.attr('data-education', county['bachelorsOrHigher'])
                        .text(county['area_name'] + ', ' + county['state'] + ' | ' + county['bachelorsOrHigher'] + '%')
                        .style('left', event.pageX + 8 + 'px')
                        .style('top', event.pageY - 22 + 'px')
        })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .style('visibility', 'hidden')
            })
}

d3.json(countiesURL)
    .then((cData) => {
        //converts data received to geojson then save coordinates(features) array in countiesData variable 
        countiesData = topojson.feature(cData, cData.objects.counties).features
        
        d3.json(educationURL)
            .then((eData) => {
                educationData = eData;
                drawMap()
            }).catch(err => console.log(err));
    })
    .catch(err => console.log(err));