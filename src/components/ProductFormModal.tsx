import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../context/useGlobalContext";
import { Product } from "../types/types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductFormModal = ({ isOpen, onClose, product }: ProductFormModalProps) => {
  const { addProduct, updateProduct } = useGlobalContext();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    // stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (product) {
      console.log('inside modal product', product);
      setFormData({
        title: product.title,
        price: product.price.toString(),
        // stock: product.stock.toString(),
        image: product.image,
        description: product.description,
      });
    } else {
      setFormData({
        title: "",
        price: "",
        // stock: "",
        image: "",
        description: "",
      });
    }
  }, [product]);

  const handleSubmit = () => {
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      // stock: parseInt(formData.stock),
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }
    onClose();
  };

  const formatPrice = (val) => `$` + val;
  const parsePrice = (val) => val.replace(/^\$/, '');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product ? "Edit Product" : "Add Product"}</ModalHeader>
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>title</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Price</FormLabel>
            {/* <NumberInput>
              <NumberInputField
                defaultValue={formData.price}
                onChange={(e) => {
                  console.log(e.target.value);
                  setFormData({ ...formData, price: parseFloat(e.target.value)})
                  console.log(formData);
                  }
                }
              />
            </NumberInput> */}
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </FormControl>
          {/* <FormControl mb={3}>
            <FormLabel>Stock</FormLabel>
            <NumberInput>
              <NumberInputField
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </NumberInput>
          </FormControl> */}
          <FormControl mb={3}>
            <FormLabel>Image URL</FormLabel>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Description</FormLabel>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {product ? "Update" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductFormModal;
