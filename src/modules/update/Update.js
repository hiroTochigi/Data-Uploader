import React, { Component } from 'react';
import { Button } from 'reactstrap'
import { getBoardData } from './getBoardData' 
import mondaySdk from "monday-sdk-js";

const getBaordIdList = (boardData) => {
    return Object.keys(boardData)
}



const Update = (props) => {
    const {boardIds, configuration, rows} = props;

    const updateMain = (e) => {
        getBoardData(boardIds).then(boardData =>  getBaordIdList(boardData))
        .then(itemIds => {
            console.log(itemIds)
        })

      }  

    return (
        <Button color="primary" size="lg" block onClick={updateMain}>Update</Button>
    )
}

export default Update;