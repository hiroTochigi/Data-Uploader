import React from 'react';
import { Jumbotron } from 'reactstrap';
import "./ConfButton.css"

export const ConfButtonOne = (props) => {
     const {title, type, whichButton, getPreConfHeader} = props
    return(
        <div className="button-one" onClick={() => getPreConfHeader(title, type, whichButton)}>
            <p>{title}</p>
            <p className="text">{type}</p>
        </div>
    )   
}

export const ConfButtonOneDisabled = (props) => {
     const {title, type} = props
    return(
        <div className="button-one button-one-disabled" >
            <p>{title}</p>
            <p className="text">{type}</p>
        </div>
    )   
}

export const ConfButtonTwo = (props) => {
    const {title, types, whichButton, getPreConfHeader} = props
    const typeSentence = types.reduce((typeSentece, type, index, types) => {
        return typeSentece += types.length === index + 1 ? type : type + ', ' 
    }, "")
    return(
        <div className="button-two" onClick={() => getPreConfHeader(title, types, whichButton)}>
            <p>{title}</p>
             <p className='text'>{typeSentence}</p>
        </div>
    )
}

export const ConfButtonTwoDisabled = (props) => {
const {title, type} = props
    return(
        <div className="button-two button-two-disabled">
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