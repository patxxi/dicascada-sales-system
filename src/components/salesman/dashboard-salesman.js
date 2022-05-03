import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { Box, Container, Grid } from "@mui/material";
import { Budget } from "../dashboard/budget";
import { LatestOrders } from "../dashboard/latest-orders";
import { LatestProducts } from "../dashboard/latest-products";
import { Sales } from "../dashboard/sales";
import { TasksProgress } from "../dashboard/tasks-progress";
import { TotalCustomers } from "../dashboard/total-customers";
import { ProductsList } from "../dashboard/products-list";
import { TotalProfit } from "../dashboard/total-profit";
import { TrafficByDevice } from "../dashboard/traffic-by-device";
import { DashboardLayout } from "../dashboard-layout";
import { AppContext } from "../../context/AppContext";
import { getSales } from "../../utils/api/sales";
import { getClients } from "../../utils/api/clients";
import { getProducts } from "../../utils/api/products";
import { ClientsList } from "../dashboard/clients-list";

const DashboardSalesman = ({
  token,
  sales,
  pageSales,
  products,
  pageProducts,
  pageClients,
  clients,
  handlePageChangeSales,
  handlePageChangeProducts,
  handlePageChangeClients,
}) => {
  return (
    <>
      <DashboardLayout>
        <Head>
          <title>Dashboard Salesman| Material Kit</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <Budget />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                <TotalCustomers />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                <TasksProgress />
              </Grid>
              <Grid item lg={12} md={12} xl={9} xs={12}>
                {sales && (
                  <LatestOrders
                    orders={sales}
                    handlePageChange={handlePageChangeSales}
                    page={pageSales}
                  />
                )}
              </Grid>

              <Grid item lg={12} md={12} xl={9} xs={12}>
                {products && (
                  <ProductsList
                    products={products}
                    handlePageChange={handlePageChangeProducts}
                    page={pageProducts}
                  />
                )}
              </Grid>

              <Grid item lg={12} md={12} xl={9} xs={12}>
                {clients && (
                  <ClientsList
                    clients={clients}
                    handlePageChange={handlePageChangeClients}
                    page={pageClients}
                  />
                )}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
};

export { DashboardSalesman };
