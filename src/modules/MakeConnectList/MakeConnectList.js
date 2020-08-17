import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import ConfButton from "./ConfButton"
import ConfButtonContainers from "./ConfButtonContainers"
import ChooseHeaderIndex from "./ChooseHeaderIndex"

class MakeConnectList extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

render() {
const  {mondayColumns, localItemList, headerIndex, getHeaderIndex} = this.props
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
    />

    )

  }
}
export default MakeConnectList;
