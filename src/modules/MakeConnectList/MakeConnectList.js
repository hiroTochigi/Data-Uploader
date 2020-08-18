import React, { Component } from 'react';
import ConfButtonContainers from "./ConfButtonContainers"
import ChooseHeaderIndex from "./ChooseHeaderIndex"

class MakeConnectList extends Component {
  constructor(props){
    super(props);
    this.state={
      isEditMode: true,
      isDeleteMode: false,
      isOpenTrashCan: false,
      confedHeaders: {},
      preConfHeader: '',
      trashCan: [],
    }
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
