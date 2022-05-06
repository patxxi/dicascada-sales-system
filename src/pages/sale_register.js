import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DashboardLayout } from "../components/dashboard-layout";
import { AppContext } from "src/context/AppContext";
import { ProductsList } from "../components/products/products-list";
import { getProducts } from "../utils/api/products";
import { FormSalesProductsModal } from "../components/sales/form-products-modal";

const SaleRegister = () => {
  const router = useRouter();
  const [pageProducts, setPageProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const { token, clients, loguedUser } = useContext(AppContext);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handlePageChangeProducts = async (event, newPage) => {
    const newUrl = newPage > pageProducts ? products.next : products.previous;
    setPageProducts(newPage);
    const { data, request } = await getProducts(token, newUrl);
    setProducts(data);
  };

  const formik = useFormik({
    initialValues: {
      id: "",
      income: "",
      client: "cliente",
      income_currency: "USD",
      products: null,
      salesman: "vendedor",
      status: "PENDING",
    },
    validationSchema: Yup.object({
      id: Yup.string().required("Numero de factura requerido"),
    }),
    onSubmit: async (form) => {
      console.log(form);
    },
  });

  return (
    <>
      <Head>
        <title>Login | Material Kit</title>
      </Head>
      <DashboardLayout>
        {token && (
          <Box
            component="main"
            sx={{
              alignItems: "center",
              display: "flex",
              flexGrow: 1,
              minHeight: "100%",
              width: "100%",
            }}
          >
            <Container sx={{ width: "100%" }}>
              <form onSubmit={formik.handleSubmit}>
                <Box sx={{ my: 3 }}>
                  <Typography color="textPrimary" variant="h4">
                    Registrar Venta
                  </Typography>
                </Box>
                <Grid container spacing={3}></Grid>

                <TextField
                  error={Boolean(formik.touched.id && formik.errors.id)}
                  fullWidth
                  helperText={formik.touched.id && formik.errors.id}
                  label="Factura"
                  margin="normal"
                  name="id"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.id}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Monto"
                  margin="normal"
                  name="income"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.income}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Divisa"
                  margin="normal"
                  name="income_currency"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.income_currency}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Estado"
                  margin="normal"
                  name="status"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.status}
                  variant="outlined"
                  disabled
                />

                <InputLabel id="label-client">Cliente</InputLabel>
                <Select
                  sx={{ marginTop: 2, marginBottom: 1 }}
                  fullWidth
                  label="Cliente"
                  labelId="label-client"
                  value={formik.values.client}
                  name="client"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                >
                  {clients &&
                    clients.results.map((client) => (
                      <MenuItem value={client.id} key={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                </Select>

                <InputLabel id="label-salesman">Vendedor</InputLabel>
                <TextField
                  sx={{ marginTop: 2, marginBottom: 1 }}
                  fullWidth
                  label="Vendedor"
                  labelId="label-salesman"
                  value={loguedUser.name}
                  name="salesman"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  disabled
                ></TextField>

                <ProductsList
                  products={products}
                  headLabels={["Producto", "Cantidad", "Precio", "Total", "Eliminar", "Editar"]}
                  productsFields={["name", "quantity", "typePrice", "total"]}
                  page={pageProducts}
                  handlePageChange={handlePageChangeProducts}
                ></ProductsList>
                <Box sx={{ py: 2, display: "flex", justifyContent: "flex-end", width: "100%" }}>
                  <IconButton
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Box>

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={formik.isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Registrar Venta
                  </Button>

                  {openModal && (
                    <FormSalesProductsModal
                      open={openModal}
                      handleClose={() => {
                        setOpenModal(false);
                      }}
                      cartProducts={products}
                      setCartProducts={setProducts}
                    ></FormSalesProductsModal>
                  )}
                </Box>
              </form>
            </Container>
          </Box>
        )}
      </DashboardLayout>
    </>
  );
};

export default SaleRegister;
