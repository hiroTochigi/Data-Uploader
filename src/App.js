import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration';
import Update from './modules/update/Update';
import MakeConnectList from './modules/MakeConnectList/MakeConnectList';
import Banner from "./Banner"


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
  
  getHeaderIndex = (index) => {
    this.setState({headerIndex:index})
  }

  getContext = (res) => {
    const context = res.data;
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
    this.setState({mondayJsonIndex:this.makeMondayJsonIndex(configuration)})
  }

  setConfiguration = (localItemList, mondayColumns, setHaveConf) => {
    this.setState({configuration:makeConfiguration(localItemList, mondayColumns, setHaveConf)}, () => 
      {
        if(this.haveConf){
          this.setMondayJsonIndex(this.state.configuration)
        }else{
          this.setState({haveConnectList:false})
        }
      }
   )}

  render() {
    const { localItemList, mondayColumns,haveConnectList, haveConf, configuration, mondayJsonIndex, boardIds, headerIndex } = this.state;
    console.log(boardIds)
    console.log(haveConnectList)
    return (
      <div>
      <Banner 
        haveConnectList={haveConnectList} 
        haveConf={haveConf}
      /> 
        {
          haveConf ? 
          <Update 
            configuration={configuration}
            mondayJsonIndex={mondayJsonIndex}
            boardIds={boardIds}
            localItemList={localItemList}
            headerIndex={headerIndex}
          />
          :
            haveConnectList ?   
              <ExcelTaker
                getRows={this.getRows}
                setConfiguration={this.setConfiguration}
                mondayColumns={mondayColumns}
                setHaveConf={this.setHaveConf}
              /> 
              :
              <MakeConnectList 
                localItemList={localItemList}
                mondayColumns={mondayColumns}
                headerIndex={headerIndex}
                getHeaderIndex={this.getHeaderIndex}
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
