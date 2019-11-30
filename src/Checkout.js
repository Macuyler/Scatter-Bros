import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Redirect } from "react-router";
import { Paper, Typography, TextField, Button, Modal, CircularProgress } from "@material-ui/core";
import { Elements, injectStripe, CardElement } from 'react-stripe-elements';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fName: "",
      lName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isProcessing: false,
      errors: {}
    };
    this.getToken = this.getToken.bind(this);
  }

  getToken = async (e) => {
    e.preventDefault();
    const { errors } = this.state;
    let inputIsValid = true;
    ['fName', 'lName', 'email', 'address', 'city', 'state', 'zip'].forEach(field => {
      if (this.state[field].length <= 0) {
        inputIsValid = false;
        errors[field] = 'Field cannot be blank';
      } else delete errors[field];
    });
    if (inputIsValid) {
      this.setState({ isProcessing: true });
      const { token, error } = await this.props.stripe.createToken({ name: 'Name' });
      if (error) {
        errors.stripe = error.message;
        this.setState({ errors, isProcessing: false });
      } else {
        this.setState({ errors });
        this.props.handleSubmit(token, this.state, () => { this.setState({ isProcessing: false }) });
      }
    } else {
      this.setState({ errors });
    }
  };

  render() {
    return (
      <form className="checkout-form" onSubmit={this.getToken}>
        <p style={{ width: '100%', margin: 0, color: 'red' }}>{
          (Object.keys(this.state.errors).length > 0 && !this.state.errors.stripe) || (Object.keys(this.state.errors).length > 1) ?
            'All fields must be filled out!' : null
        }</p>
        <div className="default-flex">
          <div className="text-field-left">
            <TextField
              fullWidth
              id="outlined-basic"
              className="textField"
              label="First Name"
              margin="normal"
              variant="outlined"
              error={this.state.errors.fName ? true : false}
              value={this.state.fName}
              onChange={e => this.setState({ fName: e.target.value })}
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
              error={this.state.errors.lName ? true : false}
              value={this.state.lName}
              onChange={e => this.setState({ lName: e.target.value })}
            />
          </div>
        </div>
        <TextField
          fullWidth
          id="outlined-basic"
          className="text-field"
          label="Email"
          margin="normal"
          variant="outlined"
          color="secondary"
          error={this.state.errors.email ? true : false}
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
        />
        <TextField
          fullWidth
          id="outlined-basic"
          className="text-field"
          label="Shipping Address"
          margin="normal"
          variant="outlined"
          error={this.state.errors.address ? true : false}
          value={this.state.address}
          onChange={e => this.setState({ address: e.target.value })}
        />
        <div className="default-flex">
          <div className="text-field-left">
            <TextField
              fullWidth
              id="outlined-basic"
              className="textField"
              label="City"
              margin="normal"
              variant="outlined"
              color="secondary"
              error={this.state.errors.city ? true : false}
              value={this.state.city}
              onChange={e => this.setState({ city: e.target.value })}
            />
          </div>
          <div className="text-field-center">
            <TextField
              fullWidth
              id="outlined-basic"
              className="textField"
              label="State"
              margin="normal"
              color="secondary"
              variant="outlined"
              error={this.state.errors.state ? true : false}
              value={this.state.state}
              onChange={e => this.setState({ state: e.target.value })}
            />
          </div>
          <div className="text-field-right" style={{ marginBottom: 20 }}>
            <TextField
              fullWidth
              id="outlined-basic"
              className="textField"
              label="Zip Code"
              margin="normal"
              color="secondary"
              variant="outlined"
              error={this.state.errors.zip ? true : false}
              value={this.state.zip}
              onChange={e => this.setState({ zip: e.target.value })}
            />
          </div>
        </div>
        <p style={{ marginBottom: 10, marginTop: 0, color: 'red' }}>{this.state.errors.stripe}</p>
        <CardElement />
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button type="submit" style={{ width: '40%' }} disabled={this.state.isProcessing} variant="contained" color="primary">Submit</Button>
          {this.state.isProcessing && <CircularProgress size={26} style={{ marginTop: '-31px' }} />}
        </div>
      </form>
    )
  }
}
const StripeFrom = injectStripe(Form);

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      token: null,
      checkoutError: '',
      price: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(token, data, callback) {
    const { parts, name } = this.props.location.state;
    const { fName, lName, email, address, city, state, zip } = data;
    let total = 5;
    parts.forEach(p => total += p.quantity * 0.5);
    if (token) {
      fetch('http://localhost:9000/buy', {
        method: 'POST',
        body: JSON.stringify({
          token: token.id,
          price: total
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then((res) => {
          if (res.status === 200) {
            const { id, paid, receipt_url } = res;
            callback();
            this.props.db
              .collection('purchases')
              .doc()
              .set({ fName, lName, email, address, city, state, zip, parts, name, dateSubmitted: Date.now(), charge: { id, paid, receipt_url } })
              .then(() => this.setState({ showModal: true }))
              .catch(err => console.log(err));
            window.open(receipt_url, '_blank');
          } else {
            console.log(res);
            callback();
            this.setState({ showModal: true, checkoutError: 'Payment process failed! Your card has not been charged, and your order will not be processed. Please try again later.' });
          }
        })
        .catch(err => {
          console.log(err);
          callback();
          this.setState({ showModal: true, checkoutError: 'Failed to reach our payment servers, your card has not been charged, please try again later.' });
        })
    }
  }

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
      carts.parts.forEach(item => {
        subtotal += item.quantity;
      });
      return subtotal;
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
                          <img src={getPipeImage(item.pipeType)} alt="pipe" />
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
                return null;
              })}
            </div>
          </Paper>
        </div>
        <div className="checkout-rightContent">
          <Paper>
            <div className="item-subtotal">
              <Typography variant="h6" component="h3">
                Subtotal
              </Typography>
              <Typography variant="h6" component="h3">
                {toCurrency(getSubtotal())}
              </Typography>
            </div>
            <div className="item-subtotal" style={{ paddingTop: 0, color: "#a9a9a9" }}>
              <Typography variant="h6" component="h3">
                Shipping <span style={{ fontSize: '0.75rem', marginLeft: 10 }}>($5.00 flat rate shipping anywhere in the US)</span>
              </Typography>
              <Typography variant="h6" component="h3">
                $5.00
              </Typography>
            </div>
            <div className="item-subtotal" style={{ paddingTop: 10 }}>
              <Typography variant="h5" component="h3">
                Grand Total
              </Typography>
              <Typography variant="h5" component="h3">
                {toCurrency(getSubtotal() + 10)}
              </Typography>
            </div>
            <Elements>
              <StripeFrom handleSubmit={this.handleSubmit} />
            </Elements>
          </Paper>
        </div>
        <Modal
          aria-labelledby="Successfully Placed your Order"
          aria-describedby="Your Purchase will be processed and shipped within 3-5 business days."
          open={this.state.showModal}
          onClose={() => {}}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          disableAutoFocus
        >
          <Paper style={{ width: '50%', height: 300, outline: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>{this.state.checkoutError ? 'Failed to Place your Order' : 'Successfully Placed your Order'}</h1>
            <p style={{ textAlign: 'center', marginTop: 0 }}>{this.state.checkoutError || 'Your Purchase will be processed and shipped within 3-5 business days.'}</p>
            {this.state.checkoutError ?
              <Button onClick={() => {
                this.setState({ showModal: false, checkoutError: false });
              }} variant="contained" color="primary" style={{ width: '30%', marginTop: 10 }}>Okay</Button> :
              <Button style={{ width: '30%', marginTop: 10 }} variant="contained" color="primary"><Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>Return to HomePage</Link></Button>}
          </Paper>
        </Modal>
        {!carts || (carts && carts.parts.length === 0) ? <Redirect to={{ pathname: "/edit" }} /> : null}
      </div>
    );
  }
}

export default Checkout;
