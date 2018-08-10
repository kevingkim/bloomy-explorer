import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';


export default class FormPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }


  handleSubmit() {
    alert("submitted");
    // TODO
  }


  render() {
    return (
      <div>
        <div className="description">
          Instruction:
        </div>

        <form className="form" onSubmit={this.handleSubmit.bind(this)}>

          {/* <div class="row">
            <div class="col-25">
              <label for="fname">First Name</label>
            </div>
            <div class="col-75">
              <input type="text" id="fname" name="firstname" placeholder="Your name.." />
            </div>
          </div> */}


          Question 1 <br/>
            <textarea name="Text1" placeholder="text" cols="30" rows="3">
            </textarea> <br/><br/>
          Question 2 <br/>
            <textarea name="Text1" placeholder="text" cols="30" rows="3">
            </textarea> <br/><br/>
          Question 3 <br/>
            <select id="" name="name">
              <option value="a"> Apricot </option>
              <option value="b"> Banana </option>
              <option value="c"> Citron </option>
            </select>
               <br/> <br/>

           <input type="submit" value="Submit" />
        </form>

        {/* <div className="description">
          <button className="button" onClick={this.handleClickSave.bind(this)}>
            Save
          </button>
        </div> */}

      </div>
    );
  }

}
