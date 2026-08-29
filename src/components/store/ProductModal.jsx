import React from 'react'
import { formatPrice } from '../../utils/formatPrice'

const ProductModal = ({product}) => {

  return (
    <>
        <div id='main' className='flex flex-col items-center border p-4 rounded-lg shadow-sm w-64 text-center'>
            <div>image</div>

            <div>{product.name}</div>

            <div>{product.description}</div>

            <div>
                ${formatPrice(product.price)}
            </div>

            <button className='border border-2 bg-blue-200 px-4 py-1 rounded hover:bg-blue-300'>Add to Cart</button>

        </div>
    </>
  )
}

export default ProductModal