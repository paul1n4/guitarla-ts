import { useEffect, useState, useMemo } from "react"
import { db } from "../data/db"
import type { Guitar, CartItem } from '../types'

export const useCart = () => {

  const initialCart = ()  : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)
  const [isCartVisible, setIsCartVisible] = useState(false) 

  const MAX_ITEMS = 5
  const MIN_ITEMS = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item : Guitar) {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id
    )
    if(itemExists >= 0) {
      if(cart[itemExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    } else {
      const newItem : CartItem = {...item, quantity: 1} 
      setCart([...cart, newItem])
    }
    setIsCartVisible(true) // Show cart when an item is added
  }

  function removeFromCart(id : Guitar['id']) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id != id))
  }

  function increaseQuantity(id : Guitar['id']) {
    const updatedCart = cart.map( item => {
      if(item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1 
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id: Guitar['id']) {
    const updateCart = cart.map (item => {
      if(item.id === id && item.quantity > MIN_ITEMS){
        return {
          ...item,
          quantity: item.quantity -1
        }
      }
      return item
    })
    setCart(updateCart)
  }

  function clearCart() {
    setCart([])
  }

  // State Derivado 
  const isEmpty = useMemo(() => cart.length === 0, [cart])
  //const isEmpty = () => cart.length === 0
  
  // const isEmpty = () => {
  //   cart.length === 0
  // }

  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart])
  // const cartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    isCartVisible,
    setIsCartVisible,
    isEmpty,
    cartTotal
  }
}

