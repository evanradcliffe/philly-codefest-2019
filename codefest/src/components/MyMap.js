import React from 'react'
import ReactMapboxGl, {Layer, Source} from "react-mapbox-gl";
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
            homicideData: [],
            propertyData: [],
            year: this.props.year,
            zoom: [13]
        };
    }

    fetchCrime() {
        $.get("https://phl.carto.com/api/v2/sql?q=SELECT * FROM incidents_part1_part2 where text_general_code = 'Homicide - Criminal'")
            .done((data) => {
                let parsedData = data.rows
                    .filter((item) => {
                        return item.dispatch_date.includes(this.state.year);
                });
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
                this.setState({homicideData: returnList});
            });
    }

    fetchProperty() {
        $.get("https://phl.carto.com/api/v2/sql?q=SELECT assessments.market_value, assessments.parcel_number, " +
            "opa_properties_public.location, opa_properties_public.zip_code, assessments.year, " +
            "ST_Y(opa_properties_public.the_geom) AS point_x, ST_X(opa_properties_public.the_geom) AS point_y FROM " +
            "assessments INNER JOIN opa_properties_public ON opa_properties_public.parcel_number=assessments.parcel_number " +
            "WHERE assessments.year='" + this.state.year + "' AND (opa_properties_public.category_code_description = 'Multi Family' OR " +
            "opa_properties_public.category_code_description = 'Single Family') ORDER BY RANDOM() LIMIT 5000",)
            .done((data) => {
                let parsedData = data.rows;
                var returnList = [];
                for (let i = 0; i < parsedData.length; i++) {
                    returnList.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [parsedData[i].point_y, parsedData[i].point_x]
                        },
                        "properties": {
                            "dbh": parsedData[i].market_value,
                            "title": "Mapbox DC",
                            "marker-symbol": "monument"
                        }
                    });
                }
                this.setState({propertyData: returnList});
            });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({year: nextProps.year});
        this.fetchCrime();
        this.fetchProperty();
    }

    componentDidMount() {
        this.fetchCrime();
        this.fetchProperty();
    }

    onZoomEnd = (map, event) => {
        this.setState({zoom: [map.getZoom()]});
    };

    render () {
        const bounds = [
            [-75.285189, 39.880749], // Southwest coordinates
            [-74.899586, 40.106780]  // Northeast coordinates
        ];
        const homicideData = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": this.state.homicideData
            }
        };
        const propertyData = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": this.state.propertyData
            }
        };
        const propertyValues = this.state.propertyData.map((x) => x.properties).map((y) => y.dbh);
        let minPropertyVal = Math.min(...propertyValues);
        if (minPropertyVal === Infinity) {
            minPropertyVal = 0;
        }
        let maxPropertyVal = Math.max(...propertyValues);
        if (maxPropertyVal === -Infinity) {
            maxPropertyVal = 10000000;
        }
        return (<div className="map">
            <Map
                style="mapbox://styles/emr76/cjv9us5lc187s1fppilu4kvwj"
                center={centerLocation}
                containerStyle={{
                    height: "50vh",
                    width: "50vw"
                }}
                maxBounds={bounds}
                zoom={this.state.zoom}
                onZoomEnd={this.onZoomEnd}
            >
                <Source
                    id="geojsonsrc"
                    geoJsonSource={homicideData}
                />
                <Layer
                    id="layer_id"
                    type="circle"
                    sourceId="geojsonsrc"
                    paint={{"circle-color": '#ff00ff'}}
                    layout={{visibility: 'visible'}}/>
                <Source
                    id="otherDataId"
                    geoJsonSource={propertyData}/>
                <Layer
                    id="layer_id_2"
                    type="circle"
                    sourceId="otherDataId"
                    paint={
                        {
                            "circle-color": {
                                property: 'dbh',
                                type: 'interval',
                                stops: [
                                    [minPropertyVal, 'rgba(236,222,239, 0)'],
                                    [100000, 'rgb(236,222,239)'],
                                    [200000, 'rgb(208,209,230)'],
                                    [300000, 'rgb(166,189,219)'],
                                    [400000, 'rgb(103,169,207)'],
                                    [500000, 'rgb(28,144,153)'],
                                    [maxPropertyVal, 'rgb(1,108,89)']
                                ]
                            }
                        }
                    }
                    layout={{visibility: 'visible'}}/>
            </Map>
        </div>);
    }
}

export default MyMap;