import React, { Component } from 'react';
import { isEmpty } from 'lodash';
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
            if(confVarialbes.length === 0){}
            else{
              this.setState({
                //headerIndedx should be taken from configuration board.
                headerIndex:0,
                connectList:confVarialbes.connect_list,
                connectIds:confVarialbes.ids,
                exclusiveLabels: confVarialbes.exclusiveLabelList,
                criteria: confVarialbes.criteriaList,
              })
            }
          })
        monday
          .api(`query { boards(ids:[${targetBoardId}]) { name, columns { title, type, settings_str, id } }}`)
          .then((res) => {
            this.setState({ mondayColumns: res.data.boards[0].columns })
        })
      })
    })
  }

  makeMondayJsonIndex = (configuration) => {
    return configuration.reduce((mondayJsonIndex, data) => {
      mondayJsonIndex[data['title']] = {'json_index':data['json_index'], 'type':data['type']}
      return mondayJsonIndex
    }, {})
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

  /*
  This method is called at ExcelTaker when a local file is uploaded
  This method does three jobs
  1. Make header of the local file
  2. Make configuration file from the three data; local header, target Monday metadata, and configuration board data
  */
  processLocalData = (localItemList) => {
    const { connectList, headerIndex, exclusiveLabels, criteria, mondayColumns } = this.state
    this.setState({localItemList: localItemList})

    let header = []
    try{
      header = localItemList[headerIndex].map(header => header.trim())
    }catch(error){
       if (error instanceof TypeError){
         console.log('Configuration is wrong or upload wrong data')
       }else{
         console.log('something wrong')
       }
    }

    if(isEmpty(connectList)){
       this.setState({
        haveConnectList:false,
        headerIndex: null,
        haveConf: false,
      })
      alert('There is no connect list')
    }else{
      makeConfiguration(header, mondayColumns, connectList).then((conf) => {
        this.setState({
          configuration: conf,
          mondayJsonIndex: this.makeMondayJsonIndex(conf),
          exclusiveLabels: this.getIndex(exclusiveLabels, conf),
          criteria: this.getReadyToUseCriteria(criteria, conf, connectList),
          haveConf: true,
        })
      })
      .catch(err => {
        this.setState({
          haveConnectList:false,
          headerIndex: null,
          haveConf: false,
        })
        alert(err)
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
                processLocalData={this.processLocalData}
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