import React from "react";
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Admin = () => (
  <div className="admin-page-wrapper">
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <div className="expansion-summary">
          <Typography variant="h6" component="h4">
            charlie@brown.com
          </Typography>
          <Typography variant="h6" component="h4">
            November 5, 2019
          </Typography>
          <Typography variant="h6" component="h4">
            $3.50
          </Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="flex-column">
        <div className="panel-flex-wrapper">
          <div className="panel-address">
            <p className="customer-name">Charlie Brown</p>
            <p>1234 Fake Street</p>
            <p>City, State, Zip</p>
          </div>
          <h2>White Cannon</h2>
        </div>
        <div className="admin-part-item">
          <div className="admin-part-details">
            <p className="admin-part-quantity">3</p>
            <div className="admin-part-image-wrapper">
              <img src="https://images-na.ssl-images-amazon.com/images/I/51YAw0xjeFL._SX466_.jpg" alt="pipe" />
            </div>
          </div>
          <p className="admin-part-name">Inch Pipe</p>
        </div>

        <div className="admin-part-item">
          <div className="admin-part-details">
            <p className="admin-part-quantity">1</p>
            <div className="admin-part-image-wrapper">
              <img
                src="https://images.homedepot-static.com/productImages/30ce963e-181e-4659-97b7-947c40533f05/svn/white-dura-pvc-fittings-406-080-64_1000.jpg"
                alt="pipe"
              />
            </div>
          </div>
          <p className="admin-part-name">90-Degree Elbow</p>
        </div>
        <Button
          type="submit"
          style={{ width: "40%", margin: "30px 0 15px", marginLeft: "30%" }}
          variant="contained"
          color="primary"
        >
          Fullfilled
        </Button>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

export default Admin;
