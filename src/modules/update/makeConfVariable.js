
const makeconfvariable = (confBoardData, targetBoardName) => {
    let confVariables = {}
    const preConfVariables = confBoardData.reduce((variableList, datum) => {
        if (datum.group.title === targetBoardName ){
            variableList.push(datum)
        }
        return variableList
    }, [])
    console.log(preConfVariables)

    const connect_list = makeConnectList(preConfVariables)
    const ids = makeIdList(preConfVariables)
    const exclusiveLabelList =  makeExclusiveLabelList(preConfVariables)
    const criteriaList = makeCriteriaLabelList(preConfVariables)
    confVariables['connect_list'] = connect_list
    confVariables['ids'] = ids 
    confVariables['exclusiveLabelList'] = exclusiveLabelList
    confVariables['criteriaList'] = criteriaList
    return confVariables
}

const makeConnectList = (preConfVariables) => {
    return preConfVariables.reduce((connect_list, datum) => {
        connect_list[datum.name] = JSON.parse(datum.column_values[0].value) 
        return connect_list
    }, {})
}

const makeIdList = (preConfVariables) => {
    return preConfVariables.reduce((id, datum) => {
        if (JSON.parse(datum.column_values[1].value) === "True"){
            id.push(datum.name)
        }
        return id     
    }, [])
}

const getArray = (labels) => {
    return labels.search('|') === -1 ? [labels] : labels.split('|')
}

const makeExclusiveLabelList = (preConfVariables) => {
    return preConfVariables.reduce((labelList, datum) => {
        if(JSON.parse(datum.column_values[2].value) !== null){
            const name = JSON.parse(datum.column_values[0].value)
            labelList[name] = getArray(JSON.parse(datum.column_values[2].value))
        }
        return labelList
    }, {})
}

const makeCriteriaLabelList = (preConfVariables) => {
    return preConfVariables.reduce((labelList, datum) => {
        if(JSON.parse(datum.column_values[3].value) !== null){
            const name = JSON.parse(datum.column_values[0].value)
            labelList[name] = getArray(JSON.parse(datum.column_values[3].value))
        }
        return labelList
    }, {})
}

export default makeconfvariable