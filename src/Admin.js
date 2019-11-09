import React, { useEffect, useState } from "react";
import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const pipeTypeToImage = {
  pipe2: "https://images-na.ssl-images-amazon.com/images/I/51YAw0xjeFL._SX466_.jpg",
  pipe3: "https://images-na.ssl-images-amazon.com/images/I/51YAw0xjeFL._SX466_.jpg",
  pipe5: "https://images-na.ssl-images-amazon.com/images/I/51YAw0xjeFL._SX466_.jpg",
  pipe7: "https://images-na.ssl-images-amazon.com/images/I/51YAw0xjeFL._SX466_.jpg",
  pipe90:
    "https://images.homedepot-static.com/productImages/30ce963e-181e-4659-97b7-947c40533f05/svn/white-dura-pvc-fittings-406-080-64_1000.jpg",
  pipet: "https://mobileimages.lowes.com/product/converted/611942/611942124589.jpg?size=xl",
  pipecap:
    "https://images.homedepot-static.com/productImages/1251b43b-d36d-40ba-b060-9d00ab5c7de1/svn/white-charlotte-pipe-pvc-fittings-pvc021161000hd-64_1000.jpg",
  pipecon: "https://mobileimages.lowes.com/product/converted/052063/052063444055.jpg?size=xl"
};

const pipeTypeToText = {
  pipe2: "2 Inch Pipe",
  pipe3: "3 Inch Pipe",
  pipe5: "5 Inch Pipe",
  pipe7: "7 Inch Pipe",
  pipe90: "90-Degree Elbow",
  pipet: "Tee Connector",
  pipecap: "Cap",
  pipecon: "Coupling"
};

const Admin = (props) => {
  const [ purchases, setPurchases ] = useState([]);
  useEffect(() => {
    props.db.collection('purchases').get().then(pDocs => {
      setPurchases(pDocs.docs.map(p => ({ ...p.data(), id: p.id, ref: p.ref })))
    });
  }, [props.db]);

  const getPrice = (p) => {
    let total = 5;
    p.forEach(t => {
      total += t.quantity * 0.5;
    });
    return total;
  };

  const toCurrency = amount => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  const toDate = time => {
    const date = new Date(time)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const fullfill = p => {
    p.ref.update({ fullfilled: true }).then(() => {
      props.db.collection('purchases').get().then(pDocs => {
        setPurchases(pDocs.docs.map(p => ({ ...p.data(), id: p.id, ref: p.ref })))
      });
    })
  };

  return (
    <div className="admin-page-wrapper">
      {purchases.map((purchase, i) => purchase.fullfilled ? null : (
        <ExpansionPanel key={i}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <div className="expansion-summary">
              <Typography variant="h6" component="h4">
                {purchase.email}
            </Typography>
              <Typography variant="h6" component="h4">
                {toDate(purchase.dateSubmitted)}
            </Typography>
              <Typography variant="h6" component="h4">
                {toCurrency(getPrice(purchase.parts))}
            </Typography>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className="flex-column">
            <div className="panel-flex-wrapper">
              <div className="panel-address">
                <p className="customer-name">{`${purchase.fName} ${purchase.lName}`}</p>
                <p>{purchase.address}</p>
                <p>{`${purchase.city} ${purchase.state}, ${purchase.zip}`}</p>
              </div>
              <h2>{purchase.name}</h2>
            </div>
            {purchase.parts.map((part, j) => (
              <div className="admin-part-item" key={`part${j}`}>
                <div className="admin-part-details">
                  <p className="admin-part-quantity">{part.quantity}</p>
                  <div className="admin-part-image-wrapper">
                    <img src={pipeTypeToImage[part.pipeType]} alt="pipe" />
                  </div>
                </div>
                <p className="admin-part-name">{pipeTypeToText[part.pipeType]}</p>
              </div>
            ))}
            <Button
              onClick={() => fullfill(purchase)}
              type="submit"
              style={{ width: "40%", margin: "30px 0 15px", marginLeft: "30%" }}
              variant="contained"
              color="primary"
            >
              Fullfilled
          </Button>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
};

export default Admin;
