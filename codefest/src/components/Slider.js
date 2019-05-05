import React from 'react'
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";

class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            steps: new Date().getFullYear(),
            minYear: 2014,
            currentYear: new Date().getFullYear()
        }
    }

    setSteps(value) {
        this.setState({steps: value});
    }

    setLabels() {
        let labels = "[";
        let separator = "";
        for (let i = this.state.minYear; i <= this.state.currentYear; i++) {
            labels += separator + i;
            separator = ", "
        }
        return labels + "]";
    }

    render() {
        return (
            <mobiscroll.Form>
                <mobiscroll.FormGroup>
                    <mobiscroll.FormGroupTitle>Year slider</mobiscroll.FormGroupTitle>
                    <mobiscroll.Slider
                        value={this.state.steps}
                        onChange={this.setSteps}
                        min={this.state.minYear}
                        max={this.state.currentYear}
                        step={1}
                        data-step-labels={this.setLabels()}
                    >Year</mobiscroll.Slider>
                </mobiscroll.FormGroup>
            </mobiscroll.Form>
        );
    }

}
export default Slider;