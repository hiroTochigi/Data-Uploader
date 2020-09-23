import React from 'react';
import "./ConfButtonContainers.css" 
import{ ConfButtonOne, ConfButtonTwo, ConfiguredConfButton}  from "./ConfButton"
import { CONNECT_LIST } from './../../globalConf'
import { Button, ButtonGroup } from 'reactstrap';

const ConfButtonContainers = (props) => {

    const {  
        localItemList,
        mondayColumns,
        headerIndex,
        isEditMode,
        isDeleteMode,
        isOpenTrashCan,
        confedHeaders,
        preConfHeader,
        trashCan,
    } = props

//console.log(localItemList)
const mondayColumnButtons = mondayColumns.map(el => 
                            <ConfButtonOne 
                            type={el.type}
                            title={el.title} 
                            />)
                            
const localItemButtons = localItemList[headerIndex].reduce((buttons, el) => {
    if (el === "" || el === null){
        return buttons
    }else{
        buttons.push(<ConfButtonTwo title={el}/>)
        return buttons
    }
}, [])

const configuredConfButton = Object.keys(CONNECT_LIST).reduce((buttons, el) => {
    buttons.push(<ConfiguredConfButton name1={el} name2={CONNECT_LIST[el]} type='LONG-TEXT'/>)
    return buttons
}, [])

    console.log(isEditMode)
return(
    <div>
        <div className="tool">
            <ButtonGroup>
                {isEditMode ? <Button color="primary">Edit</Button> : <Button color="secondary">Edit</Button>}
                {isDeleteMode ? <Button color="primary">Delete</Button> : <Button color="secondary">Delete</Button>}
                {isOpenTrashCan ? <Button color="primary">Trash Can</Button> : <Button color="secondary">Trash Can</Button>}
            </ButtonGroup>
        </div>
        <div className="wrap-container"> 
            <div className="sm-container">
                <h3 className="container-text">Excel Header</h3>
                {localItemButtons}
            </div>
            <div className="sm-container">
                <h3 className="container-text">Monday Header</h3>
                {mondayColumnButtons}
            </div>
            <div className="big-container">
                <h3 className="container-text">Configuration</h3>
            </div>
            <div className="tool-box"></div>   
        </div>
    </div>
        )
    }

export default ConfButtonContainers
