// import React, { createContext, useState, useContext } from 'react';

// interface Product {
//   id: number;
//   name: string;
//   price: number;
// }

// interface InventoryContextType {
//   products: Product[];
//   addProduct: (product: Omit<Product, "id">) => void;
//   updateProduct: (id: number, product: Partial<Product>) => void;
//   deleteProduct: (id: number) => void;
// }

// const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// export const InventoryContextProvider = ({ children }: { children: React.ReactNode }) => {
//   const [products, setProducts] = useState<Product[]>([]);

//   const addProduct = (product: Omit<Product, "id">) => {
//     const newProduct = {
//       ...product,
//       id: Math.max(...products.map(p => p.id)) + 1,
//     };
//     setProducts([...products, newProduct]);
//   };

//   const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
//     setProducts(products.map(product => 
//       product.id === id ? { ...product, ...updatedProduct } : product
//     ));
//   };

//   const deleteProduct = (id: number) => {
//     setProducts(products.filter(product => product.id !== id));
//   };

//   return (
//     <InventoryContext.Provider value={{
//       products,
//       addProduct,
//       updateProduct,
//       deleteProduct,
//     }}>
//       {children}
//     </InventoryContext.Provider>
//   );
// };

// export const useInventoryContext = () => {
//   const context = useContext(InventoryContext);
//   if (context === undefined) {
//     throw new Error('useInventoryContext must be used within a InventoryContextProvider');
//   }
//   return context;
// };
