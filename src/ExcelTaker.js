import React, { Component } from 'react';
import './App.css';
import ExcelRenderer from './excel-renderer'
import { Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';

class ExcelTaker extends Component {
    constructor(props){
      super(props);
      this.state={
        isOpen: false,
        dataLoaded: false,
        isFormInvalid: false,
        uploadedFileName: '',
      }
      this.fileInput = React.createRef();
      this.getRows = props.getRows.bind(this);
      this.setConfiguration = props.setConfiguration.bind(this)
      this.setHaveConf=props.setHaveConf.bind(this)
    }

    renderFile = (fileObj, fileName) => {
        //just pass the fileObj as parameter
        const {uploadedFileName} = this.state;
        const {mondayColumns, setHaveConf} = this.props;
        ExcelRenderer(fileObj, (err, resp) => {
          if(err){
            console.log(err);            
          }
          else{
            this.setState({
              dataLoaded: true,
            });
            this.getRows(resp.rows)
            if (uploadedFileName !== fileName){
                this.setConfiguration(resp.rows, mondayColumns, setHaveConf)
            }
          }
        }); 
    }

    //let fileObj = event.target.files[0];
    fileHandler = (event) => {   
      if(event.target.files){
        let fileObj = event.target.files[0];
        let fileName = fileObj.name;
        
        //check for file extension and pass only if it is .xlsx and display error message otherwise
        const fileExtention = fileName.slice(fileName.lastIndexOf('.')+1)
        if(fileExtention === "xlsx" || fileExtention === "xls" || fileExtention === "ods" || fileExtention === "csv"){
          this.setState({
            uploadedFileName: fileName,
            isFormInvalid: false
          });
          this.renderFile(fileObj, fileName)
        }    
        else{
          this.setState({
            isFormInvalid: true,
            uploadedFileName: ""
          })
        }
      }               
    }
  
    toggle = () => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  
    openFileBrowser = () => {
      this.fileInput.current.click();
    }
  
    render() {
      return (
        <div>
          <Container>
          <form>
            <FormGroup row>
              <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload</Label>          
              <Col xs={4} sm={8} lg={10}>                                                     
                <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Button color="info" style={{color: "white", zIndex: 0}} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Browse&hellip;</Button>
                  <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event)=> { event.target.value = null }} style={{"padding":"10px"}} />                                
                </InputGroupAddon>
                  <Input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} />                                              
                  <FormFeedback>    
                    <Fade in={this.state.isFormInvalid} tag="h6" style={{fontStyle: "italic"}}>
                      Please select .xls, .xlsx, and .csv file only !
                    </Fade>                                                                
                  </FormFeedback>
                </InputGroup>     
              </Col>                                                   
            </FormGroup>   
          </form>
  
          </Container>
        </div>
      );
    }
  }

export default ExcelTaker;