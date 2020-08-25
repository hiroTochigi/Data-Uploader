import { isCompositeComponent } from "react-dom/test-utils";

const getMondayTitle = (csv_title, connectList) => {
    try{
        if (!connectList[csv_title]){
            throw new SyntaxError(`No ${csv_title} key`)
        }
        return connectList[csv_title]
    }
    catch (err){
        if (err instanceof SyntaxError) {
        } else {
            throw err; // rethrow (*)
        }
    }
}

const findColumnInConnectList = (col, connectList) => {
    for (const data in connectList){
        if (connectList[data] === col['title'])
            return true
    }
    return false
}

const addHeaderData = (colData, header, connectList) => {
    for (let i=0; header.length > i ;i++ ){
        if (colData["title"] === getMondayTitle(header[i], connectList)){
            colData["csv_position"] = i
            colData["csv_title"] = header[i]
            console.log(colData)
            return colData
        }
    }
    return false
}

const makeLabels = (obj) => {
    const preLabels = JSON.parse(obj).labels 
    if (!Array.isArray(preLabels)){
        return Object.keys(preLabels).reduce((ret, key) => {
            ret[preLabels[key]] = key;
            return ret;
        }, {});
    }else{
        return preLabels.reduce((labels, el) => {
            labels[el['name']] = el['id']
            return labels
        } , {})
    }
}

const makeFlipedLabels = (obj) => {
    obj = JSON.parse(obj)
    const preLabels = obj.labels
    return Array.isArray(preLabels) ? 
    preLabels.reduce((labels, el) => {
        labels[el['id']] = el['name'] 
        return labels
      } , {})  
    : 
    (preLabels === undefined) ? {} : preLabels
        
}

const takeLabels = (data) =>{
    console.log(data)
    if (data["type"] === "color" || data["type"] === "dropdown"){
        data["labels"] = makeLabels(data["settings_str"])
        data["flipLabels"] = makeFlipedLabels(data["settings_str"])
    }else{
        data['labels'] = {};
    }
    return data
}

const isWrongConf = (mondayColumnsInConnectListWithHeader) => {
    console.log(mondayColumnsInConnectListWithHeader)
    return mondayColumnsInConnectListWithHeader.every(el => el !== false)
}

const addJsonIndex = (mondayColumns) => {
    mondayColumns.forEach((data, index)=>  index === 0 ? data['json_index'] = null : data['json_index'] = index-1)
    return mondayColumns
}

export const makeConfiguration = (header, mondayColumns, setHaveConf, connectList) => {
    if ( header === null){
        console.log("Upload Excel File")
        setHaveConf(false)
    }else{
        const mondayColumnsWithIndex = addJsonIndex(mondayColumns)
        const mondayColumnsInConnectList = mondayColumnsWithIndex.filter(col => findColumnInConnectList(col, connectList))
        const mondayColumnsInConnectListWithHeader = mondayColumnsInConnectList.map(data => addHeaderData(data, header, connectList))
        console.log(isWrongConf(mondayColumnsInConnectListWithHeader))
        if (isWrongConf(mondayColumnsInConnectListWithHeader)){
            setHaveConf(false)
            console.log(mondayColumnsInConnectList)
            return mondayColumnsInConnectList
        }
        const configuration = mondayColumnsInConnectListWithHeader.map(data => takeLabels(data))
        setHaveConf(true)
        console.log(configuration)
        return configuration
    }
}