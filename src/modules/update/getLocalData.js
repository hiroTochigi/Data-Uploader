import _ from "lodash"

const makeLocalDataWithConf = (localData, confData) => {
  let copiedConfData = _.cloneDeep(confData)
  copiedConfData['data'] = transformData(localData[confData['csv_position']], confData)
  return copiedConfData
}

const transformData = (data, confData) => {
  const dataType = confData['type']
  if (dataType === 'date'){
    return ExcelDateToJSDate(data)
  }else if(dataType === 'color'){
    return changeStatusFormat(confData['labels'], data)
  }else if(dataType === 'text' || dataType === 'long-text'){
    return parsableDoubleQuote(data)
  }else if(dataType === 'numeric'){
    return numberToString(data)
  }else if(dataType === 'name'){
    return numberToString(data)
  }else{
    return data
  }    
}

const changeStatusFormat = (labels, data) => {
  return labels[data] !== undefined ? labels[data] : null; 
}

const makeTwoDigitDateElement = (date) => {
  date = date.toString()
  return date.length === 2 ? date : '0' + date
} 

/*
Monday only takes YYYY-MM-DD date format 
*/
const ExcelDateToJSDate = (date) => {
  if (date === undefined || date === 'Cabcekked' || date === ''){
    return null
  }
  const tempDate = new Date((date - 25568)*86400*1000);
  const year = tempDate.getFullYear()
  const month = makeTwoDigitDateElement(tempDate.getMonth() + 1 )
  const newDate = makeTwoDigitDateElement(tempDate.getMonth())
  return `${year}-${month}-${newDate}`
}

/*
Monday Server cannot take double quote.
Therefore, need escape.
*/
const parsableDoubleQuote = (data) => {
  const dqRegex = /"/g;
  data = typeof(data) === "number" ? data.toString() : data
  return data.replace(dqRegex, '\\"')
}

const numberToString = (data) => {
  return typeof data === "number" ? data.toString() : data
}

export const getLocalDataWithConfiguration = (localData, configuration) => {
  return configuration.map(eachConf => makeLocalDataWithConf(localData, eachConf))
} 