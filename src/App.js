import React, { Component } from 'react';
import mondaySdk from "monday-sdk-js";
import './App.css';
import ExcelTaker from './ExcelTaker'
import { Jumbotron } from 'reactstrap';
import { makeConfiguration } from './modules/makeConfiguration'

const monday = mondaySdk();

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      haveConnectList: true,
      haveConf: false,
      settings: {},
      context: {},
      boards: [],
      mondayColumns: [],
      configuration: [],
      rows: null,
    }
  }

  componentDidMount() {
    monday.listen("context", this.getContext);
  }

  getContext = (res) => {
    const context = res.data;
    console.log("context!", context);
    this.setState({ context });

    const boardIds = context.boardIds || [context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { columns { title, type, settings_str, id } }}`)
      .then((res) => {
        this.setState({ mondayColumns: res.data.boards[0].columns }, () => {
          console.log(res.data.boards[0].columns)
        });
      });
  };

  getRows = (rows) => {
    this.setState({rows})
  }

  setHaveConf = (val) => {
    this.setState({haveConf:val})
  }

  setConfiguration = (rows, mondayColumns, setHaveConf) => {
    this.setState({configuration:makeConfiguration(rows, mondayColumns, setHaveConf)})
  }

  render() {
    const { rows, mondayColumns, haveConf } = this.state;
    
    return (
      <div>
        <div>
          <Jumbotron className="jumbotron-background">          
              <h1 className="display-3">react-excel-renderer</h1>
              <p className="lead">Welcome to the demo of react-excel-renderer.</p>                        
              <hr className="my-2" />
          </Jumbotron>
        </div>
        <ExcelTaker
          getRows={this.getRows}
          setConfiguration={this.setConfiguration} 
          mondayColumns={mondayColumns}
          setHaveConf={this.setHaveConf}
          />
      </div>
    );
  }
}

/*
<InputGroupAddon addonType="prepend">
  <Button color="info" style={{color: "white", zIndex: 0}} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Browse&hellip;</Button>
  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }} style={{"padding":"10px"}} />                                
</InputGroupAddon>
*/

export default App;

/*
`query { boards(ids:[${boardIds}]) { items { name, id, group{ id }, column_values { id, value } } }}` take all board items with data
*/

/*
0: {title: "Name", type: "name", settings_str: "{}", pos: null, id: "name"}
1: {title: "Subitems", type: "subtasks", settings_str: "{"allowMultipleItems":true,"itemTypeName":"column.…splayType":"BOARD_INLINE","boardIds":[645356584]}", pos: null, id: "subitems7"}
2: {title: "Customer", type: "text", settings_str: "{}", pos: null, id: "customer"}
3: {title: "REFERENCE#", type: "text", settings_str: "{}", pos: null, id: "reference_"}
4: {title: "Projected Completion", type: "date", settings_str: "{"show_current_year":true}", pos: null, id: "projected_completion"}
5: {title: "CAT#", type: "formula", settings_str: "{"formula":"LEFT({acs_part_}, 3)"}", pos: null, id: "formula"}
6: {title: "3rd Item Number", type: "text", settings_str: "{}", pos: null, id: "acs_part_"}
7: {title: "BOM Updated Date", type: "date", settings_str: "{"hide_footer":false}", pos: null, id: "date6"}
8: {title: "Full Item Description", type: "long-text", settings_str: "{}", pos: null, id: "long_text2"}
9: {title: "WO DESCRIPTION", type: "text", settings_str: "{}", pos: null, id: "wo_description"}
10: {title: "QTY", type: "numeric", settings_str: "{}", pos: null, id: "qty"}
11: {title: "PARENT WO#", type: "text", settings_str: "{}", pos: null, id: "parent_wo_1"}
12: {title: "Order Date", type: "date", settings_str: "{"show_current_year":true}", pos: null, id: "order_date"}
13: {title: "Release Date", type: "date", settings_str: "{"show_current_year":true}", pos: null, id: "date"}
14: {title: "Received Date", type: "date", settings_str: "{"show_current_year":true}", pos: null, id: "date3"}
15: {title: "Revised Part List Date", type: "date", settings_str: "{"show_current_year":true}", pos: null, id: "order_date9"}
16: {title: "BOM Changed?", type: "color", settings_str: "{"labels":{"1":"No","2":"Changed"},"labels_positions_v2":{"1":0,"2":2,"5":1}}", pos: null, id: "status_15"}
17: {title: "ALL PARTS ORDERED", type: "color", settings_str: "{"labels":{"1":"True","2":"False","5":"","17":"Inv…"labels_positions_v2":{"1":0,"2":2,"5":1,"17":3}}", pos: null, id: "status6"}
18: {title: "ALL PARTS RCVD", type: "color", settings_str: "{"done_colors":[1],"color_mapping":{"3":3,"6":6},"…ions_v2":{"0":0,"1":1,"2":2,"3":5,"5":3,"103":4}}", pos: null, id: "status2"}
19: {title: "ASSEMBLY", type: "color", settings_str: "{"done_colors":[1],"color_mapping":{"0":16,"2":12,…v2":{"0":0,"1":1,"2":2,"3":5,"5":3,"7":4,"10":6}}", pos: null, id: "status4"}
20: {title: "QC/TESTING", type: "color", settings_str: "{"done_colors":[1],"color_mapping":{"0":16,"2":12,…v2":{"0":0,"1":1,"2":2,"5":3,"7":4,"9":5,"10":6}}", pos: null, id: "status0"}
21: {title: "Status", type: "color", settings_str: "{"done_colors":[19],"color_mapping":{"0":9,"1":19,…2":{"0":0,"1":1,"2":4,"3":5,"5":3,"12":6,"19":2}}", pos: null, id: "status"}
22: {title: "On Hold Causes", type: "dropdown", settings_str: "{"hide_footer":false,"labels":[{"id":1,"name":"Tag…me":"BOM change"},{"id":5,"name":"Parts Delay"}]}", pos: null, id: "unsafe_closed_causes"}
23: {title: "Close Safely?", type: "color", settings_str: "{"labels":{"1":"Safe","5":"","9":"Caution","11":"W…"labels_positions_v2":{"1":0,"5":1,"9":3,"11":2}}", pos: null, id: "status_1"}
24: {title: "Unsafe Closed Causes", type: "dropdown", settings_str: "{"hide_footer":false,"labels":[{"id":1,"name":"No …locks on test"},{"id":5,"name":"Partial Issue"}]}", pos: null, id: "dropdown"}
25: {title: "Closed Date", type: "date", settings_str: "{}", pos: null, id: "date4"}
*/