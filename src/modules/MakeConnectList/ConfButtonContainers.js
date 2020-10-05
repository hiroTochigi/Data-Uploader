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
      confedHeadersButtons: [],
      preConfHeader: [],
      trashCan: [],
      masterMondayButtons: [],
      mondayButtons: [],
      masterLocalButtons: [],
      localButtons: [],
      localDataSet: {},
    }
  }
    
    localButtons = this.makeLocalItemButtons()
    mondayButtons = this.makeMondayButtons()

    componentDidUpdate(){
        const { preConfHeader, 
                localDataSet,
                confedHeaders,
                localButtons,
                mondayButtons,
                confedHeadersButtons,
            } = this.state

            console.log(confedHeadersButtons)
        if (preConfHeader.length === 2){
            const preConfString = typeof preConfHeader[0]['type'] === 'string' ?  preConfHeader[0] : preConfHeader[1]
            const preConfGroup = typeof preConfHeader[0]['type'] === 'object' ?  preConfHeader[0] : preConfHeader[1]

            if (this.isLegitimateCombination(preConfString['type'], preConfGroup['type'])){
                this.setState(preState =>{
                    let confedHeaders = {...preState.confedHeaders}
                    confedHeaders[preConfString['name']] = preConfGroup['name']
                    return {confedHeaders}
                })
                this.setState(preState =>{
                    let confedHeadersButtons = [...preState.confedHeadersButtons]
                    console.log(confedHeadersButtons)
                    confedHeadersButtons.push({
                        'local': this.getTargetButton(preConfString['name'], localButtons),
                        'monday': this.getTargetButton(preConfGroup['name'], mondayButtons),
                    })
                    return {confedHeadersButtons}
                })
                this.setState({
                    preConfHeader: [],
                    localButtons: this.makeNewButtonSet(preConfString['name'], localButtons),
                    mondayButtons: this.makeNewButtonSet(preConfGroup['name'], mondayButtons), 
                }, ()=> {
                    this.localButtons = this.state.localButtons
                    this.mondayButtons = this.state.mondayButtons
                })
            }
        }
    }

    componentDidMount(){
        this.setState({
            mondayButtons: this.mondayButtons,
            localButtons: this.localButtons,
            localDataSet: this.makeLocalDataSet()
        })
    }
    
    isLegitimateCombination = (typeString, typeGroup) => {
        return typeGroup.some(type => type === typeString)
    }

    makeNewButtonSet = (title, buttons) => {
        return buttons.filter(button => button.props.title !== title)
    }

    getTargetButton = (title, buttons) => {
        for (const button of buttons){
            if (button.props.title === title) return button
        }
        console.log('something wrong')
        return null
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
        const {title, type, whichButton, index} = button.props
        return title !== name ?
        (
            whichButton === 'monday' ?
            <ConfButtonOneDisabled 
            type={type}
            title={title}
            key={title}
            index={index}
            />
            :
            <ConfButtonTwoDisabled 
            type={type}
            title={title}
            key={title}
            index={index}
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
        let types = ['name', 'color', 'text', 'long-text']
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
            (el, index) => <ConfButtonOne 
            key={el.title}
            type={el.type}
            title={el.title}
            whichButton={'monday'}
            getPreConfHeader={this.getPreConfHeader}
            index={index}
            />
        )
        return buttons
    }

    makeLocalItemButtons = () => {
        const localDataSet = this.makeLocalDataSet()
        const buttons = this.props.localItemList[this.props.headerIndex].reduce((buttons, name, index) => {
        if (name === "" || name === null){
            return buttons
        }else{
            buttons.push(<ConfButtonTwo 
                        key={name}
                        title={name}
                        types={this.getTypes(name, localDataSet[name])}
                        whichButton={'local'}
                        getPreConfHeader={this.getPreConfHeader}
                        index={index}
                         />)
                return buttons
            }
        }, [])
        return buttons
    }


    /*const configuredConfButton = Object.keys(CONNECT_LIST).reduce((buttons, el) => {
        buttons.push(<ConfiguredConfButton name1={el} name2={CONNECT_LIST[el]} type='LONG-TEXT'/>)
        return buttons
    }, [])*/

    render(){

        const {
            isEditMode,
            isDeleteMode,
            mondayButtons,
            localButtons,
            isOpenTrashCan,
            confedHeaders,
            preConfHeader,
            trashCan,
        } = this.state
        
        const mButtons = ( mondayButtons === undefined || this.mondayButtons[0].whichButton === undefined) ? this.mondayButtons : mondayButtons
        const lButtons = (localButtons === undefined || this.localButtons[0].whichButton === undefined ) ? this.localButtons : localButtons 

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
                        {lButtons}
                    </div>
                    <div className="sm-container">
                        <h3 className="container-text">Monday Header</h3>
                        {mButtons}
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
