import mondaySdk from "monday-sdk-js";
import _ from "lodash"
import { CONNECT_LIST } from '../../globalConf'

const monday = mondaySdk();

const getJsonData = (item, title, mondayJsonIndex) => {
  if (title === "Name"){
    return item['name'].toString()
  }

  const value = item['column_values'][mondayJsonIndex[title]['json_index']]['value']
  const dataType = mondayJsonIndex[title]['type']

  if (value === null || value === undefined || value === '' ){
    return ""
  }else if(dataType === 'color'){
    let newValue = JSON.parse(value)
    return newValue['index'].toString()
  }else if(dataType === 'date'){
    let newValue = JSON.parse(value)
    return newValue['date']
  }else if(dataType === 'long-text'){
    let newValue = JSON.parse(value)
    return newValue['text']
  }else{
    return JSON.parse(value)
  }
}

export const getBoardData = (boardIds, mondayJsonIndex) => {
  return new Promise((resolve, reject) => {
    monday
    .api(`query { boards(ids:[${boardIds}]) { items { name, id, group{ id }, column_values { id, value } } }}`)
    .then((res) => {
      const boardAllItems = res.data.boards[0].items;
      let boardDic =  boardAllItems.reduce((mondayData, item) => {
        mondayData[item['id']] = item;
        mondayData[item['id']]['ids'] =  makeMondayIds(item, 'Name', mondayJsonIndex)
        mondayData[item['id']]['data'] = collectMondayData(item, mondayJsonIndex)
        return mondayData
      }, {})
        resolve(boardDic)
    })
  }) 
}

const makeMondayIds = (item, title, mondayJsonIndex) => {
  return {'id': getJsonData(item, title, mondayJsonIndex)}
}

const collectMondayData = (item, mondayJsonIndex) => {
  return Object.keys(CONNECT_LIST).reduce((dataList, title) => {
    dataList[title] = getJsonData(item, CONNECT_LIST[title], mondayJsonIndex)
    return dataList
  }, {})
}

