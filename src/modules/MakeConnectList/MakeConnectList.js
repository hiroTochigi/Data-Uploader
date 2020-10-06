import React, { Component } from 'react';
import ConfButtonContainers from "./ConfButtonContainers"
import ChooseHeaderIndex from "./ChooseHeaderIndex"

class MakeConnectList extends Component {
  constructor(props){
    super(props);
  }

  doesNeedMakeObj = (confedHeaders) => {
    if (confedHeaders.length === 0){
      return true 
    }else{
      return confedHeaders.every(conf => conf.local !== null || conf.monday !== null)
    }
  }

  getHeader = (header) => {
    const confedHeaders = this.state.confedHeaders
    if (this.doesNeedMakeObj(confedHeaders)){
      /*make obj 
      {
        local: null
        monday: null
      }

      */
    }
    this.setState({})
  }

render() {
const  {mondayColumns,
        localItemList,
        headerIndex,
        getHeaderIndex,
      } = this.props

  return (
    headerIndex === null ?
    <ChooseHeaderIndex 
      localItemList={localItemList}
      getHeaderIndex={getHeaderIndex}
    />
    :
    <ConfButtonContainers 
      localItemList={localItemList}
      mondayColumns={mondayColumns}
      headerIndex={headerIndex}
    />
    )
  }
}
export default MakeConnectList;
