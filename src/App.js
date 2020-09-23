import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration';
import Update from './modules/update/Update';
import MakeConnectList from './modules/MakeConnectList/MakeConnectList';
import Banner from "./Banner"
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
  
  getHeaderIndex = (index) => {
    this.setState({headerIndex:index})
  }

  getContext = (res) => {
    /*
      Retrieve all data to make configuration from Monday side.
      Get Configuration Board Id
      Get Target Board (This board is modified by this program) Id
      Get Target Board Name (The name is used to get configuration file from the Configuration board)
      Take Connect_list and other configuration data and store in state
      Get Target Column data
    */
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
            this.setState({
                    //headerIndedx should be taken from configuration board.
                    headerIndex:0,
                    connectList:confVarialbes.connect_list,
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
    
    //write error handling 
    //if script cannot process this function, configuration is wrong
    const header = localItemList[headerIndex].map(header => header.trim())

    //call make configuration outside setState function
    //need to have promise obj to wait necessary calculation
    //also, need to separate make configuration and check configuration
    this.setState({
      configuration:makeConfiguration(header, mondayColumns, setHaveConf, connectList)}, () => {
        this.setMondayJsonIndex(this.state.configuration)
      })
    
    // Get haveConf val here because makeConfiguration decide if it can make configuration 
    // and store value in haveConf 
    if(this.state.haveConf){
      this.setState({
        exclusiveLabels: this.getIndex(exclusiveLabels, this.state.configuration),
        criteria:  this.getReadyToUseCriteria(criteria, this.state.configuration, connectList)
      })
    }else{
      this.setState({
        haveConnectList:false,
        headerIndex: null,
      })
    }
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
            haveConnectList,
    } = this.state;
    
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
            boardId={boardId}
            localItemList={localItemList}
            headerIndex={headerIndex}
            connectList={connectList}
            connectIds={connectIds}
            exclusiveLabels={exclusiveLabels}
            criteria={criteria}
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

export default App;