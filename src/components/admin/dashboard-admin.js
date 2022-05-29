import Head from "next/head";
import Skeleton from "@mui/material/Skeleton";
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { LatestOrders } from "../dashboard/latest-orders";
import { TasksProgress } from "../dashboard/tasks-progress";
import { DashboardLayout } from "../dashboard-layout";
import { AppContext } from "../../context/AppContext";
import { getSales, getSalesIA, getSalesStatistic, getBiggestSale } from "../../utils/api/sales";
import { LineChartComponent } from "../charts/SalesLineChart";
import { StatisticPanel } from "../statistics/statistic_panel";
import { getLocalStorage } from "../../utils/helpers/localStorage";

const DashboardAdmin = () => {
  const token =  getLocalStorage('token');
  const [filteredDateSales, setFilteredDateSales] = useState(null);
  const [page, setPage] = useState(0);
  const [monthSales, setMonthSales] = useState(null);
  const [predictedMonth, setPredictedMonth] = useState(null);
  const [yearPredicted, setYearPredicted] = useState(null);
  const [yearSales, setYearSales] = useState(null);
  const [previousYearSales, setPreviousYearSales] = useState(null);
  const [actualYearSales, setActualYearSales] = useState(null);
  const [radioOptionsSalesChart, setRadioOptionsSalesChart] = useState({ predicted: true });
  const [biggestSale, setBiggestSale] = useState(null);

  const handlePageChange = async (event, newPage) => {
    setPage(newPage);
    const newUrl = newPage > page ? filteredDateSales.next : filteredDateSales.previous;
    const { data, request } = await getSales(token, newUrl);
    setClientSales(data);
  };

  useEffect(() => {
    async function fetchData() {
      if (!predictedMonth) {
        const { data, request } = await getSalesIA(token, false, "", 2, true);
        if (request.ok) {
          setPredictedMonth(data[0]);
        }
      }

      if (!filteredDateSales && !monthSales) {
        let { data, request } = await getSales(
          token,
          null,
          `date_start=2022-02-01&date_end=2022-03-1`
        );
        if (request.ok) {
          setFilteredDateSales(data);
          setMonthSales(data.count);
        }
      }

      if (!yearPredicted) {
        const { data, request } = await getSalesIA(token, false, "month", null, true);
        if (request.ok) {
          let aux = [];
          Object.entries(data).forEach((element) => {
            aux.push({ name: element[0], count: element[1] });
          });
          setYearPredicted(aux);
        }
      }

      if (!actualYearSales) {
        const { data, request } = await getSalesStatistic(token, 2022);
        if (request.ok) {
          setActualYearSales(data);
        }
      }

      if(!biggestSale) {
        const { data, request } = await getBiggestSale(token);
        if (request.ok) {
          setBiggestSale(data);
        }
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    async function fetchData() {
      const { data, request } = await getSalesStatistic(token, yearSales);
      if (request.ok) {
        setPreviousYearSales(data);
      }
    }
    fetchData();
  }, [token, yearSales]);


  return (
    <>
      <Head>
        <title>Dashboard Admin| Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <DashboardLayout>
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <StatisticPanel value={monthSales} title="Cantidad de ventas en el mes" />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                <StatisticPanel value={biggestSale} title="Mayor venta historica" />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                <TasksProgress
                  task="Porcentaje del objetivo de ventas en el mes"
                  goal={predictedMonth}
                  current={monthSales}
                />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                <StatisticPanel value={predictedMonth} title="Cantidad esperada de ventas" />
              </Grid>

              <Grid item lg={12} md={12} xl={9} xs={12}>
                {filteredDateSales ? (
                  <LatestOrders
                    sales={filteredDateSales}
                    handlePageChange={handlePageChange}
                    page={page}
                  />
                ) : (
                  <Skeleton variant="rectangular" width={210} height={118} />
                )}
              </Grid>
              <Grid item lg={12} md={12} xl={9} xs={12}>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                  sx={{ fontSize: "1rem" }}
                >
                  Grafica de ventas
                </Typography>

                <Grid item lg={12} md={12} xl={9} xs={12}>
                  {radioOptionsSalesChart.previous && (
                    <>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                        sx={{ fontSize: "0.8rem", margin: 2 }}
                      >
                        Seleccionar previo año a visualizar
                      </Typography>
                      <Select
                        value={yearSales}
                        onChange={(event) => {
                          setYearSales(event.target.value);
                        }}
                      >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value={2021}>2021</MenuItem>
                        <MenuItem value={2020}>2020</MenuItem>
                        <MenuItem value={2019}>2019</MenuItem>
                        <MenuItem value={2018}>2018</MenuItem>
                      </Select>
                    </>
                  )}
                </Grid>
                <Grid item xl={3} lg={3} sm={6} xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={radioOptionsSalesChart.predicted}
                          onClick={(e) => {
                            setRadioOptionsSalesChart({
                              ...radioOptionsSalesChart,
                              predicted: !radioOptionsSalesChart.predicted,
                            });
                          }}
                        />
                      }
                      label="Predicciones del año"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={radioOptionsSalesChart.actual}
                          onClick={(e) => {
                            setRadioOptionsSalesChart({
                              ...radioOptionsSalesChart,
                              actual: !radioOptionsSalesChart.actual,
                            });
                          }}
                        />
                      }
                      label="Año actual"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={radioOptionsSalesChart.previous}
                          onClick={(e) => {
                            setRadioOptionsSalesChart({
                              ...radioOptionsSalesChart,
                              previous: !radioOptionsSalesChart.previous,
                            });
                          }}
                        />
                      }
                      label="Año previo"
                    />
                  </FormGroup>
                </Grid>

                <LineChartComponent
                  arrays={{
                    predicted: radioOptionsSalesChart.predicted ? yearPredicted : null,
                    previous: radioOptionsSalesChart.previous ? previousYearSales : null,
                    actual: radioOptionsSalesChart.actual ? actualYearSales : null,
                  }}
                ></LineChartComponent>
              </Grid>
            </Grid>
          </Container>
        </DashboardLayout>
      </Box>
    </>
  );
};

export { DashboardAdmin };
