import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { getBoardData } from './getBoardData' 
import { getLocalDataWithConfiguration } from './getLocalData'
import mondaySdk from "monday-sdk-js";

const getBaordIdList = (boardData) => {
    console.log(boardData)
    return Object.keys(boardData)
}

const getItemId = (localData, itemIds, configuration) => {

}

const processItem = (localItem, itemIds, configuration) => {
    const localData = getLocalDataWithConfiguration(localItem, configuration)
    const id = getItemId(localData, itemIds, configuration)

    return 111111
}

const Update = (props) => {
    const {boardIds, configuration, mondayJsonIndex, localItemList, headerIndex} = props;

    const updateMain = (e) => {
        getBoardData(boardIds, mondayJsonIndex).then(boardData =>  getBaordIdList(boardData))
        .then(itemIds => {
            for (let i=0; i<localItemList.length; i++){
                if (i <= headerIndex)
                    continue
                else{
                    const sharedId = processItem(localItemList[i], itemIds, configuration)
                }
            }
            console.log(itemIds)
        })

      }  

    return (
        <Button color="primary" size="lg" block onClick={updateMain}>Update</Button>
    )
}

export default Update;