const ctx = {
}

let map, imageOverlay
const polygons = {}

function convertRelativeToAbsolute(relativeCoords){
    return relativeCoords.map(coords => [
        coords[0] * ctx.MAP_H,
        coords[1] * ctx.MAP_W
    ]);
}


function computeMapDimensions(){
    const screenWidth = window.innerWidth * 0.6;
    const aspectRatio = 919/560;

    ctx.MAP_H = screenWidth / aspectRatio;
    ctx.MAP_W = screenWidth;
}

function setPolygons(){
    const areaSeaRelative = [
        [0.17, 0.6],
        [0.015, 0.6],
        [0.015, 0.87],
        [0.3, 0.87],
        [0.3, 0.87],
        [0.27, 0.82],
        [0.25, 0.8],
        [0.18, 0.8],
        [0.17, 0.79],
        [0.18, 0.66],
        [0.23, 0.63],
        [0.22, 0.61]
    ]

    const areaLakeRelative = [
        [0.835, 0.71],
        [0.79, 0.71],
        [0.75, 0.698],
        [0.748, 0.694],
        [0.726, 0.694],
        [0.71, 0.705],
        [0.69, 0.705],
        [0.69, 0.7],
        [0.68, 0.692],
        [0.655, 0.692],
        [0.6, 0.7],
        [0.58, 0.696],
        [0.555, 0.682],
        [0.555, 0.696],
        [0.59, 0.71],
        [0.665, 0.71],
        [0.68, 0.745],
        [0.716, 0.75],
        [0.748, 0.74],
        [0.76, 0.745],
        [0.767, 0.745],
        [0.777, 0.723],
        [0.777, 0.72]

    ]

    const areaTownRiverRelative = [
        [0.54, 0.69],
        [0.54, 0.675],
        [0.525, 0.675],
        [0.51, 0.683],
        [0.435, 0.683],
        [0.405, 0.673],
        [0.398, 0.673],
        [0.38, 0.685],
        [0.35, 0.685],
        [0.32, 0.65],
        [0.32, 0.6],
        [0.35, 0.56],
        [0.355, 0.56],
        [0.355, 0.525],
        [0.348, 0.51],
        [0.348, 0.47],
        [0.35, 0.47],
        [0.35, 0.42],
        [0.32, 0.42],
        [0.29, 0.44],
        [0.29, 0.49],
        [0.3, 0.52],
        [0.3, 0.6],
        [0.31, 0.61],
        [0.31, 0.68],
        [0.27, 0.702],
        [0.27, 0.712],
        [0.29, 0.708],
        [0.295, 0.708],
        [0.31, 0.7],
        [0.32, 0.685],
        [0.335, 0.685],
        [0.35, 0.692],
        [0.38, 0.692],
        [0.4, 0.683],
        [0.41, 0.683],
        [0.44, 0.69],
        [0.47, 0.695],
        [0.51, 0.695]

    ]
    const areaForestRiverRelative = [
        [0.33, 0.36],
        [0.32, 0.32],
        [0.255, 0.276],
        [0.22, 0.273],
        [0.2, 0.27],
        [0.2, 0.255],
        [0.23, 0.24],
        [0.24, 0.24],
        [0.26, 0.245],
        [0.265, 0.265],
        [0.28, 0.275],
        [0.28, 0.28],
        [0.345, 0.325],
        [0.355, 0.325],
        [0.355, 0.37],
        [0.367, 0.37],
        [0.367, 0.41],
        [0.353, 0.41],
        [0.353, 0.38],
    ]

    const areaSewersRelative = [
    ]
    const areaPondRelative = [
        [0.41, 0.233],
        [0.387, 0.233],
        [0.365, 0.245],
        [0.36, 0.255],
        [0.36, 0.275],
        [0.365, 0.285],
        [0.375, 0.29],
        [0.4, 0.29],
        [0.42, 0.27],
        [0.427, 0.25],
    ]

    const areas = {
        areaSea: areaSeaRelative,
        areaLake: areaLakeRelative,
        areaTownRiver: areaTownRiverRelative,
        areaForestRiver: areaForestRiverRelative,
        areaSewers: areaSewersRelative,
        areaPond: areaPondRelative
    };

    // Remove existing polygons if they exist
    Object.keys(polygons).forEach(key => {
        if(polygons[key]){
            map.removeLayer(polygons[key]);
        }
    });

    
    // Add new polygons
    let selectedLocations = [];
    let hoveredLocation = null;
    Object.keys(areas).forEach(key => {
        const absoluteCoords = convertRelativeToAbsolute(areas[key]);
        polygons[key] = L.polygon(absoluteCoords, {
            color: 'white',
            fillColor: 'white',
            weight: 2,
            fillOpacity: 0.2
        });

        let locationKey;
        if(key === "areaSea") locationKey = "Ocean";
        else if(key === "areaLake") locationKey = "Mountain_Lake";
        else if(key === "areaTownRiver") locationKey = "River_Town";
        else if(key === "areaForestRiver") locationKey = "River_Forest";
        else if(key === "areaPond") locationKey = "Forest_Pond";

        polygons[key].locationKey = locationKey;

        polygons[key].on('mouseover', function(e){
            hoveredLocation = this.locationKey;
            this.setStyle({
                fillOpacity: 0.7
            })
            const allLocations = selectedLocations.concat(hoveredLocation);
            filterFishListByArea(allLocations);
        });

        polygons[key].on('mouseout', function(e){
            this.setStyle({
                fillOpacity: selectedLocations.includes(this.locationKey) ? 0.7 : 0.2
            })
            hoveredLocation = null;
            // Update the fish list based on selected areas
            if(selectedLocations.length > 0){
                filterFishListByArea(selectedLocations);
            } else {
                resetFishList();
            }
        });

        polygons[key].on('click', function(e){
            const index = selectedLocations.indexOf(this.locationKey);
            if(index > -1){
                // Area is already selected, deselect it
                selectedLocations.splice(index, 1);
                this.setStyle({
                    fillOpacity: 0.2
                });
            } else {
                // Area is not selected, select it
                selectedLocations.push(this.locationKey);
                this.setStyle({
                    fillOpacity: 0.7
                });
            }

            // Update the fish list based on selected areas
            if(selectedLocations.length > 0){
                filterFishListByArea(selectedLocations);
            } else {
                resetFishList();
            }
        });

        polygons[key].addTo(map);
    });

}

function mapInit(){
    // Compute map dimensions
    computeMapDimensions();
    const mapContainer = document.getElementById('map');
    mapContainer.style.width = `${ctx.MAP_W}px`;
    mapContainer.style.height = `${ctx.MAP_H}px`;

    // Init map
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: 0,
        maxZoom:2,
        maxBounds: [[0,0], [ctx.MAP_H, ctx.MAP_W]],
        maxBoundsViscosity: 1.0,
    });

    // Load game map
    const bounds = [[0, 0], [ctx.MAP_H,ctx.MAP_W]];
    imageOverlay = L.imageOverlay('../data/images/map/main.jpg', bounds).addTo(map);
    map.fitBounds(bounds);

    setPolygons();

    window.addEventListener('resize', function(){
        computeMapDimensions();
        const mapContainer = document.getElementById('map');
        mapContainer.style.width = `${ctx.MAP_W}px`;
        mapContainer.style.height = `${ctx.MAP_H}px`;

        map.invalidateSize();
        map.setMaxBounds([[0,0], [ctx.MAP_H, ctx.MAP_W]]);
        map.fitBounds([[0,0], [ctx.MAP_H, ctx.MAP_W]]);

        if(imageOverlay){
            map.removeLayer(imageOverlay);
        }
        const newBounds = [[0, 0], [ctx.MAP_H,ctx.MAP_W]];
        imageOverlay = L.imageOverlay('../data/images/map/main.jpg', newBounds).addTo(map);

        // Update areas
        setPolygons();
    });
}

function createViz(){
    d3.select("mapContainer").append("svg")
                            .attr("width", ctx.MAP_W)
                            .attr("height", ctx.MAP_H)

    ctx.SELECTED_TIME = new Array(21).fill(false);
    ctx.SELECTED_SEASON = new Array(4).fill(false);
    mapInit();
    loadData();
    // seasonWheel();
    timeWheel();

}

function loadData(){
    const files = [
        "data/fish_detail.csv",
        "data/fish_price_breakdown.csv",
        "data/crabpotandothercatchables.csv",
        "data/fish_chances/Beach_(Spring).csv",
        "data/fish_chances/Beach_(Summer).csv",
        "data/fish_chances/Beach_(Fall).csv",
        "data/fish_chances/Beach_(Winter).csv",
        "data/fish_chances/Forest_Lake_(Spring).csv",
        "data/fish_chances/Forest_Lake_(Summer).csv",
        "data/fish_chances/Forest_Lake_(Fall).csv",
        "data/fish_chances/Forest_Lake_(Winter).csv",
        "data/fish_chances/Forest_River_(Spring).csv",
        "data/fish_chances/Forest_River_(Summer).csv",
        "data/fish_chances/Forest_River_(Fall).csv",
        "data/fish_chances/Forest_River_(Winter).csv",
        "data/fish_chances/Mountain_(Spring).csv",
        "data/fish_chances/Mountain_(Summer).csv",
        "data/fish_chances/Mountain_(Fall).csv",
        "data/fish_chances/Mountain_(Winter).csv",
        "data/fish_chances/Town_(Spring).csv",
        "data/fish_chances/Town_(Summer).csv",
        "data/fish_chances/Town_(Fall).csv",
        "data/fish_chances/Town_(Winter).csv",
    ]

    let promises = files.map(url => d3.csv(url))
    Promise.all(promises).then(function(data){
        processFishData(data[0]);
        addFishToList();
        ctx.fish_price_breakdown = data[1];
        ctx.fish_detail = data[0];

        // Fish changes
        ctx.fish_chances = {};
        for(let i = 3 ; i < files.length; i++){
            ctx.fish_chances[files[i]] = data[i];
        }
        fishAveragePricePerTime();
    })
}


function processFishData(data){
    let fishData = data.map(fish => {
        let season = fish.Season.split('\n').map(s => s.trim());
        if (season == "All Seasons"){
            season = ["Spring", "Summer", "Fall", "Winter"];
        }

        let time = fish.Time.split('\n').map(t => t.trim());
        if(time == "Anytime"){
            time = ["6:00 - 2:00"];
        } else {
            time = time.map(t => {
                t = t.replace(/[–—]/g, '-');
                let [start, end] = t.split(' - ')
                const matchStart = start.match(/^(\d{1,2})(am|pm)$/i);
                const matchEnd = end.match(/^(\d{1,2})(am|pm)$/i);
                let hourStart = parseInt(matchStart[1], 10);
                let hourEnd = parseInt(matchEnd[1], 10);
                if(matchStart[2] === "pm" && hourStart !== 12){
                    hourStart += 12;
                }
                if(matchEnd[2] === "pm" && hourEnd !== 12){
                    hourEnd += 12;
                }
                return `${hourStart}:00 - ${hourEnd}:00`;
            })
        }

        // If location is river (town+forest), change that elementt to town_river and town_forest (ie 2 locations)
        let location = fish.Location.split('\n').flatMap(l => {
            if(l == "River (Town+Forest)"){
                return ['River_Town', 'River_Forest'];
            } else if (l == "River (Forest)"){
                return ['River_Forest'];
            } else if (l == "River (Town)"){
                return ['River_Town'];
            } else {
                return l.replace(" ", "_").trim();
            }
        })


        return {
            name: fish.Name,
            seasons: season,
            times: time,
            weather: fish.Weather.split('\n').map(w => w.trim()),
            location: location,
            description: fish.Description,
            baseXP: fish.BaseXP,
        }
    });


    ctx.FISH_DATA = fishData;
    console.log(ctx.FISH_DATA);
}

function addFishToList(){
    const container = d3.select("#fishList");
    container.selectAll("li")
        .data(ctx.FISH_DATA)
        .enter()
        .append("li")
        .text(d => d.name)
        .on("click", function(fish){
            displayFishInfo(fish);
        });
}

function filterFishListByArea(areas){
    const container = d3.select("#fishList");
    container.selectAll("li")
        .style("display", function(d) {
            return areas.every(area => d.location.includes(area)) ? null : "none";
            // if(d.location.includes(area)){
            //     return null; // Display
            // }
            // return "none"; // Hide
        });
}

function resetFishList(){
    const container = d3.select("#fishList");
    container.selectAll("li")
        .style("display", null);
}


function displayFishInfo(fish){
    // Put map under overlay
    const mapContainer = document.getElementById('map');
    mapContainer.style.zIndex = -1;

    const overlay = d3.select("body").append("div").attr("id", "fishInfoOverlay");
    const container = overlay.append("div").attr("id", "fishInfo");

    // Close Icon
    container.append("div")
    .attr("id", "close")
    .text("X")
    .on("click", function() {
        overlay.remove(); // Close the container on close
        mapContainer.style.zIndex = 1; // Put map back on top
    });


    // Add fish name
    container.append("div")
    .attr("id", "fishName")
    .text(fish.name);

    const contentContainer = container.append("div").attr("id", "fishInfoContent");


    // Left section with fish name and image
    const leftSection = contentContainer.append("div").attr("class", "page-left")


    // Add Image and motif
    const imageContainer = leftSection.append("div").attr("id", "fishImageContainer");
    imageContainer.append("img")
        .attr("src", `data/images/fish/${fish.name.replace(/ /g, "_")}.png`);
    imageContainer.append("div")
        .attr("id", "fishMinigame");


    // Set fish description
    leftSection.append("div")
    .attr("class", "page-description")
    .text(fish.description);

    // Right section
    const rightSection = contentContainer.append("div").attr("class", "page-right");

    // Create table for fish info
    const table = rightSection.append("table")
        .attr("id", "fishInfoTable");
    const tbody = table.append("tbody");

    const info = [
        { label: "Location", value: fish.location },
        { label: "Time", value: fish.times },
        { label: "Season", value: fish.seasons },
        { label: "Weather", value: fish.weather },
        { label: "Base XP", value: fish.baseXP }
    ]


    info.forEach(i => {
        const row = tbody.append("tr");
        row.append("th").text(i.label);
        row.append("td").text(i.value);
    });

    // Add price breakdown in grouped bar chart, price depending on quality. different bars represent profession
    // const priceBreakdown = rightSection.append("div")
    //     .attr("id", "priceBreakdown");
    // priceBarChart("#priceBreakdown", fish.Name);
}




function myFilter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('fishSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("fishList");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


function priceBarChart(selector, fishName){
    let margin = {top: 10, right: 30, bottom: 20, left: 40},
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    let subgroups = ["Base", "Silver", "Gold", "Irridium"];
    let groups = ["BP", "FP", "AP"];

    let data = [];
    subgroups.forEach(subgroup => {
        let baseRow = ctx.fish_price_breakdown.find(row => row.Name === "BP " + subgroup);
        let fisherRow = ctx.fish_price_breakdown.find(row => row.Name === "FP " + subgroup);
        let anglerRow = ctx.fish_price_breakdown.find(row => row.Name === "AP " + subgroup);
        data.push ({
            quality: subgroup,
            "BP": parseInt(baseRow[fishName]),
            "FP": parseInt(fisherRow[fishName]),
            "AP": parseInt(anglerRow[fishName])
        });
    });

    // fy encodes the fish quality
    const fy = d3.scaleBand()
    .domain(subgroups)
    .range([0, height])
    .padding(0.4);


    // y encodes the profession
    const y = d3.scaleBand()
    .domain(groups)
    .range([0, fy.bandwidth()])
    .padding(0.2);

    const color = d3.scaleOrdinal()
    .domain(groups)
    .range(d3.schemeSpectral[groups.length]);

    // x encodes the price (width of the bars)
    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d["BP"], d["FP"], d["AP"]))]).nice()
        .range([0, width]);

    // Show the bars
    svg.append("g")
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
            .attr("transform", d => "translate(0," + fy(d.quality) + ")")
        .selectAll("rect")
        .data(d => groups.map(key => ({key: key, value: d[key]})))
        .enter()
        .append("rect")
            .attr("y", d => y(d.key))
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("width", d => x(d.value))
            .style("fill", d => color(d.key))
            .append("title")
                .text(d => `${d.value}g`);

    // Add y axis
    svg.append("g")
        .call(d3.axisLeft(fy));

    // Add x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width * 0.7}, 0)`);

    const professions = ["Base Profession", "Fisher Profession", "Angler Profession"];
    professions.forEach((profession, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", color(groups[i]));

        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .text(profession);
    });
}

function seasonWheel(){
    const seasons = ["Spring", "Summer", "Fall", "Winter"];
    const size = 200;
    const radius = size / 2;

    const seasonWheel = d3.select("#seasonWheel")
        .append("svg")
            .attr("width", size)
            .attr("height", size)
        .append("g")
            .attr("transform", `translate(${radius}, ${radius})`);

    const color = d3.scaleOrdinal()
        .domain(seasons)
        .range(["#00FF00", "#FFD700", "#FF8C00", "#1E90FF"]);

    const pie = d3.pie()
        .value(1);

    const data = pie(seasons.map(season => ({key: season, value: 1})));

    const arc = d3.arc()
                .innerRadius(50)
                .outerRadius(radius)

    seasonWheel.selectAll("path")
        .data(data)
        .enter()
        .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.key))
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

    // Add labels
    seasonWheel.selectAll("path.text-path")
            .data(data)
            .enter()
            .append("path")
                .attr("class", "text-path")
                .attr("id", (d, i) => `text-path-${i}`)
                .attr("d", arc.innerRadius(70).outerRadius(70))
    seasonWheel.selectAll("text")
            .data(data)
            .enter()
            .append("text")
                .append("textPath")
                    .attr("xlink:href", (d, i) => `#text-path-${i}`)
                    .attr("startOffset", "25%")
                    .style("text-anchor", "middle")
                    .text(d => d.data.key);
}


function timeWheel(){
    const seasons = ["Spring", "Summer", "Fall", "Winter"];
    const times = d3.range(6, 27).map(hour => `${hour % 24}:00`);

    const size = 350;
    const radius = size / 2;

    const wheel = d3.select("#seasonWheel")
        .append("svg")
            .attr("width", size)
            .attr("height", size)
        .append("g")
            .attr("transform", `translate(${radius}, ${radius})`);

    const colorSeason = d3.scaleOrdinal()
        .domain(seasons)
        .range(["#00FF00", "#FFD700", "#FF8C00", "#1E90FF"]);

    const pie = d3.pie()
        .value(1);

    const seasonData = pie(seasons.map(season => ({key: season, value: 1})));
    const timeData = pie(times.map(time => ({key: time, value: 1})));

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius/2)

    const outerArc = d3.arc()
        .innerRadius(radius / 2)
        .outerRadius(radius)

    // Draw seasons
    wheel.selectAll("path.season")
        .data(seasonData)
        .enter()
        .append("path")
            .attr("class", "season")
            .attr("d", arc)
            .attr("fill", d => colorSeason(d.data.key))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("mouseover", function(){
                d3.select(this).style("opacity", 1);
            })
            .on("mouseout", function(){
                const season = d3.select(this).data()[0].data.key;
                const index = seasons.indexOf(season);
                if(!ctx.SELECTED_SEASON[index]){
                    d3.select(this).style("opacity", 0.7);
                }
            })
            .on("click", function(){
                // If season already selected, change opacity to 0.7. Else change to 1
                const season = d3.select(this).data()[0].data.key;
                const index = seasons.indexOf(season);

                d3.select(this).style("opacity", ctx.SELECTED_SEASON[index] ? 0.7 : 1);
                ctx.SELECTED_SEASON[index] = !ctx.SELECTED_SEASON[index];
            })

    // Draw times
    wheel.selectAll("path.time")
        .data(timeData)
        .enter()
        .append("path")
            .attr("class", "time")
            .attr("d", outerArc)
            .attr("fill", "grey")
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("mouseover", function(){
                d3.select(this).style("opacity", 1);
            })
            .on("mouseout", function(){
                const time = d3.select(this).data()[0].data.key;
                const index = times.indexOf(time);
                if(!ctx.SELECTED_TIME[index]){
                    d3.select(this).style("opacity", 0.7);
                }
            })
            .on("click", function(){
                // If time already selected, change opacity to 0.7. Else change to 1
                const time = d3.select(this).data()[0].data.key;
                const index = times.indexOf(time);

                d3.select(this).style("opacity", ctx.SELECTED_TIME[index] ? 0.7 : 1);
                ctx.SELECTED_TIME[index] = !ctx.SELECTED_TIME[index];
            });

    // Add season labels
    wheel.selectAll("path.season-text-path")
        .data(seasonData)
        .enter()
        .append("path")
            .attr("class", "season-text-path")
            .attr("id", (d, i) => `season-text-path-${i}`)
            .attr("d", arc.innerRadius(radius/4).outerRadius(radius/4))
    wheel.selectAll("text.season-text")
        .data(seasonData)
        .enter()
        .append("text")
            .append("textPath")
                .attr("xlink:href", (d, i) => `#season-text-path-${i}`)
                .attr("startOffset", "25%")
                .style("text-anchor", "middle")
                .text(d => d.data.key);

    // Add time labels
    wheel.selectAll("text.time-text")
        .data(timeData)
        .enter()
        .append("text")
            .attr("class","time-text")
            .attr("transform", d => `translate(${outerArc.centroid(d)})`)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .text(d => d.data.key);
}

function computeHourlyProfit(hour, season){
    let total = 0;
    const fishPerHour = 2;
    const files = {
        "Beach": "data/fish_chances/Beach_{season}.csv",
        "Forest lake": "data/fish_chances/Forest_Lake_{season}.csv",
        "Forest river": "data/fish_chances/Forest_River_{season}.csv",
        "Mountain": "data/fish_chances/Mountain_{season}.csv",
        "Town": "data/fish_chances/Town_{season}.csv",
    }

    // Object.values(files).forEach(file => {
    //     const chances = ctx.fish_chances[file];
    //     if(!chances) return;

    //     chances.forEach(fish => {

    //     })
    // })
    return 10; // Placeholder
}


function fishAveragePricePerTime(){
    const times = d3.range(6, 27).map(hour => `${hour}`);
    const seasons = ["Spring", "Summer", "Fall", "Winter"];
    const data = [];
    seasons.forEach(season => {
        const seasonData = [];
        times.forEach(hour => {
            const gameHour = parseInt(hour);
            const totalProfit = computeHourlyProfit(gameHour, season);
            seasonData.push({
                axis: `${hour}:00`,
                value: totalProfit
            });
        });
        data.push(seasonData);
    });

    const config = {
        w: 600,
        h: 600,
        margin: {top: 50, right: 50, bottom: 50, left: 50},
		maxValue: 0.5,
		levels: 5,
		roundStrokes: true,
		color: d3.scaleOrdinal().range(["#21908dff", "#fde725ff", "#fc4e2aff", "#ececec"])
    };

    RadarChart("#radarChart", data, config);
}

fishAveragePricePerTime();