import React from 'react';
import { Jumbotron } from 'reactstrap';
import "./ConfButton.css"

const ConfButton = (props) => {
    const {title, type} = props

    return(
        <div className="button">
        <p>{title}</p>
        <p className="text">{type}</p>
        </div>
    )
}

export default ConfButton