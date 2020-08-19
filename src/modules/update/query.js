
export const makeItemCreationQuery = (localData, board_id) => {
  board_id = board_id.toString()
  const queryFirstPart = `mutation {create_item (board_id:${board_id}, group_id:topics, item_name:"${localData[0]['data']}",`
  const queryLastPart = `){id}}`
  const query = queryFirstPart + addColumnValues(localData, 'c') + queryLastPart
  return query
}

export const makeUpdateQuery = (data, id, board_id) => {
  console.log(board_id)
  board_id = board_id.toString()
  const queryFirstPart = `mutation {change_multiple_column_values (board_id:${board_id}, item_id:${id},`
  const queryLastPart = `){id}}`
  const query = queryFirstPart + addColumnValues(data, 'u') + queryLastPart
  return query
}

const addColumnValues = (localData, flag) => {
  //const firstColumnValues = 'column_values:{'
  //const closeColumnValues = '}'
  console.log(localData)
  const columnValues = localData.reduce((allData, data, index, list) => {
    if(flag === 'c' && data['id'] === 'name')
      return allData
    else if(index === list.length - 1){
      allData += `\\"${data['id']}\\":${changeDataForMonday(data)}`
      return allData
    }else{
      allData += `\\"${data['id']}\\":${changeDataForMonday(data)},`
      return allData
    }
  }, "")
  return `column_values:"{${columnValues}}"`
}

const changeDataForMonday = (data) => {
  if(data['type'] === 'date'){
      if(data['data'] !== null){
        return`{\\"date\\":\\"${data['data']}\\"}` 
    }
  }else if(data["type"] === "color"){
    return `{\\"index\\":${data['data']}}`
  }else if(data["type"] === "long-text"){
    return `{\\"text\\":\\"${data['data']}\\"}`
  }else{
    return `\\"${data["data"]}\\"`
  }
}