import React from 'react'
import Slider from "./Slider";
import MyMap from "./MyMap";

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: new Date().getFullYear()
        };
        this.updateYear = this.updateYear.bind(this);
    }

    updateYear(year) {
        this.setState({year: year});
    }

    render() {
        return (
            <div>
                <Slider year={this.state.year} updateYear={this.updateYear}/>
                <MyMap year={this.state.year}/>
            </div>
        );
    }
}
export default Info;