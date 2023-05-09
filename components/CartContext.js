import {createContext, useEffect, useState} from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}) {
    const local_Storage = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts,setCartProducts] = useState([]);

    useEffect(() => {
        if (cartProducts?.length > 0) {
            local_Storage?.setItem('cart', JSON.stringify(cartProducts));
        }
    }, [cartProducts]);

    useEffect(() => {
        if (local_Storage && local_Storage.getItem('cart')) {
            setCartProducts(JSON.parse(local_Storage.getItem('cart')));
        }
    }, []);

    function addProduct(productId) {
        setCartProducts(prev => [...prev,productId]);
    }

    function removeProduct(productId) {
        setCartProducts(prev => {
            const positionOfProduct = prev.indexOf(productId);
            if (positionOfProduct !== -1) {
                return prev.filter((value,index) => index !== positionOfProduct);
            }
            return prev;
        });
    }

    function clearCart() {
        setCartProducts([]);
    }
    return (
        <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart}}>
            {children}
        </CartContext.Provider>
    );
}
