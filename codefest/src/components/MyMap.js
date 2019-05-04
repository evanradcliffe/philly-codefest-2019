import React from 'react'
import ReactMapboxGl, {Layer, Feature, Source} from "react-mapbox-gl";
const $ = require("jquery");

const Map = ReactMapboxGl({accessToken: "YOUR_API_KEY"});

// Dilly dilly
const centerLocation = [-75.165222, 39.952583];

class MyMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name ? props.name : "Default name",
            data: []
        };
    }

    fetchCrime() {
        $.get("https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 where text_general_code = 'Homicide - Criminal'")
            .done((data) => {
                let parsedData = data.rows;
                var returnList = [];
                for (let i = 0; i < parsedData.length; i++) {
                    returnList.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [parsedData[i].point_x, parsedData[i].point_y]
                        },
                        "properties": {
                            "title": "Mapbox DC",
                            "marker-symbol": "monument"
                        }
                    });
                }
                this.setState({data: returnList});
                console.log(parsedData);
                // this.setState({data: data});
            });
    }

    fetchProperty() {
        //
    }

    componentDidMount() {
        this.fetchCrime();
        this.fetchProperty();
    }

    onZoomEnd = (map, event) => {
        console.log(map);
        console.log(event);
    };

    render () {
        const bounds = [
            [-75.285189, 39.880749], // Southwest coordinates
            [-74.899586, 40.106780]  // Northeast coordinates
        ];
        const data = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": this.state.data
            }
        };
        return (<div className="map">
            <Map
                style="mapbox://styles/emr76/cjv9us5lc187s1fppilu4kvwj"
                center={centerLocation}
                containerStyle={{
                    height: "50vh",
                    width: "50vw"
                }}
                maxBounds={bounds}
                zoom={[13]}
                onZoomEnd={this.onZoomEnd}
            >
                <Source
                    id="geojsonsrc"
                    geoJsonSource={data}
                />
                <Layer type="circle" id="layer_id" sourceId="geojsonsrc" />
            </Map>
        </div>);
    }
}

export default MyMap;