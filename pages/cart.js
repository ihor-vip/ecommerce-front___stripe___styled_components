import {useContext, useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Center from "@/components/Center";
import Table from "@/components/Table";
import {CartContext} from "@/components/CartContext";
import Input from "@/components/Input";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

export default function CartPage() {
    const {cartProducts, addProduct, removeProduct} = useContext(CartContext);
    const [products,setProducts] = useState([]);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [city,setCity] = useState('');
    const [postalCode,setPostalCode] = useState('');
    const [streetAddress,setStreetAddress] = useState('');
    const [country,setCountry] = useState('');

    useEffect(() => {
        if (cartProducts.length > 0) {
            axios.post('/api/cart', {ids:cartProducts})
                .then(response => {
                    setProducts(response.data);
                })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    function moreOfThisProduct(id) {
        addProduct(id);
    }

    function lessOfThisProduct(id) {
        removeProduct(id);
    }

    let total = 0;
    for (const productId of cartProducts) {
        const price = products.find(product => product._id === productId)?.price || 0;
        total += price;
    }

    return (
        <>
          <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Cart</h2>

                        {!cartProducts?.length && (
                            <div>Your cart is empty</div>
                        )}
                        {products?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map(product => (
                                        <tr>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt=""/>
                                                </ProductImageBox>

                                                {product.title}
                                            </ProductInfoCell>

                                            <td>
                                                <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>

                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>

                                                <Button onClick={() => moreOfThisProduct(product._id)}>+</Button>
                                            </td>

                                            <td>
                                                ${cartProducts.filter(id => id === product._id).length * product.price}
                                            </td>

                                        </tr>
                                    ))}

                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>${total}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        )}
                    </Box>

                    {!!cartProducts?.length && (
                        <Box>
                            <h2>Order Information</h2>
                            <Input type="text"
                                   placeholder="Name"
                                   value={name}
                                   name="name"
                                   onChange={ev => setName(ev.target.value)}
                            />

                            <Input type="text"
                                   placeholder="Email"
                                   value={email}
                                   name="email"
                                   onChange={ev => setEmail(ev.target.value)}
                            />

                            <CityHolder>
                                <Input type="text"
                                       placeholder="City"
                                       value={city}
                                       name="city"
                                       onChange={ev => setCity(ev.target.value)}
                                />

                                <Input type="text"
                                       placeholder="Postal Code"
                                       value={postalCode}
                                       name="postalCode"
                                       onChange={ev => setPostalCode(ev.target.value)}
                                />
                            </CityHolder>
                            <Input type="text"
                                   placeholder="Street Address"
                                   value={streetAddress}
                                   name="streetAddress"
                                   onChange={ev => setStreetAddress(ev.target.value)}
                            />

                            <Input type="text"
                                   placeholder="Country"
                                   value={country}
                                   name="country"
                                   onChange={ev => setCountry(ev.target.value)}
                            />

                            <Button black block>
                                Continue to payment
                            </Button>
                        </Box>
                    )}
                </ColumnsWrapper>
            </Center>
        </>
    )
}