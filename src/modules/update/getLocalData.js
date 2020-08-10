import _ from "lodash"

const makeLocalDataWithConf = (localData, confData) => {
    let copiedConfData = _.cloneDeep(confData)
    copiedConfData['data'] = transformData(localData[confData['csv_position']], confData)
    
}

const transformData = (data, confData) => {
    const dataType = confData['type']
    if (dataType === 'date'){
        return ExcelDateToJSDate(data)
    }else if(dataType === 'color'){
        return changeStatusFormat(confData['labels'], data)
    }else{
        return data
    }    
}

const changeStatusFormat = (labels, data) => {
    console.log(labels[data])
    return labels[data] !== undefined ? labels[data] : null; 
}

 const ExcelDateToJSDate = (date) => {
    if (date === undefined || date === 'Cabcekked' || date === ''){
        return null
    }
    return new Date((date - 25568)*86400*1000);
}



export const getLocalDataWithConfiguration = (localData, configuration) => {
    return configuration.map(eachConf => makeLocalDataWithConf(localData, eachConf))
} 