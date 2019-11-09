import React, { Component } from "react";
import { Paper, Typography, TextField } from "@material-ui/core";
import cartData from "./data";

class Checkout extends Component {
  render() {
    console.log(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(5));

    function toCurrency(amount) {
      amount *= 0.5;
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    }

    return (
      <div className="checkout-mainContent">
        <div className="checkout-leftContent">
          <Paper>
            <div className="cart-content">
              <Typography variant="h5" component="h3">
                Shopping Cart
              </Typography>
              <div className="cart-header">
                <p className="cart-heading">Item</p>
                <div className="end-items-heading">
                  <p className="cart-heading cart-quantity">Qty</p>
                  <p className="cart-heading item-total">Item Total</p>
                </div>
              </div>
              {cartData.map(item => {
                if (item.qty > 0) {
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-details">
                        <div className="cart-item-image-wrapper">image</div>
                        <p className="cart-item-name" key={item.id}>
                          {item.name}
                        </p>
                      </div>
                      <div className="end-items">
                        <p className="cart-quantity">{item.qty}</p>
                        <p className="item-total">{toCurrency(item.qty)}</p>
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
            <form className="checkout-form">
              <TextField
                id="outlined-basic"
                className="textField"
                label="First Name"
                margin="normal"
                variant="outlined"
              />

              <TextField
                id="outlined-basic"
                className="textField"
                label="Last Name"
                margin="normal"
                variant="outlined"
              />
            </form>
          </Paper>
        </div>
      </div>
    );
  }
}

export default Checkout;
