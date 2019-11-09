import React, { Component } from "react";
import { Redirect } from "react-router";
import { Paper, Typography, TextField } from "@material-ui/core";
import cartData from "./data";

class Checkout extends Component {
  render() {
    const carts = this.props.location.state;

    const pipeNames = {
      pipe2: "2 Inch Pipe",
      pipe3: "3 Inch Pipe",
      pipe5: "5 Inch Pipe",
      pipe7: "7 Inch Pipe",
      pipe90: "90-Degree Elbow",
      pipet: "Tee Connector",
      pipecap: "Cap",
      pipecon: "Coupling"
    };

    const pipeImages = {
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

    const getPipeName = pipe => {
      return pipeNames[pipe];
    };

    const getPipeImage = pipe => {
      return pipeImages[pipe];
    };

    const getSubtotal = () => {
      let subtotal = 0;
      carts.parts.map(item => {
        subtotal += item.quantity;
      });
      return toCurrency(subtotal);
    };

    const toCurrency = amount => {
      amount *= 0.5;
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    };

    return (
      <div className="checkout-mainContent">
        <div className="checkout-leftContent">
          <Paper>
            <div className="cart-content">
              <Typography variant="h5" component="h3">
                Items in your Kit
              </Typography>
              <div className="cart-header">
                <p className="cart-heading">Item</p>
                <div className="end-items-heading">
                  <p className="cart-heading cart-quantity">Qty</p>
                  <p className="cart-heading item-total">Item Total</p>
                </div>
              </div>
              {carts.parts.map(item => {
                if (item.quantity > 0) {
                  return (
                    <div key={item.pipeType} className="cart-item">
                      <div className="cart-item-details">
                        <div className="cart-item-image-wrapper">
                          <img src={getPipeImage(item.pipeType)} />
                        </div>
                        <p className="cart-item-name">{getPipeName(item.pipeType)}</p>
                      </div>
                      <div className="end-items">
                        <p className="cart-quantity">{item.quantity}</p>
                        <p className="item-total">{toCurrency(item.quantity)}</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </Paper>
        </div>
        <div className="checkout-rightContent">
          <Paper>
            <div className="item-subtotal">
              <Typography variant="h5" component="h3">
                Subtotal
              </Typography>
              <Typography variant="h5" component="h3">
                {getSubtotal()}
              </Typography>
            </div>
            <form className="checkout-form">
              <div className="defaultFlex">
                <div className="text-field-left">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    className="textField"
                    label="First Name"
                    margin="normal"
                    variant="outlined"
                  />
                </div>
                <div className="text-field-right">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    className="textField"
                    label="Last Name"
                    margin="normal"
                    variant="outlined"
                  />
                </div>
              </div>
              <TextField
                fullWidth
                id="outlined-basic"
                className="textField"
                label="Email"
                margin="normal"
                variant="outlined"
              />
              <TextField
                fullWidth
                id="outlined-basic"
                className="textField"
                label="Shipping Address"
                margin="normal"
                variant="outlined"
              />
              <div className="defaultFlex">
                <div className="text-field-left">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    className="textField"
                    label="City"
                    margin="normal"
                    variant="outlined"
                  />
                </div>
                <div className="text-field-center">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    className="textField"
                    label="State"
                    margin="normal"
                    variant="outlined"
                  />
                </div>
                <div className="text-field-right">
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    className="textField"
                    label="Zip Code"
                    margin="normal"
                    variant="outlined"
                  />
                </div>
              </div>
            </form>
          </Paper>
        </div>
        {!carts || (carts && carts.parts.length === 0) ? <Redirect to={{ pathname: "/edit" }} /> : null}
      </div>
    );
  }
}

export default Checkout;
