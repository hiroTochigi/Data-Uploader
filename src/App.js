import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration';
import Update from './modules/update/Update';
import { CONNECT_LIST, header, ids, exclusiveLabels, criteria} from './globalConf'

const monday = mondaySdk();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      haveConnectList: true,
      haveConf: false,
      headerIndex: null,
      boardIds: '',
      settings: {},
      context: {},
      boards: [],
      mondayColumns: [],
      configuration: [],
      mondayJsonIndex: {},
      localItemList: null,
      connectList: {},
      connectIds: [],
      exclusiveLabels: {},
      criteria: {},
    }
  }

  componentDidMount() {
    monday.listen("context", this.getContext)
    this.setState({ connectList:CONNECT_LIST,
                    headerIndex:header.headerIndex,
                    connectIds:ids,
                    exclusiveLabels: exclusiveLabels,
                    criteria: criteria,
                  })
  }

  getContext = (res) => {
    const context = res.data;
    this.setState({ context });
    const boardIds = context.boardIds || [context.boardId];

    for(let i=0; boardIds.length > i; i++){
      monday
      .api(`query { boards(ids:[${boardIds[i]}]) { name, columns { title, type, settings_str, id } }}`)
      .then((res) => {
        if (res.data.boards[0].name !== "Configuration"){
          this.setState({ mondayColumns: res.data.boards[0].columns }, () => {
            this.setState({boardIds:boardIds[i]})
            console.log(res.data)
          });
        }else{
          monday
          .api(`query { boards(ids:[${boardIds[i]}]) { items { name, group{ id }, column_values { id, value } } }}`)
          .then((res) => {
            const boardAllItems = res.data.boards[0].items;
            console.log(boardAllItems)
          })
        }
      }
    )}
  }

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

  getTargetLabelSet = (labelTitle, configuration) => {
    for (let i=0; configuration.length>i; i++){
      if(labelTitle === configuration[i]['title']){
        console.log(configuration[i])
        return configuration[i]['labels']
      }
    }
    alert(`No ${labelTitle} in configuration. Something wrong`)
    return null
  }

  translateTitleToNumber = (title, labelSet, la) => {
    const connmaIndex = title.search(',')
    
    const labelId = connmaIndex === -1 ? 
    labelSet[title] 
    : 
    (
      labelSet[title.slice(0, connmaIndex)] === undefined ?
      undefined
      :
      labelSet[title.slice(0, connmaIndex)] + title.slice(connmaIndex) 
    )
    
    if ( labelId === undefined ){
      alert(`No "${connmaIndex === -1 ? title : title.slice(0, connmaIndex)}" in "${la}" column. Please check your configuration`)
    } 
    console.log(labelId)
    return labelId
  }

  /*
  Labels and logic is separated by , (conma) inside string
  If there is conma in the string, convert the string before the conma to number
  Then add with the number and the remained portion including conma.
  */
  getIndex = (labels, configuration) => {
    const newLabels = Object.keys(labels).reduce((newLabels, la) => {
      const targetLabelSet = this.getTargetLabelSet(la, configuration) 
      newLabels[la] = labels[la].map(title => this.translateTitleToNumber(title, targetLabelSet, la)) 
      console.log(labels[la])
      return newLabels
    }, {}) 
    console.log(newLabels)
    console.log(configuration)
    return newLabels
  }

  setConfiguration = (localItemList, mondayColumns, setHaveConf) => {
    const { connectList, headerIndex, exclusiveLabels, criteria } = this.state
    this.setState({configuration:makeConfiguration(localItemList[headerIndex], mondayColumns, setHaveConf, connectList)}, () => 
    this.setMondayJsonIndex(this.state.configuration))
    this.setState({
      exclusiveLabels: this.getIndex(exclusiveLabels, this.state.configuration),
      criteria:  this.getIndex(criteria, this.state.configuration)
    })
  }

  render() {
    const { localItemList,
            mondayColumns,
            haveConf,
            configuration,
            mondayJsonIndex,
            boardIds,
            headerIndex,
            connectList,
            connectIds,
            exclusiveLabels,
            criteria,
    } = this.state;
    console.log(boardIds)
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
            mondayJsonIndex={mondayJsonIndex}
            boardIds={boardIds}
            localItemList={localItemList}
            headerIndex={headerIndex}
            connectList={connectList}
            connectIds={connectIds}
            exclusiveLabels={exclusiveLabels}
            criteria={criteria}
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