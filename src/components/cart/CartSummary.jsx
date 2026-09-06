import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const CartSummary = ({ subtotal }) => {

    

  return (
    <>
      <div>Here is the subtotal prop: ${formatPrice(subtotal)}</div>
    </>
  );
};

export default CartSummary;
