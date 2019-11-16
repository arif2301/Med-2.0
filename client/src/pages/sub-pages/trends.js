import React, { Component } from "react";
import API from "../../utils/API";

//import { Link } from "react-router-dom";
import TrendsForm from "./Trends/TrendsForm";
import TrendsMap from "./Trends/TrendsMap";
import TrendsChart from "./Trends/TrendsChart"
import { set } from "mongoose";

let rendermap;

class Trends extends Component {

    

    state = {
        city : "",
        disease : "",
        rendermap: false
    }
    // state = {
    //     med2,
    //     trend
    // }
    render (){ 


        return (
           
            <div>
                
                <div className="container">
                <h5> Have a look at various diagnosis trends </h5>
                </div>
                
                    <TrendsForm city ={this.state.city} disease= {this.state.disease} rendermap ={this.state.rendermap} change = {this.handleInputChange}
                    handleFormSubmit={this.handleFormSubmit}/>
                    
                    {this.state.rendermap ? <TrendsChart /> : null}
                    {this.state.rendermap ? <TrendsMap /> : null}
                
                
            </div>
        
            )
    }

    handleInputChange = event => {
        console.log (event.target);
        console.log (event.target.name);
        console.log (event.target.value);
        console.log("handle input change");
        // Getting the value and name of the input which triggered the change
        const { name, value } = event.target;

        // Updating the input's state
        this.setState({
            [name]: value
        });

    };

    handleFormSubmit = (event, city) => {
        // Preventing the default behavior of the form submit (which is to refresh the page)
        event.preventDefault();

            //setState ()
            API.getAllPrimaryDiagnosisInCityInPast4Weeks(this.state.city)
            .then(res => 
                {
                    this.setState({ records: res.data });
                    // alert(this.state.city);
                    alert(JSON.stringify (res.data));
                    // alert(JSON.stringify (res.data[0].city));

        })
            .catch(err => console.log(err));
    };


}

export default Trends;
