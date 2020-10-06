import React  from 'react';
import { Jumbotron } from 'reactstrap';

const Banner = (props) => {
    const {haveConnectList, haveConf} = props
    return(
        <div className='banner-box'>
          <Jumbotron className="jumbotron-background">          
          {
            haveConnectList ?
              <h1 className="display-3">Update Monday Board</h1>
              :
              <h1 className="display-3">Configuration</h1>
          }
              {
                haveConf ? 
                <p className="lead">Click Update Button</p>
                :  
                haveConnectList ?
                <p className="lead">Upload Excel file or CSV file</p>
                :
                null
              }                 
              <hr className="my-2" />
          </Jumbotron>
        </div>
    )
}

export default Banner;