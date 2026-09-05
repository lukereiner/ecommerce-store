import React from "react";

const CartSummary = () => {
  const calculateItemSubtotal = (quantity, price) => {
    const subTotal = price * quantity;
    return formatPrice(subTotal);
  };

  return <div>CartSummary</div>;
};

export default CartSummary;
