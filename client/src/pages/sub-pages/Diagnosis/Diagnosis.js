import React, { Component } from "react";

// Page Dependencies
import AboutMeForm from "./AboutMeForm"
import BodyLocationForm from "./BodyLocationForm"
import SymptomsForm from "./SymptomsForm"
import DiagnoseSymptoms from "./DiagnoseSymptoms"
import PlacesAutocomplete from 'react-places-autocomplete';


//Route Dependencies
import API from "../../../utils/API"
import googleApi from "../../../utils/googleApi"

class Diagnosis extends Component {
   state = {
      /* General States */
      posLat: "",
      posLng: "",
      currentLoc: "",
      suggestedLoc: "",
      symptomsSelObj: [],
      city: "",


      /* About Me Page */
      AboutMeForm: true,
      firstName: "",
      lastName: "",
      birthYear: "",
      gender: "",

      /* Body Locations Page */
      imageRoute: "assets/images/BodyVectors/Empty.png",
      locations: [],
      bodyLocationType: "General Body Location",
      selLocation: "",
      BodyLocationForm: false,
      BodyGen: true,

      /* Symptoms Page */
      SymptomsForm: false,
      bodySymp: true,
      symptoms: [],
      symptomsSel: [],
      minPassed: false,
      maxPassed: false,

      /* Diagnosis Page */
      DiagnosisForm: false,
      diagnosis: []
   }

   findLocation = () => {
      console.log("Find Location")
      navigator.geolocation.getCurrentPosition((position) => {
         //Send Location to State
         this.setState({ posLat: position.coords.latitude })
         this.setState({ posLng: position.coords.longitude })
         //Geocode Location to Find City
         googleApi.cordToCity(this.state.posLat, this.state.posLng)
            .then((res) => {
               this.setState({ currentLoc: res.data.results[0].formatted_address })
               this.setState({ city: "valid" })
            })
      });
   }

   handleInputChange = (event) => {
      this.setState({ [event.target.name]: event.target.value })
   }
   handleInputBodyLoc = (event) => {
      if (this.state.BodyGen) {
         let imgPath
         if (event.target.value == 16) {
            imgPath = "assets/images/BodyVectors/APB.png"
         } else if (event.target.value == 7) {
            imgPath = "assets/images/BodyVectors/ArmsShoulders.png"
         } else if (event.target.value == 15) {
            imgPath = "assets/images/BodyVectors/ChestBack.png"
         } else if (event.target.value == 6) {
            imgPath = "assets/images/BodyVectors/HeadThroatNeck.png"
         } else if (event.target.value == 10) {
            imgPath = "assets/images/BodyVectors/Legs.png"
         } else {
            imgPath = "assets/images/BodyVectors/skinJGeneral.png"
         }
         this.setState({ imageRoute: imgPath })
      }

      this.setState({ [event.target.name]: event.target.value })
   }
   handleSymptomsSelect = (event) => {
      let strSymptoms
      //If Get Diag Button was Pressed
      if (event.target.value === "GetDiag") {
         strSymptoms = JSON.stringify(this.state.symptomsSel)
         //Get Diagnosis
         API.getDiagSel(this.state.gender, this.state.birthYear,
            strSymptoms)
            .then(res => {
               //Place new Symptoms in symptoms State
               this.setState({ diagnosis: res.data })
   
               /* Store diag for database */
               let recordObj = {} //Temp Record Obj to push into db
               let diagResults = [] //Temp Diag Array
               this.state.diagnosis.forEach(diag => {
                  let diagObj = {
                     "id": diag.Issue.ID,
                     "name": diag.Issue.Name,
                     "accuracy": diag.Issue.Accuracy.toFixed(2)
                  }
                  diagResults.push(diagObj)
               })
               //Create Record Obj to send to DB
               recordObj = {
                  "type": {"birthYear": this.state.birthYear, "gender": this.state.gender},
                  "city": this.state.currentLoc,   //String City
                  "latitude": this.state.posLat,   //String Number
                  "longitude": this.state.posLng,  //String Number
                  "symptoms": this.state.symptomsSelObj, //Array of Objects
                  "diagnosis": diagResults
               }

               //Save Record to db
               API.saveRecords(recordObj)
                  .then((res)=> {console.log(res.data)})

               //Set State of DiagnosisForm to True
               this.setState({ DiagnosisForm: true })
               //Set Symptoms Form to False to display DiagnoseSymptoms Page
               this.setState({ SymptomsForm: false })
            })
            .catch(err => console.log(err)); //Catch Errors 



      } else { //Select Symptoms Button
         /* ---------- Collect Selected Symptoms ---------- */
         //Set current array to variable
         let sympArr = this.state.symptomsSel
         let sympArrObj = this.state.symptomsSelObj

         let selSymptomObj = {
            "id": event.target.value,
            "name": event.target.name
         }
         //Push Symptom id and obj in respective arrays
         sympArr.push(event.target.value)
         sympArrObj.push(selSymptomObj)

         //Set new to state with updated information
         this.setState({ symptomsSel: sympArr })
         this.setState({ symptomsSelObj: sympArrObj })

         //Get New Proposed Symptoms
         strSymptoms = JSON.stringify(this.state.symptomsSel)
         console.log(strSymptoms)
         API.getSympSel(this.state.gender, this.state.birthYear,
            strSymptoms)
            .then(res => {
               //Place new Symptoms in symptoms State
               this.setState({ symptoms: res.data })
               if (!this.state.minPassed) {
                  if (this.state.symptomsSel.length >= 2) {
                     this.setState({ minPassed: true })
                  }
               }
            })
            .catch(err => console.log(err)); //Catch Errors 
      }
   }

   handleSubmitForm = (event) => {
      event.preventDefault();

      //About Me  => Bodylocation(General)
      if (this.state.AboutMeForm) { //If About Me Form is Displayed
         //Pull General Body Locations From Api and Change Form
         API.getBodyGen()
            .then(res => {
               //Place Genera; Locations in Locations State
               this.setState({ locations: res.data })

               //Set BodyLocationsForm To True
               this.setState({ BodyLocationForm: true })

               //Set AboutMeForm to False to display BodyLocationsForm
               this.setState({ AboutMeForm: false })
            })
            .catch(err => console.log(err)); //Catch Errors 
      }

      //Bodylocation(General) => Bodylocation(Specific)
      else if (this.state.BodyLocationForm && this.state.BodyGen) {
         API.getBodySpec(this.state.selLocation)
            .then(res => {
               //Place Specific Locations in Locations State
               this.setState({ locations: res.data })

               //Set BodyGen To False (Specific Locations)
               this.setState({ BodyGen: false })
               this.setState({ bodyLocationType: "Specific Body Location" })
            })
            .catch(err => console.log(err)); //Catch Errors 
      }

      //Bodylocation(Specific) => BodySymptoms
      else if (this.state.BodyLocationForm && !this.state.BodyGen) {
         API.getBodySymp(this.state.gender, this.state.birthYear, this.state.selLocation)
            .then(res => {
               //Place Specific Locations in Locations State
               this.setState({ symptoms: res.data })

               //Set SymptomsForm To True
               this.setState({ SymptomsForm: true })

               //Set BodyLocationsForm to False to display SymptomsForm
               this.setState({ BodyLocationForm: false })
            })
            .catch(err => console.log(err)); //Catch Errors 
      }

      //BodySymptoms => DiagForm
      else if (this.state.SymptomsForm) {
         API.getBodySymp(this.state.gender, this.state.birthYear, this.state.selLocation)
            .then(res => {
               //Place Specific Locations in Locations State
               this.setState({ symptoms: res.data })

               //Set SymptomsForm To True
               this.setState({ SymptomsForm: true })

               //Set BodyLocationsForm to False to display SymptomsForm
               this.setState({ BodyLocationForm: false })
            })
            .catch(err => console.log(err)); //Catch Errors 
      }

   }

   render() {
      if (this.state.AboutMeForm) {
         return (
            <AboutMeForm
               submitHandler={this.handleSubmitForm}
               handleInputChange={this.handleInputChange}
               firstName={this.state.firstName}
               lastName={this.state.lastName}
               birthYear={this.state.birthYear}
               gender={this.state.gender}
               currentLoc={this.state.currentLoc}
               city={this.state.city}
               findLocation={this.findLocation}
            />
         )
      } else if (this.state.BodyLocationForm) {
         return (
            <BodyLocationForm
               submitHandler={this.handleSubmitForm}
               handleInputChange={this.handleInputBodyLoc}
               imageRoute={this.state.imageRoute}
               locations={this.state.locations}
               genLocation={this.state.genLocation}
               bodyLocationType={this.state.bodyLocationType}
            />
         )
      } else if (this.state.SymptomsForm) {
         return (
            <SymptomsForm
               submitHandler={this.handleSubmitForm}
               handleSymptomsSelect={this.handleSymptomsSelect}
               symptoms={this.state.symptoms}
               minPassed={this.state.minPassed}
            />
         )
      } else if (this.state.DiagnosisForm) {
         return (
            <DiagnoseSymptoms
               submitHandler={this.handleSubmitForm}
               handleSymptomsSelect={this.handleSymptomsSelect}
               diagnosis={this.state.diagnosis}
            />
         )
      }

   }





}

export default Diagnosis;
