import "../assets/css/Orders.css";

function OrderItem({ order }) {
  console.log(order);

  return (
    <>
      <div className="order-card">
        <div className="order-card-left">
          <div className="order-card-img">
            <img src={order.product.image} alt="" />
          </div>
          <div className="order-item-details">
            <h3>{order.product.name}</h3>
            <p>₹ {order.product.price}</p>
            <p>Qty: {order.quantity}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>
        <div className="order-card-right">
          <div className="order-card-shipping">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.phoneNumber}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pinCode}</p>
          </div>
          {/* <div className="order-card-button">
            <button>Cancel</button>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default OrderItem;
