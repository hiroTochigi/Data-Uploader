import React from 'react';
import { Jumbotron } from 'reactstrap';
import "./ConfButton.css"

export const ConfButtonOne = (props) => {
     const {title, type} = props
    return(
        <div className="button-two">
            <p>{title}</p>
            <p className="text">{type}</p>
        </div>
    )   
}

export const ConfButtonTwo = (props) => {
const {title, type} = props
    return(
        <div className="button-one">
            <p>{title}</p>
            <p className="text">{type}</p>
        </div>
    )
}

export const ConfiguredConfButton = (props) => {
    const {name1, name2, type} = props
    return(
        <div className="conf-button-box">
            <div className="name-box">
                <p className="name1">{name1}</p>
                <p className="name2">{name2}</p>
            </div>
            <div className="type-box">
                <p>{type}</p>
            </div>
        </div>
    )
}