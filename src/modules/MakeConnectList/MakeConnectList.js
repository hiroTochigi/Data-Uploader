import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import ConfButton from "./ConfButton"
import ConfButtonContainers from "./ConfButtonContainers"

class MakeConnectList extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

render() {
const  {mondayColumns,localItemList} = this.props
console.log(mondayColumns)
console.log(localItemList)
  return (
    <ConfButtonContainers 
      localItemList={localItemList}
      mondayColumns={mondayColumns}
    />

    )

  }
}
export default MakeConnectList;
