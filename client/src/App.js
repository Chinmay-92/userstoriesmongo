// client/src/App.js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './app.css';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBIcon } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

class App extends Component {
  state = {
    data: [],
    errorMessage:null,
    successMessage:null,
    exerciseerrorMessage:null,
    exercisesuccessMessage:null,
  };

  focusexerciseDiv() {
    document.getElementById('exercisesuccessMessage').focus();
  }

  focususerDiv() {
    document.getElementById('successMessage').focus();
  }


  //create User if not exists
  createUser = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/exercise/new-user', {
      username: this.state.username 
    }).then((data) => data)
      .then((res) => {
        if(!res.data.success){
          this.setState({ successMessage: null})
          this.setState({ errorMessage: res.data.message})
          this.setState({ data: res.data });
        }
        else{
          this.setState({ errorMessage: null})
          this.setState({ successMessage: res.data.message})
          this.setState({ data: res.data });
          this.focususerDiv();
        }

    }).catch((error) => {
      if( error.response ){
          this.setState({ errorMessage: error.response.data.message})
      }
    })

  }

  //add Exercise for a user
  createExercise = (e) => {
    e.preventDefault();
    console.log(this.state);
    axios.post('http://localhost:8080/api/exercise/add', {
      user_id: this.state.user_id,
      description: this.state.description,
      duration: this.state.duration,
      date: this.state.date
    }).then((data) => data)
      .then((res) => {

        if(!res.data.success){
          this.setState({ exercisesuccessMessage: null})
          this.setState({ exerciseerrorMessage: res.data.message})
          this.setState({ data: res.data });
        }
        else{
          this.setState({ exerciseerrorMessage: null})
          this.setState({ exercisesuccessMessage: res.data.message})
          this.setState({ data: res.data });
          this.focusexerciseDiv();
        }

    }).catch((error) => {
      console.log(JSON.stringify(error));
      if( error.response ){
          this.setState({ exerciseerrorMessage: error.response.data.message})
      }
    })

  }

  changeHandler = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
                
  render() {
    const { data, errorMessage, successMessage, exerciseerrorMessage, exercisesuccessMessage } = this.state;
    
    return (
        <MDBContainer>
        <h1 style={{fontWeight:"500",textAlign:"center"}}>User stories</h1>
        <MDBRow>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <form>
                <p className="h4 text-center py-4">Create User</p>
                <p><code>POST /api/exercise/new-user</code> </p>
                <label
                  htmlFor="defaultFormCardEmailEx"
                  className="grey-text font-weight-light">
                  Username
                </label>
                <input
                  type="username"
                  onChange={this.changeHandler}
                  id="username"
                  className="form-control"
                  required
                />
                {(errorMessage !== null)
                 ? <span style={{color: "red"}}>{errorMessage}</span>
                  : ''
                }
                {(successMessage !== null)
                 ? <span style={{color: "green"}}>{successMessage}</span>
                  : ''
                }
                <div className="text-center py-4 mt-3">
                  <MDBBtn className="btn btn-outline-green" onClick={this.createUser}>
                    Create
                    <MDBIcon far icon="caret-square-right" className="ml-2" />
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
            {(successMessage !== null)?
              <MDBCard>
                <MDBCardBody>
                     <div id="successMessage" style={{color: "green"}}>{JSON.stringify(data.data)}</div>
                </MDBCardBody>
              </MDBCard>
            : ''}
        </MDBCol>
        <MDBCol md="6">
        <MDBCard>
            <MDBCardBody>
              <form>
                <p className="h4 text-center py-4">Add an exercise</p>
                <p><code>POST /api/exercise/add</code> </p>
                <label
                  htmlFor="defaultFormCardEmailEx"
                  className="grey-text font-weight-light">
                  UserId
                </label>
                <input
                  type="text"
                  onChange={this.changeHandler}
                  id="user_id"
                  className="form-control"
                />
                <label
                  htmlFor="defaultFormCardEmailEx"
                  className="grey-text font-weight-light">
                  Description
                </label>
                <input
                  type="text"
                  onChange={this.changeHandler}
                  id="description"
                  className="form-control"
                />
                <label
                  htmlFor="defaultFormCardEmailEx"
                  className="grey-text font-weight-light">
                  Duration
                </label>
                <input
                  type="number"
                  onChange={this.changeHandler}
                  id="duration"
                  className="form-control"
                />
                <label
                  htmlFor="defaultFormCardEmailEx"
                  className="grey-text font-weight-light">
                  Date
                </label>
                <input
                  type="date"
                  onChange={this.changeHandler}
                  id="date"
                  className="form-control"
                />
                {(exerciseerrorMessage !== null)
                 ? <span style={{color: "red"}}>{exerciseerrorMessage}</span>
                  : ''
                }
                {(exercisesuccessMessage !== null&&exerciseerrorMessage == null)
                 ? <span style={{color: "green"}}>{exercisesuccessMessage}</span>
                  : ''
                }
                <div className="text-center py-4 mt-3">
                  <MDBBtn className="btn btn-outline-green" onClick={this.createExercise}>
                    Add
                    <MDBIcon far icon="caret-square-right" className="ml-2" />
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
          <div tabIndex="0" id="exercisesuccessMessage">
          {(exercisesuccessMessage !== null && exerciseerrorMessage == null)?
              <MDBCard>
                <MDBCardBody>
                     <div style={{color: "green"}}>{JSON.stringify(data.data)}</div>
                </MDBCardBody>
              </MDBCard>
            : ''}
            </div>
        </MDBCol>
      </MDBRow>
      <p className="h6">GET all users: </p>
                <p><code>1. GET /api/exercise/users</code></p>
                <p className="h6">GET users's exercise log: </p>
                <p><code>1. GET /api/exercise/log/userId</code></p>
                <p><code>2. GET /api/exercise/log/userId/from/to</code></p>
                <p><code>3. GET /api/exercise/log/userId/limit</code></p>
            <p><strong className="h6">from, to</strong> = yyyy-mm-dd; <strong className="h6">limit</strong> = int</p>
    </MDBContainer>
    );
  }
}

export default App;