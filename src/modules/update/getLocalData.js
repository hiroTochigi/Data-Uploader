

const makeLocalDataWithConf = (localData, confData) => {
    
}

export const getLocalDataWithConfiguration = (localData, configuration) => {
    return configuration.map(eachConf => makeLocalDataWithConf(localData, eachConf))
} 