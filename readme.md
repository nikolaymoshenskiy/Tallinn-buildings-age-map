# Interactive map of Tallinn buildings by construction year

This project is an [interactive map of Tallinn buildings](https://nikolaymoshenskiy.github.io/tallinn-buildings-age-map/), colored by construction year, created using [OpenLayers](https://openlayers.org/) - an open-source JavaScript library used for displaying and interacting with maps in web browsers. The map features a color-coded timeline slider that allows to explore buildings from different time periods and a hover-based info panel that displays the building's address and year of construction. 

The idea to create this map arose during one of my frequent visits to Tallinn. As one of Northern Europe's best-preserved medieval cities, Tallinn reflects various historical periods in its urban fabric. Walking through the city, particularly in the city center and Old Town, often left me wondering about the age of the houses, which inspired me to visualize it.


## Features

1. An intuitive panel that displays the address and year of construction when hovering over a building.

2. A slider to select the desired time range. Due to the limited number of buildings constructed between 1250 and 1800, for the sake of usability, only 20% of the slider's timeline is allocated to these years, while the remaining 80% spans from 1800 to 2024.


## Data preparation and deployment

The building footprint data for Estonia was obtained from the Estonian Land Board [Geoportal](https://geoportaal.maaamet.ee/eng/spatial-data/estonian-topographic-database/download-topographic-data-p618.html) and then filtered to include only the data specific to Tallinn. Buildings with missing building register codes were also filtered out. In total, 33,788 building features were used, of which 6,289 don't have information regarding the construction year.

After experimenting with various options, I decided to choose vector tilesets to display data. The [Tippecanoe](https://github.com/mapbox/tippecanoe) tool was used to generate the MBTiles files. To render map tiles, they were hosted on [Maptiler](https://www.maptiler.com/). 


## Considerations 
There are over 6,000 buildings with missing construction year information and some buildings only have an estimated construction year that may not reflect the true date of their construction. Moreover, some older buildings may have undergone several reconstructions, meaning the recorded year might not correspond to the initial build. Despite these gaps, the map effectively achieves its primary objective, offering a general overview of building construction periods and serving more as a visual representation showing how Tallinn's architecture has evolved over time.

