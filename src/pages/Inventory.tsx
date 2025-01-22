import {
  Box,
  Button,
  HStack,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useGlobalContext } from "../context/useGlobalContext";
import ProductFormModal from "../components/ProductFormModal";
import { Product } from "../types/types";
import MUISkeleton from "../components/MUI/MUISkeleton";

const Inventory = () => {
  const { products, deleteProduct } = useGlobalContext();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      onDeleteClose();
    }
  };

  return (
    <Box p={5}>
      <HStack justify="space-between" mb={5}>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={() => {
          setSelectedProduct(null);
          onFormOpen();
        }}>
          Add Product
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            {/* <Th>Stock</Th> */}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              {/* <Td>{product.image}</Td> */}
              <Flex align="center" justify="center" w="140px" h="140px" m="auto">
                <Image
                    data-src={product.image}
                    className="image lazyload"
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                />
                <Box w="140px" h="140px">
                    <MUISkeleton height="140px" style={{ transform: "none" }} animation="wave" />
                </Box>
              </Flex>
              <Td>{product.title}</Td>
              <Td>{product.category}</Td>
              <Td>{product.description}</Td>
              <Td>${product.price}</Td>
              {/* <Td>{product.stock}</Td> */}
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit product"
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() => handleEdit(product)}
                  />
                  <IconButton
                    aria-label="Delete product"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(product)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        product={selectedProduct}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Product</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Inventory;
