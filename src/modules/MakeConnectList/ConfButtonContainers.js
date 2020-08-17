import React from 'react';
import "./ConfButtonContainers.css" 
import ConfButton from "./ConfButton"

const ConfButtonContainers = (props) => {
const  {mondayColumns,localItemList} = props
mondayColumns.map(el => console.log(el.title))
mondayColumns.map(el => console.log(el.type))
const mondayColumnButtons = mondayColumns.map(el => 
                            <ConfButton 
                            type={el.type}
                            title={el.title} 
                            />)
                            
                
return(
    <div className="wrap-container"> 
    <div className="sm-container">{mondayColumnButtons}</div>
    <div className="sm-container">{mondayColumnButtons}</div>
    <div className="big-container"> </div>
    </div>
        )
    }

    export default ConfButtonContainers
