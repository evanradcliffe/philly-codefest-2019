import React from 'react'
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
const $ = require("jquery");

class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            steps: props.year,
            minYear: 2014,
            currentYear: new Date().getFullYear()
        };
        this.setSteps = this.setSteps.bind(this);
    }

    setSteps() {
        let value = $("#slider").val();
        this.props.updateYear(value);
        this.setState({steps: value});
    }

    setLabels() {
        let labels = "[";
        let separator = "";
        for (let i = this.state.minYear; i <= this.state.currentYear; i++) {
            labels += separator + i;
            separator = ", ";
        }
        return labels + "]";
    }

    render() {
        return (
            <div>
                <form>
                    <label htmlFor="slider">{this.state.minYear}</label>
                    <input id="slider" name="slider" type="range" min="2014" max="2019" step="1" onInput={this.setSteps}/>
                    <label htmlFor="slider">{this.state.currentYear}</label>
                </form>
            </div>
        );
    }

}
export default Slider;