import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration';
import Update from './modules/update/Update';

const monday = mondaySdk();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      haveConnectList: true,
      haveConf: false,
      headerIndex: 0,
      boardIds: '',
      settings: {},
      context: {},
      boards: [],
      mondayColumns: [],
      configuration: [],
      mondayJsonIndex: {},
      localItemList: null,
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
    this.setState({boardIds:boardIds})
    monday
      .api(`query { boards(ids:[${boardIds}]) { columns { title, type, settings_str, id } }}`)
      .then((res) => {
        this.setState({ mondayColumns: res.data.boards[0].columns }, () => {
          console.log(res.data.boards[0].columns)
        });
      });
  };

  getRows = (rows) => {
    console.log(rows)
    this.setState({localItemList: rows})
  }

  setHaveConf = (val) => {
    this.setState({haveConf:val})
  }

  makeMondayJsonIndex = (configuration) => {
    return configuration.reduce((mondayJsonIndex, data) => {
      mondayJsonIndex[data['title']] = {'json_index':data['json_index'], 'type':data['type']}
      return mondayJsonIndex
    }, {})
  }

  setMondayJsonIndex = (configuration) => {
    console.log(this.makeMondayJsonIndex(configuration))
    this.setState({mondayJsonIndex:this.makeMondayJsonIndex(configuration)})
  }

  setConfiguration = (localItemList, mondayColumns, setHaveConf) => {
    this.setState({configuration:makeConfiguration(localItemList, mondayColumns, setHaveConf)}, () => this.setMondayJsonIndex(this.state.configuration))
  }

  render() {
    const { localItemList, mondayColumns, haveConf, configuration, boardIds, headerIndex } = this.state;
    
    return (
      <div>
        <div>
          <Jumbotron className="jumbotron-background">          
              <h1 className="display-3">Update Monday Board</h1>
              {
                haveConf ? 
                <p className="lead">Click Update Button</p>
                :  
                <p className="lead">Upload Excel file or CSV file</p>
              }                 
              <hr className="my-2" />
          </Jumbotron>
        </div>
        {
          haveConf ? 
          <Update 
            configuration={configuration}
            boardIds={boardIds}
            localItemList={localItemList}
            headerIndex={headerIndex}
          />
          :  
          <ExcelTaker
            getRows={this.getRows}
            setConfiguration={this.setConfiguration}
            mondayColumns={mondayColumns}
            setHaveConf={this.setHaveConf}
          />
        }        
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
