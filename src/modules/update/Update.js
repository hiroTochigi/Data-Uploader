import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { getBoardData } from './getBoardData' 
import { getLocalDataWithConfiguration } from './getLocalData'
import mondaySdk from "monday-sdk-js";
import { extendWith } from 'lodash';

/*
Translate label to index with error handling
Error handling for columns configuration
Two type of error
1. No column title
2. No label in the column
Write warning on the log (future implementation)
Either error return null
*/
const getLabelsIndex = (configuration, columnTitle, labelData) => {
    let targetConfLabels = null
    for (const conf of configuration){
        if (conf['title'] === columnTitle){
            targetConfLabels = conf['labels']
            break
        }
    }

    if (!targetConfLabels) {
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

const processItem = (localItem, itemIds, configuration, boardData) => {
    const localData = getLocalDataWithConfiguration(localItem, configuration)
    const id = getItemId(localData, itemIds, configuration, boardData)
    if (id === null && getDataFromCsvTitle(localData, "Status") !== getLabelsIndex(configuration, "Status", "DONE")){
        console.log(id)
    } 

    return id
}

const Update = (props) => {
    const {boardIds, configuration, mondayJsonIndex, localItemList, headerIndex} = props;

    const updateMain = (e) => {
        getBoardData(boardIds, mondayJsonIndex).then(boardData =>  
            {
            const itemIds =  getBaordIdList(boardData)
            for (let i=0; i<localItemList.length; i++){
                if (i <= headerIndex)
                    continue
                else{
                    const sharedId = processItem(localItemList[i], itemIds, configuration, boardData)
                }
            }
        })

      }  

    return (
        <Button color="primary" size="lg" block onClick={updateMain}>Update</Button>
    )
}

export default Update;