import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import CONNECT_LIST from './globalConf'
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';

const monday = mondaySdk();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      haveConf: true,
      settings: {},
      context: {},
      boards: [],
    }
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.listen("itemIds", this.getItemIds);
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
    console.log("settings!", res.data);
  };

  getItemIds = (res) => {
    const itemIds = {};
    res.data.forEach((id) => (itemIds[id] = true));
    this.setState({ itemIds: itemIds });
  };

  getContext = (res) => {
    const context = res.data;
    console.log("context!", context);
    this.setState({ context });

    const boardIds = context.boardIds || [context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { id, items { id, name, column_values { id, text } } }}`)
      .then((res) => {
        this.setState({ boards: res.data.boards }, () => {
          console.log(res.data.boards[0].items.slice(0, 100).map((item) => item.id));
        });
      });
  };

  render() {
    return (
      <div>
        <div>
          <Jumbotron className="jumbotron-background">          
              <h1 className="display-3">react-excel-renderer</h1>
              <p className="lead">Welcome to the demo of react-excel-renderer.</p>                        
              <hr className="my-2" />
          </Jumbotron>
        </div>
        <ExcelTaker />
      </div>
    );
  }
}

/*
<InputGroupAddon addonType="prepend">
  <Button color="info" style={{color: "white", zIndex: 0}} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Browse&hellip;</Button>
  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }} style={{"padding":"10px"}} />                                
</InputGroupAddon>
*/

export default App;