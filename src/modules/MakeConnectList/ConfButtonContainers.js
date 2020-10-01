import React, { Component } from 'react';
import "./ConfButtonContainers.css" 
import{ ConfButtonOneDisabled, ConfButtonTwo, ConfButtonTwoDisabled, ConfiguredConfButton, ConfButtonOne}  from "./ConfButton"
import { excelDateToJSDate } from '../update/getLocalData'
import { Button, ButtonGroup } from 'reactstrap';
import { render } from '@testing-library/react';

class ConfButtonContainers extends Component {
  constructor(props){
    super(props);
    this.state={
      isEditMode: true,
      isDeleteMode: false,
      isOpenTrashCan: false,
      confedHeaders: {},
      preConfHeader: [],
      trashCan: [],
      mondayButtons: [],
      localButtons: [],
      localDataSet: {},
    }
  }

    componentDidUpdate(){
        const { preConfHeader, localDataSet } = this.state
        console.log(preConfHeader)
        console.log(localDataSet)
    }

    componentDidMount(){
        this.setState({
            mondayButtons: this.mondayButtons,
            localButtons: this.localButtons,
            localDataSet: this.makeLocalDataSet()
        })
    }

    makeLocalDataSet = () => {
        const header = this.props.localItemList.slice(this.props.headerIndex, 1)[0] 
        const items = this.props.localItemList.slice(this.props.headerIndex + 1) 
        let localDataSet = {}
        for (let i = 0; i<header.length;i++){
            let itemSet = new Set()
            for (let item of items){
                itemSet.add(item[i])
            }
            localDataSet[header[i]] = itemSet
        }
        return localDataSet
    }

    makeNewButtonDynamically = (button, name) => {
        const {title, type, whichButton} = button.props
        return title !== name ?
        (
            whichButton === 'monday' ?
            <ConfButtonOneDisabled 
            type={type}
            title={title}
            />
            :
            <ConfButtonTwoDisabled 
            type={type}
            title={title}
            />
        )
        :
        button
    }

    getPreConfHeader = (name, type, whichButton) => {
        let { preConfHeader, localButtons, mondayButtons } = this.state
        console.log(mondayButtons)
        if (preConfHeader.length > 1){
            console.log('never happen')
        }else{
            this.setState({preConfHeader: [...preConfHeader, {'name':name, 'type':type}]})
            if (whichButton === 'monday'){
                this.mondayButtons = this.mondayButtons.map(bottun => this.makeNewButtonDynamically(bottun, name))
                this.localButtons = localButtons

            }else{
                this.localButtons = this.localButtons.map(bottun => this.makeNewButtonDynamically(bottun, name))
                this.mondayButtons = mondayButtons
            }
        }
    }

    getTypes = (name, dataSet) => {
        let types = ['name', 'text', 'long-text']
        let isNumber = true
        let isDate = true
        for (let data of dataSet){
            if (Number.isInteger(data)){}
            else if(typeof(data) === 'number') isDate = false
            else{
                isNumber = false
                isDate = false
            }
        }
        if(isNumber) types.push('numeric')
        if(isDate) types.push('date')
        return types 
    }

    makeMondayButtons = () => {
        const buttons = this.props.mondayColumns.map(
            el => <ConfButtonOne 
            type={el.type}
            title={el.title}
            whichButton={'monday'}
            getPreConfHeader={this.getPreConfHeader} 
            />
        )
        return buttons
    }

    makeLocalItemButtons = () => {
        const localDataSet = this.makeLocalDataSet()
        const buttons = this.props.localItemList[this.props.headerIndex].reduce((buttons, name) => {
        if (name === "" || name === null){
            return buttons
        }else{
            buttons.push(<ConfButtonTwo 
                        title={name}
                        types={this.getTypes(name, localDataSet[name])}
                        whichButton={'local'}
                        getPreConfHeader={this.getPreConfHeader} 
                         />)
                return buttons
            }
        }, [])
        return buttons
    }

    localButtons = this.makeLocalItemButtons()
    mondayButtons = this.makeMondayButtons()

    /*const configuredConfButton = Object.keys(CONNECT_LIST).reduce((buttons, el) => {
        buttons.push(<ConfiguredConfButton name1={el} name2={CONNECT_LIST[el]} type='LONG-TEXT'/>)
        return buttons
    }, [])*/

    render(){

        const {
            isEditMode,
            isDeleteMode,
            isOpenTrashCan,
            confedHeaders,
            preConfHeader,
            trashCan,
        } = this.state

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
                        {this.localButtons}
                    </div>
                    <div className="sm-container">
                        <h3 className="container-text">Monday Header</h3>
                        {this.mondayButtons}
                    </div>
                    <div className="big-container">
                        <h3 className="container-text">Configuration</h3>
                    </div>
                    <div className="tool-box"></div>   
                </div>
            </div>
        )
    }
}

export default ConfButtonContainers
