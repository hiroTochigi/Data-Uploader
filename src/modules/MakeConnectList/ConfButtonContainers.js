import React from 'react';
import "./ConfButtonContainers.css" 
import{ ConfButtonOne, ConfButtonTwo, ConfiguredConfButton}  from "./ConfButton"
import { CONNECT_LIST } from './../../globalConf'
import { Button, ButtonGroup } from 'reactstrap';

const ConfButtonContainers = (props) => {
const  {mondayColumns, localItemList, headerIndex} = props
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

return(
    <div className="wrap-container"> 
        <div className="sm-container">{localItemButtons}</div>
        <div className="sm-container">{mondayColumnButtons}</div>
        <div className="big-container">{configuredConfButton} </div>
        <div className="tool-box"></div>   
        <div className="tool">
            <ButtonGroup vertical>
                <Button color="secondary">Edit</Button>
                <Button color="secondary">Delete</Button>
                <Button color="secondary">Trash Can</Button>
            </ButtonGroup>
        </div>

    </div>
        )
    }

export default ConfButtonContainers
