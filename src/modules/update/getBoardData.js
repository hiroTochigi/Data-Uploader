import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export const getBoardData = (boardId, mondayJsonIndex, connectList, connectIds) => {
  return new Promise((resolve, reject) => {
    monday
    .api(`query { boards(ids:[${boardId}]) { items { name, id, group{ id }, column_values { id, value } } }}`)
    .then((res) => {
      const boardAllItems = res.data.boards[0].items;
      const boardDic =  boardAllItems.reduce((mondayData, item) => {
        mondayData[item['id']] = item;
        mondayData[item['id']]['ids'] =  makeMondayIds(item, connectIds, mondayJsonIndex, connectList)
        mondayData[item['id']]['data'] = collectMondayData(item, mondayJsonIndex, connectList)
        return mondayData
      }, {})
        resolve(boardDic)
    })
  }) 
}

const makeMondayIds = (item, connectIds, mondayJsonIndex, connectList) => {
  return connectIds.reduce((mondayIds, connectId) => {
    const mondayTitle = connectList[connectId]
    mondayIds[connectId] =  getJsonData(item, mondayTitle, mondayJsonIndex)
    return mondayIds
  }, {})
}

const collectMondayData = (item, mondayJsonIndex, connectList) => {
  return Object.keys(connectList).reduce((dataList, title) => {
    dataList[title] = getJsonData(item, connectList[title], mondayJsonIndex)
    return dataList
  }, {})
}

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