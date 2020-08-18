import React, { Component } from 'react';
import "./ChooseHeaderIndex.css"
import { Button } from 'reactstrap';

class ChooseHeaderIndex extends Component {
    constructor(props){
        super(props);
        this.state={
            choosenRowName: '',
            choosenRowIndex: null, 
        }
        this.getHeaderIndex = props.getHeaderIndex.bind(this)
        this.rowClickEvent = this.rowClickEvent.bind(this)
    }

    rowClickEvent = (rowEl, index) => {this.setState({choosenRowName:rowEl, choosenRowIndex: index})}

    getRows = (localItemList) => {
        let rows = []
        
        for(let index=0; index<localItemList.length; index++){

            if (localItemList[index] === undefined || index > 10){
                break
            }

            let row = []
            const rowEl = `Row ${index}`
            row.push(
                    <td onClick={() => this.rowClickEvent(rowEl, index)}>
                        {rowEl}
                    </td>
                    )

            localItemList[index].forEach(el => row.push(<td>{el}</td>))

            rows.push(<tr>{row}</tr>)
        }
        return rows
    }

    render() {
        const {localItemList} = this.props
        const {choosenRowName, choosenRowIndex} = this.state
        const rows = this.getRows(localItemList)
            return (
                <div className="choosing-box">
                    <h2>Choose Header</h2>
                    <p>Click an appropriate row number as header.</p>
                    <p>Then, click button.</p>

                    {choosenRowName === '' ?
                    <Button color="success" className="button" disabled>Click Row</Button>
                    :
                    <Button color="success" className="button" onClick={() => {this.getHeaderIndex(choosenRowIndex)}}>{choosenRowName}</Button>}

                    <div className="table-container">
                        <table>
                            {rows}
                        </table>
                    </div>
                </div>
            )
    }
}
export default ChooseHeaderIndex