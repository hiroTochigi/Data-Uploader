import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export const getBoardData = (boardIds) => {
    return new Promise((resolve, reject) => {
        monday
        .api(`query { boards(ids:[${boardIds}]) { items { name, id, group{ id }, column_values { id, value } } }}`)
        .then((res) => {
          const boardAllItems = res.data.boards[0].items;
          let boardDic =  boardAllItems.reduce((mondayData, item) => {
              mondayData[item['id']] = item;
              return mondayData
          }, {})
          resolve(boardDic)
        })
  }) 
}


