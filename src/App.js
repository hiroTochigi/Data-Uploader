import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration'

const monday = mondaySdk();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      haveConnectList: true,
      haveConf: false,
      settings: {},
      context: {},
      boards: [],
      mondayColumns: [],
      configuration: [],
      rows: null,
    }
  }

  componentDidMount() {
    monday.listen("context", this.getContext);
  }

  getContext = (res) => {
    const context = res.data;
    console.log("context!", context);
    this.setState({ context });

    const boardIds = context.boardIds || [context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { columns { title, type, settings_str, id } }}`)
      .then((res) => {
        this.setState({ mondayColumns: res.data.boards[0].columns }, () => {
          console.log(res.data.boards[0].columns)
        });
      });
  };

  getRows = (rows) => {
    this.setState({rows})
  }

  setHaveConf = (val) => {
    this.setState({haveConf:val})
  }

  setConfiguration = (rows, mondayColumns, setHaveConf) => {
    this.setState({configuration:makeConfiguration(rows, mondayColumns, setHaveConf)})
  }

  render() {
    const { rows, mondayColumns, haveConf } = this.state;
    
    return (
      <div>
        <div>
          <Jumbotron className="jumbotron-background">          
              <h1 className="display-3">react-excel-renderer</h1>
              <p className="lead">Welcome to the demo of react-excel-renderer.</p>                        
              <hr className="my-2" />
          </Jumbotron>
        </div>
        <ExcelTaker
          getRows={this.getRows}
          setConfiguration={this.setConfiguration} 
          mondayColumns={mondayColumns}
          setHaveConf={this.setHaveConf}
          />
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

/*
`query { boards(ids:[${boardIds}]) { items { name, id, group{ id }, column_values { id, value } } }}` take all board items with data
*/
