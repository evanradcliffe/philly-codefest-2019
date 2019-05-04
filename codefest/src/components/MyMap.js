import React from 'react'
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({accessToken: "YOUR_API_KEY"});

// Dilly dilly
const centerLocation = [-75.165222, 39.952583];

class MyMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name ? props.name : "Default name"
        };
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
        return (<div className="map">
            <Map
                style="mapbox://styles/emr76/cjv9us5lc187s1fppilu4kvwj"
                center={centerLocation}
                containerStyle={{
                    height: "100vh",
                    width: "100vw"
                }}
                maxBounds={bounds}
                zoom={[13]}
                onZoomEnd={this.onZoomEnd}
            >
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature />
                </Layer>
            </Map>
        </div>);
    }
}

export default MyMap;