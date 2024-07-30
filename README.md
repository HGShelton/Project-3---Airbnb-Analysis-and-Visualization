Airbnb Analysis and Visualization

Project Members: Nic Mallett, Zac Mason, Hannah Shelton

Resources
- Data source: https://insideairbnb.com/get-the-data/
  - listings.csv.gz
  - neighbourhoods.geojson
- Side panel: https://github.com/maxwell-ilai/Leaflet.SidePanel
- Jupyter Notebook 
   - Pandas to clean data
   - Matplotlib, Seaborn, and Bokeh to render graphs
- VS Code
   - GeoJson to store and represent geographical data
   - Leaflet to create interactive maps and visualizations
      - base maps, heat maps, street maps, tile layers, markers, dropdown menus, side panels
- ChatGPT for troubleshooting and identifying errors

Introduction  
In recent years, Airbnb has grown in popularity with use cases ranging from a romantic weekend getaway to a month long work retreat. With that, the idea to invest in a secondary home for rental purposes has as well. Our project will dive into the lucrative home share marketplace located in Boston, MA. focusing on current Airbnb listings. We will use datasets to determine average listing rates, what people like about the property, which homes have higher ratings, and the amount of Airbnb’s in each county. We hope that once completed, this project will provide value to customers and investors by sharing knowledge on how they can start a successful home sharing business or book a quality stay for their family vacation. 

Map Interaction  
The link we have created brings us right over Boston. Aerially, we see clusters of homes generally located in the same area with apparent county lines highlighting their zones. On the right hand side of the screen, there is a toggle for accommodations ranging from 1 - 7+. You may select one or multiple depending on your query. Another toggle considers the nightly rate using a choropleth style map. When turning this on, each county is highlighted based on its average rate with a gradient ranging from light orange (low average cost) to red (high average cost). If a customer wanted to consider different residences there is a toggle to distinguish which kind of home is available. Lastly, there is a toggle for a heat map. The heat map uses listing density in each county to define its gradient moving from purple (low density) - red (high density). By clicking on a point of interest we will zoom in further and begin to see individual houses. When hovering over each POI you will see a few details regarding the home such as; nightly rate, bedrooms, bathrooms. 

Ethical Considerations  
It is important in every data related project to consider how the data you collect will impact others and your study. To start we cleaned each data file, purging it of any null or unnecessary values. While we completed this we made sure to operate indiscriminately and transparently. We also tried to retain some level of anonymity by referring to hosts using their host ID’s. Because our project is being used to find housing locations we were unable to remove the location of the respective home eliminating an element of privacy. While we wish to protect the privacy and security of all our participants, without being able to contact them makes it challenging.

Functionality (index.html):  
- Toggle between 3 base layers with the 26 Boston Area neighborhoods outlines
    - Street Map, Heat Map, Chorpleth with legend based on Average Nightly Price ($)
- Search through the available listings using dropdowns on the left side of screen based on the following:
  - Specific neighborhoods (Brighton, Fenway, South Boston, etc..
  - Property Type (Private Room, Entire House, and even a boat)
- Clustered markers for all Boston Neighborhoods’ data with the below information once clicked on: Property Type, Nightly Rental Price, # of Beds/Baths, # of People the unit Accommodates
- Clickable Filters for markers populating on map based on the following:
  - Number of people the rental unit accommodates (1-3, 4-6. 7+)
  - Price per night ($150 or less, $150-$300, $301-$550, $551-$1000, $1000+)
- Side Panel  
  - Clickable panel on left side, with more in depth analysis included within various charts/graphs





