import { useToast } from "@chakra-ui/react";
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { ProductType } from "../types/types";
// import seed from "./products.json";

type ContextType = {
  products: ProductType[];
  cartItemCount: number;
  totalPrice: number;
  savedItemsCount: number;
  addToCart: (product: ProductType) => void;
  deleteFromCart: (id: number | string) => void;
  setQuantity: (qty: string, id: number | string) => void;
  decrementQty: (id: number | string) => void;
  incrementQty: (id: number | string) => void;
  toggleSaved: (id: number | string) => void;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<ProductType, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<ProductType>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  isLoading: boolean;
};

interface Props {
  children: ReactNode;
}
// Create context
export const GlobalContext = createContext<ContextType | null>(null);

// Provider component
export const Provider: FC<Props> = ({ children }) => {
  const toast = useToast();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [savedItemsCount, setSavedItemsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  const fetchProducts = async () => {
    const res = await fetch("https://localhost:5001/products");
    let data = [];
    res.json().then(x => {
      data = x;
      console.log('anish fetching from fakestore api', data);
      //console.log('anish fetching from fakestore api', data);
      const products: ProductType[] = data;
      console.log('anish globalstate setting products data 67', products);
      setProducts(products);
      setIsLoading(false);
    });
  };
  useEffect(() => {
    console.log('anish inside globalstate.tsx');
    fetchProducts();
    console.log('anish inside globalstate.tsx useeffect after fetchproducts 74');
  }, []);

  useEffect(() => {
    // Get products in cart
    const productsInCart = products.flatMap(product =>
      product.inCart === true ? product : []
    );
    const productPrices = productsInCart.map(
      product => +product.price * +product.quantity
    );
    setTotalPrice(productPrices.reduce((a, b) => a + b, 0));
    setCartItemCount(productsInCart.length);
    // Get saved products
    const savedProducts = products.filter(product => product.isSaved === true);
    setSavedItemsCount(savedProducts.length);
  }, [products]);

  const toggleSaved = (id: string | number) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id
          ? { ...prevProduct, isSaved: !prevProduct.isSaved }
          : prevProduct
      )
    );
  };

  const addToCart = (product: ProductType) => {
    toast({
      title: "Product successfully added to your cart",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === product.id
          ? { ...prevProduct, quantity: 1, inCart: true }
          : prevProduct
      )
    );
  };

  const deleteFromCart = (id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.id === id
          ? { ...prevProduct, inCart: false, quantity: undefined }
          : prevProduct
      )
    );
  };

  const setQuantity = (qty: string, id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.inCart && prevProduct.id === id
          ? { ...prevProduct, quantity: qty }
          : prevProduct
      )
    );
  };

  const decrementQty = (id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.inCart && prevProduct.id === id
          ? { ...prevProduct, quantity: +prevProduct.quantity - 1 }
          : prevProduct
      )
    );
  };

  const incrementQty = (id: number | string) => {
    setProducts(prevProducts =>
      prevProducts.map(prevProduct =>
        prevProduct.inCart && prevProduct.id === id
          ? { ...prevProduct, quantity: +prevProduct.quantity + 1 }
          : prevProduct
      )
    );
  };

  const addProduct = async (product: Omit<ProductType, "id">) => {
    try {
      const response = await fetch('https://localhost:5001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);

      toast({
        title: "Product successfully created",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      console.log('error creating product', error);
      toast({
        title: "Error creating product",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const updateProduct = async (id: number, updatedProduct: Partial<ProductType>) => {
    try {
      const response = await fetch(`https://localhost:5001/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProductData = await response.json();
      setProducts(products.map(product => 
        product.id === id ? { ...product, ...updatedProductData } : product
      ));

      toast({
        title: "Product successfully updated",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      console.log('error updating product', error);
      toast({
        title: "Error updating product",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:5001/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(product => product.id !== id));

      toast({
        title: "Product successfully deleted",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        products,
        cartItemCount,
        totalPrice,
        savedItemsCount,
        addToCart,
        deleteFromCart,
        setQuantity,
        incrementQty,
        decrementQty,
        toggleSaved,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

declare global {
  interface ObjectConstructor {
    filter: (obj: any, predicate: any) => any;
  }
}
// Custom function to filter objects
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => Object.assign(res, { [key]: obj[key] }), {});
