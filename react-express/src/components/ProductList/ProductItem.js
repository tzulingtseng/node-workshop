import React from 'react';

function ProductItem(props) {
  const { id, name, pic, price } = props.product;
  return (
    <>
      <tr>
        <td className="number text-center">{id}</td>
        {/* <td className="image">
          <img src={pic} alt="" />
        </td> */}
        <td className="product">
          <strong>{name}</strong>
        </td>
        <td className="price text-right">NT${price}</td>
      </tr>
    </>
  );
}

export default ProductItem;
