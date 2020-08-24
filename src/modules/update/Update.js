import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { getBoardData } from './getBoardData' 
import { getLocalDataWithConfiguration } from './getLocalData'
import { makeItemCreationQuery, makeUpdateQuery } from './query'
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk()

const getBaordIdList = (boardData) => {
  return Object.keys(boardData)
}

const getDataFromLocalTitle = (data, title) => {
  for (let datum of data){
    if(datum['csv_title'] === title){
        return datum['data']
      }
  }
  return null
}

const isItemOnMonday = (csvItemIds, id, boardData, connectIds) => {
  return connectIds.reduce((isAllItemOnMonday, connectId) => {
    isAllItemOnMonday &= csvItemIds[connectId] === boardData[id]['ids'][connectId]
    return isAllItemOnMonday
  }, true)
}

const getItemId = (localData, itemIds, configuration, boardData, connectIds) => {
  const csvItemIds = connectIds.reduce((ids, el) => {
    ids[el] = getDataFromLocalTitle(localData, el) 
    return ids
  }, {})

  for (const id of itemIds){
    if(isItemOnMonday(csvItemIds, id, boardData, connectIds)){
      return id
    }
  }
  return null
}

const isAbleThisLabelChanged = (boardLabelId, exclusiveLabels, title) => {
  return exclusiveLabels[title].every(id => id !== boardLabelId)
}

const isLocalAndMondayDataDifferent = (datum, id, boardData) => {
  return boardData[id]['data'][datum['csv_title']] !== datum['data']
}

const shouldUpdate = (datum, id, boardData, exclusiveLabels) => {
  return isLocalAndMondayDataDifferent(datum, id, boardData) 
         &&
         isAbleThisLabelChanged(boardData[id]['data'][datum['csv_title']], exclusiveLabels, datum['title']) 
}

/*
Evaluate every criterion in each column
*/
const evaluateCriterion = (localLabelIndex, criteria) => {
  return criteria.reduce((allTest, criterion) => {
    const conmaIndex = criterion.search(',')
    const mondayIndex = criterion.slice(0,conmaIndex)
    const operator = criterion.slice(conmaIndex + 1)
    allTest &= operator === "=" ? localLabelIndex === mondayIndex : localLabelIndex !== mondayIndex   
    return allTest
    }, true)
} 

/*
Evaluate each column
*/
const evaluateCriteria = (criteria, localData) => {
 return Object.keys(criteria)
              .every(key => 
                     evaluateCriterion(
                        getDataFromLocalTitle(localData, criteria[key]["csv_title"]),
                        criteria[key]["criteria"])
                    )
}

const processQuery = (query) => {
   monday.api(query)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err))
}

const getUpdateDataSet = (data, id, boardData, exclusiveLabels) => {
  return data.reduce((updateDataSet, datum) => {
    if(shouldUpdate(datum, id, boardData, exclusiveLabels)){
      updateDataSet.push(datum)
      return updateDataSet
    }
    return updateDataSet
  }, [])
}

const processItem = ( localItem,
                      itemIds,
                      configuration,
                      boardData,
                      boardId,
                      connectIds,
                      exclusiveLabels,
                      criteria,
                    ) => {
  const localData = getLocalDataWithConfiguration(localItem, configuration)
  const id = getItemId(localData, itemIds, configuration, boardData, connectIds)
  if(id === null && evaluateCriteria(criteria, localData)){
    const query = makeItemCreationQuery(localData, boardId)
    processQuery(query)
  }else if(id !== null){
    const updateDataList = getUpdateDataSet(localData, id, boardData, exclusiveLabels)
    if(updateDataList.length > 0){
      const query = makeUpdateQuery(updateDataList, id, boardId)
      console.log(query)
      processQuery(query)
    }
  }
  return id
}

const Update = (props) => {
  const { localItemList,
          configuration,
          mondayJsonIndex,
          boardId,
          headerIndex,
          connectList,
          connectIds,
          exclusiveLabels,
          criteria,
        } = props;
        
  const updateMain = (e) => {
    getBoardData(boardId, mondayJsonIndex, connectList, connectIds).then(boardData =>  
      {
        let itemIds =  getBaordIdList(boardData)
        for (let i=0; i<localItemList.length; i++){
          if (i <= headerIndex)
            continue
          else{
            const sharedId = processItem( localItemList[i],
                                          itemIds,
                                          configuration,
                                          boardData,
                                          boardId,
                                          connectIds,
                                          exclusiveLabels,
                                          criteria,
                                        )
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