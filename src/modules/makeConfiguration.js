import { CONNECT_LIST } from '../globalConf'

const getMondayTitle = (csv_title) => {
    try{
        if (!CONNECT_LIST[csv_title]){
            throw new SyntaxError(`No ${csv_title} key`)
        }
        return CONNECT_LIST[csv_title]
    }
    catch (err){
        if (err instanceof SyntaxError) {
            console.log( "JSON Error: " + err.message );
        } else {
            throw err; // rethrow (*)
        }
    }
}

const findColumnInConnectList = (col) => {
    for (const data in CONNECT_LIST){
        if (CONNECT_LIST[data] === col['title'])
            return true
    }
    return false
}

const addHeaderData = (colData, header) => {
    for (let i=0; header.length > i ;i++ ){
        if (colData["title"] === getMondayTitle(header[i])){
            colData["csv_position"] = i
            colData["csv_title"] = header[i]
            return colData
        }
    }
    console.log('something wrong')
    return colData
}

const flipKeyValue = (obj) => {
    obj = JSON.parse(obj)
    obj = obj.labels
    if (!Array.isArray(obj)){
        return Object.keys(obj).reduce((ret, key) => {
            ret[obj[key]] = key;
            return ret;
        }, {});
    }else{
        console.log(obj)
        return obj.reduce((labels, el) => {
            labels[el['name']] = el['id']
            return labels
        } , {})
    }
}

const takeLabels = (data) =>{
    if (data["type"] === "color" || data["type"] === "dropdown"){
        data["labels"] = flipKeyValue(data["settings_str"])
    }else{
        data['labels'] = {};
    }
    return data
}


export const makeConfiguration = (header, mondayColumns, setHaveConf) => {
    if ( header === null){
        console.log("Upload Excel File")
        setHaveConf(false)
    }else{
        const mondayColumnsInConnectList = mondayColumns.filter(col => findColumnInConnectList(col))
        const mondayColumnsInConnectListWithHeader = mondayColumnsInConnectList.map(data => addHeaderData(data, header[0]))
        const configuration = mondayColumnsInConnectListWithHeader.map(data => takeLabels(data))
        console.log(configuration)
        setHaveConf(true)
        return configuration
        
    }
}


