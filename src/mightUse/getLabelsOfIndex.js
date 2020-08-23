/*
Translate label to index with error handling
Error handling for columns configuration
Two type of error
1. No column title
2. No label in the column
Write warning on the log (future implementation)
Either error return null
*/
const getLabelsOfIndex = (configuration, columnTitle, labelData) => {
  let targetConfLabels = null
  for (const conf of configuration){
    if (conf['title'] === columnTitle){
      targetConfLabels = conf['labels']
      break
    }
  }

  if(!targetConfLabels) {
    console.log(`There is no ${columnTitle} column on Monday`)
      return null
  }

  return targetConfLabels[labelData] !== undefined ? targetConfLabels[labelData] : 
  function(){
    console.log(`There is no ${labelData} labels on ${columnTitle} column`)
    return null
  }() 
}