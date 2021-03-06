import React, { Component } from "react";
import Aux from "../../hoc/Auxilary/Auxilary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import axios from "../../axios-orders";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from 'react-redux';
import * as actions from '../../store/action/index';


class BurgerBuilder extends Component {
  state = {
    purchasing: false
  };
  componentDidMount() {
    console.log(this.props);
    this.props.onInitIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }
 
  purchaseHandler = () => {
    if(this.props.isAuthenticated){
      this.setState({ purchasing: true });
    }else{
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };
  purchaseContinueHandler = () => {
    //alert('order placed successfully!!');
  //  const queryParams =[];
  //  for (const key in this.state.ingredients) {
  //      queryParams.push(encodeURIComponent(key)+ '=' + encodeURIComponent(this.state.ingredients[key]));
  //  }
  //   queryParams.push('price=' + this.state.totalPrice)
  //  const queryString = queryParams.join('&');
  //   this.props.history.push({
  //       pathname : '/checkout',
  //       search : '?' + queryString
  //   });
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  };
  render() {
    const disableInfo = {
      ...this.props.ings,
    };
    for (const key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = this.props.error ? (
      <p>Burger ingredients failed to load !!</p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disableInfo}
            price={this.props.price}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            isAuth ={this.props.isAuthenticated}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          purchasedCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          ingredients={this.props.ings}
          price={this.props.price}
        />
      );
    }
   
    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>

        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
      ings : state.burgerBuilder.ingredients,
      price : state.burgerBuilder.totalPrice,
      error : state.burgerBuilder.error,
      isAuthenticated : state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    onIngredientAdded : (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved : (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients : () => dispatch(actions.initIngredients()),
    onInitPurchase : () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
