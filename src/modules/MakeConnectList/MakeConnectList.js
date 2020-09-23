import React, { Component } from 'react';
import ConfButtonContainers from "./ConfButtonContainers"
import ChooseHeaderIndex from "./ChooseHeaderIndex"
import { each } from 'lodash';

class MakeConnectList extends Component {
  constructor(props){
    super(props);
    this.state={
      isEditMode: true,
      isDeleteMode: false,
      isOpenTrashCan: false,
      confedHeaders: [],
      preConfHeader: '',
      trashCan: [],
    }
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

const {isEditMode,
       isDeleteMode,
       isOpenTrashCan,
       confedHeaders,
       preConfHeader,
       trashCan,
      } = this.state

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
      isEditMode={isEditMode}
      isDeleteMode={isDeleteMode}
      isOpenTrashCan={isOpenTrashCan}
      confedHeaders={confedHeaders}
      preConfHeader={preConfHeader}
      trashCan={trashCan}
    />

    )

  }
}
export default MakeConnectList;
