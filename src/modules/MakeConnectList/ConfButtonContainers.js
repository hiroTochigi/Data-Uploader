import React from 'react';
import "./ConfButtonContainers.css" 
import ConfButton from "./ConfButton"

const ConfButtonContainers = (props) => {
const  {mondayColumns,localItemList} = props
console.log(localItemList)
const mondayColumnButtons = mondayColumns.map(el => 
                            <ConfButton 
                            type={el.type}
                            title={el.title} 
                            />)
                            
const localItemButtons = localItemList[0].reduce((buttons, el) => {
    if (el === "" || el === null){
        return buttons
    }else{
        buttons.push(<ConfButton title={el}/>)
        return buttons
    }
}, [])
                
return(
    <div className="wrap-container"> 
    <div className="sm-container">{mondayColumnButtons}</div>
    <div className="sm-container">{localItemButtons}</div>
    <div className="big-container"> </div>
    </div>
        )
    }

    export default ConfButtonContainers
