import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration';
import Update from './modules/update/Update';
import makeConfVariable from "./modules/update/makeConfVariable"

const monday = mondaySdk();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      haveConnectList: true,
      haveConf: false,
      headerIndex: null,
      boardId: '',
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
  }

  getConfigurationBoardId = (boardIds) => {
    return new Promise((resolve, reject) => {
      for(let i=0; boardIds.length > i; i++){
        monday
        .api(`query { boards(ids:[${boardIds[i]}]) { name }}`)
        .then((res) => {
          if (res.data.boards[0].name === "Configuration"){
            resolve(boardIds[i])
          }
        }
      )}
    })
  }
  
  getTargetBoardName = (targetBoardId) => {
     return new Promise((resolve, reject) => {
        monday
        .api(`query { boards(ids:[${targetBoardId}]) { name }}`)
        .then((res) => {
            resolve(res.data.boards[0].name)
        }
      )
    })
  }

  getContext = (res) => {
    const context = res.data;
    const boardIds = context.boardIds || [context.boardId];

    this.getConfigurationBoardId(boardIds).then((confId) => {
      const confBoardId = confId
      const targetBoardId = boardIds[0] !== confBoardId ? boardIds[0] : boardIds[1]
      this.setState({boardId:targetBoardId})

      this.getTargetBoardName(targetBoardId).then((res) => {
        const boardName = res
        monday
          .api(`query { boards(ids:[${confBoardId}]) { items { name, group{ title }, column_values { id, value } } }}`)
          .then((res) => {
            const boardAllItems = res.data.boards[0].items;
            const confVarialbes = makeConfVariable(boardAllItems, boardName)
            this.setState({connectList:confVarialbes.connect_list,
                    headerIndex:0,
                    connectIds:confVarialbes.ids,
                    exclusiveLabels: confVarialbes.exclusiveLabelList,
                    criteria: confVarialbes.criteriaList,
                  })
        })
        monday
          .api(`query { boards(ids:[${targetBoardId}]) { name, columns { title, type, settings_str, id } }}`)
          .then((res) => {
            this.setState({ mondayColumns: res.data.boards[0].columns })
        })
      })
    })
  }

  getRows = (rows) => {
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
      return newLabels
    }, {}) 
    return newLabels
  }

  getCsvTitle = (key, connectList) => {
    const flippedConnectList = Object.keys(connectList).reduce((flippedList, key) => {
      flippedList[connectList[key]] = key
      return flippedList
    }, {})
    return flippedConnectList[key]
  }

  getReadyToUseCriteria = (criteria, configuration, connectList) => {
    const tempCriteria = this.getIndex(criteria, configuration)
    return Object.keys(tempCriteria).reduce((newCriteria, key) => {
      newCriteria[key] = {
                          criteria:tempCriteria[key],
                          csv_title:this.getCsvTitle(key, connectList)
                         }
    return newCriteria                     
    }, {})
  }

  setConfiguration = (localItemList, mondayColumns, setHaveConf) => {
    const { connectList, headerIndex, exclusiveLabels, criteria } = this.state
    const header = localItemList[headerIndex].map(header => header.trim())
    this.setState({configuration:makeConfiguration(header, mondayColumns, setHaveConf, connectList)}, () => 
    this.setMondayJsonIndex(this.state.configuration))
    this.setState({
      exclusiveLabels: this.getIndex(exclusiveLabels, this.state.configuration),
      criteria:  this.getReadyToUseCriteria(criteria, this.state.configuration, connectList)
    })
  }

  render() {
    const { localItemList,
            mondayColumns,
            haveConf,
            configuration,
            mondayJsonIndex,
            boardId,
            headerIndex,
            connectList,
            connectIds,
            exclusiveLabels,
            criteria,
    } = this.state;
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
            boardId={boardId}
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