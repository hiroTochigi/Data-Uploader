import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { getBoardData } from './getBoardData' 
import { getLocalDataWithConfiguration } from './getLocalData'
import { makeItemCreationQuery, makeUpdateQuery } from './query'
import mondaySdk from "monday-sdk-js";
import { extendWith } from 'lodash';
import _ from "lodash"

const monday = mondaySdk()

/*
Translate label to index with error handling
Error handling for columns configuration
Two type of error
1. No column title
2. No label in the column
Write warning on the log (future implementation)
Either error return null
*/
const getLabelsOfIndex = (configuration, columnTitle, labelData) => {
  let targetConfLabels = null
  for (const conf of configuration){
    if (conf['title'] === columnTitle){
      targetConfLabels = conf['labels']
      break
    }
  }

  if(!targetConfLabels) {
    console.log(`There is no ${columnTitle} column on Monday`)
      return null
  }

  return targetConfLabels[labelData] !== undefined ? targetConfLabels[labelData] : 
  function(){
    console.log(`There is no ${labelData} labels on ${columnTitle} column`)
    return null
  }() 
}

const getBaordIdList = (boardData) => {
  return Object.keys(boardData)
}

const getDataFromCsvTitle = (data, title) => {
  for (let datum of data){
    if(datum['csv_title'] === title){
        return datum['data']
      }
  }
  return null
}

const isItemOnMonday = (csvItemIds, id, boardData) => {
  return csvItemIds['id'] === boardData[id]['ids']['id']
}

const getItemId = (localData, itemIds, configuration, boardData) => {
  const csvItemIds = {'id': getDataFromCsvTitle(localData, 'WO NUM')}

  for (const id of itemIds){
    if(isItemOnMonday(csvItemIds, id, boardData)){
      return id
    }
  }
  return null
}

const shouldUpdate = (datum, id, boardData) => {
  return boardData[id]['data'][datum['csv_title']] !== datum['data']
}

const updateDataSet = (data, id, boardData) => {
  return data.reduce((updateDataSet, datum) => {
    if(shouldUpdate(datum, id, boardData)){
      updateDataSet.push(datum)
      return updateDataSet
    }
    return updateDataSet
  }, [])
}

const processQuery = (query) => {
   monday.api(query)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err))
}

const processItem = (localItem, itemIds, configuration, boardData, boardIds) => {
  const localData = getLocalDataWithConfiguration(localItem, configuration)
  const id = getItemId(localData, itemIds, configuration, boardData)

  if(id === null && getDataFromCsvTitle(localData, "Status") !== getLabelsOfIndex(configuration, "Status", "DONE")){
    const query = makeItemCreationQuery(localData, boardIds)
    processQuery(query)
  }else if(id !== null){
    const updateDataList = updateDataSet(localData, id, boardData)
    if(updateDataList.length > 0){
      const query = makeUpdateQuery(updateDataList, id, boardIds)
      processQuery(query)
    }
  }
  return id
}

const Update = (props) => {
  const {boardIds, configuration, mondayJsonIndex, localItemList, headerIndex, connectList} = props;
 
  const updateMain = (e) => {
    getBoardData(boardIds, mondayJsonIndex, connectList).then(boardData =>  
      {
        let itemIds =  getBaordIdList(boardData)
        for (let i=0; i<localItemList.length; i++){
          if (i <= headerIndex)
            continue
          else{
            const sharedId = processItem(localItemList[i], itemIds, configuration, boardData, boardIds)
            if(sharedId){
                itemIds.splice(itemIds.indexOf(sharedId), 1)
            }
        }
      }
      console.log(itemIds)
    })
  }  

  return(
    <Button color="primary" size="lg" block onClick={updateMain}>Update</Button>
  )
}

export default Update;