import React from 'react'
import ReactMapboxGl, {Layer, Feature, Source} from "react-mapbox-gl";
import {access_keys} from '../creds';

const $ = require("jquery");

const Map = ReactMapboxGl({accessToken: access_keys.mapbox_token});

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
        //TODO this is hardcoded to "Homicide - Criminal"
        //Should have different buttons for different crimes
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

    fetchProperty(year) {

        $.get("https://phl.carto.com/api/v2/sql?q=SELECT assessments.market_value, assessments.parcel_number, opa_properties_public.location, opa_properties_public.zip_code, assessments.year " +
            "FROM assessments INNER JOIN opa_properties_public ON opa_properties_public.parcel_number=assessments.parcel_number " +
            "WHERE assessments.year=" + year + " " +
            "AND (opa_properties_public.category_code_description = 'Multi Family' OR opa_properties_public.category_code_description = 'Single Family') " +
            "LIMIT 2000")
            .done((data) => {
                let parsedData = data.rows;
                var returnList = [];
                for (let i = 0; i < parsedData.length; i++) {

                    var address = parsedData[i].location + " " + parsedData[i]

                    //TODO implement geocoding

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

    componentDidMount() {
        this.fetchCrime();
        this.fetchProperty("2017");
    }

    onZoomEnd = (map, event) => {
        console.log(map);
        console.log(event);
    };

    render () {
        const bounds = [
            [-75.285189, 39.880749], // Sout    hwest coordinates
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