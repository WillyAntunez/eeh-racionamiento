import {
  Grid,
  Typography,
  useTheme,
  Paper,
  TextField,
  FormControl,
  Autocomplete,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  getClients,
  getMinMaxDates,
  getPowerOutages,
  getZones,
} from "../data/getData";
import { formatDate } from "../helpers/formatDate";

import noEnergy from "../assets/no-energy.jpg";

export const Home = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedClient, setselectedClient] = useState(null);

  const [powerOutages, setPowerOutages] = useState<any[]>([]);

  const [minMaxDates, setMinMaxDates] = useState({
    max: new Date(),
    min: new Date(),
  });

  useEffect(() => {
    const newZones = [...getZones()];
    setZones(newZones);

    const minMax = getMinMaxDates();
    setMinMaxDates(minMax);
  }, []);

  useEffect(() => {
    if (selectedZone) {
      const newClients = [...getClients(selectedZone)];
      setClients(newClients);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedClient && selectedZone && selectedZone.length >= 1) {
      const newPowerOutages = getPowerOutages(selectedZone, selectedClient);

      newPowerOutages.sort(function (a:any, b:any) {
        const fechaA:any = new Date(a.fecha);
        const fechaB:any = new Date(b.fecha);
        return fechaA - fechaB;
      });

      setPowerOutages(newPowerOutages);
    } else {
      setPowerOutages([]);
    }
  }, [selectedClient, selectedZone]);

  const onChangeZone = (event:any) => {
    setselectedClient(null);
    setSelectedZone(event.target.value);
  };

  const onChangeClient = (event:any, values:any) => {
    setselectedClient(values);
  };

  const theme = useTheme();

  return (
    <Grid container sx={{ backgroundColor: theme.palette.grey[200] }}>
      <Grid
        sx={{ mx: "auto", width: "100%", maxWidth: "1300px", px: 2, mt: 4 }}
      >
        <Paper elevation={4} sx={{ padding: 2, paddingBottom: 6 }}>
          <Grid container height={"130px"}>
            <img
              src={noEnergy}
              height={"100%"}
              width={"100%"}
              style={{
                objectFit: "cover",
                maxWidth: "400px",
                margin: "0 auto",
              }}
            />
          </Grid>

          {/* title and description */}
          <Grid>
            <Typography fontSize={22} component={"h1"} mt={5}>
              Racionamiento Honduras (2023):
            </Typography>
            <Typography mt={1}>
              Aquí si podés buscar por colonia para saber cuándo te van a cortar
              la luz estos caras de caballo de la ENEE.
            </Typography>
            <Typography mt={4}>
              <Typography fontWeight={"bold"} component={"span"}>
                Datos disponibles de cortes desde:
              </Typography>
              {formatDate(minMaxDates.min)} hasta {formatDate(minMaxDates.max)}.
            </Typography>
            <Typography mt={2}>
              <Typography fontWeight={"bold"} component={"span"}>
                Actualizado por ultima vez el día:
              </Typography>
              6 de junio del 2023 con datos públicos de la ENEE.
            </Typography>
          </Grid>

          <Grid container mt={2} spacing={2}>
            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Zona</FormLabel>
                <Select
                  size={"small"}
                  value={selectedZone}
                  onChange={onChangeZone}
                >
                  {zones.map((zone, index) => (
                    <MenuItem value={zone} key={index}>
                      {zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>
                  Colonia o lugar de referencia
                </FormLabel>
                <Autocomplete
                  onChange={onChangeClient}
                  value={selectedClient}
                  size={"small"}
                  options={clients}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: theme.palette.grey[200],
            }}
            my={3}
          />

          <Grid container sx={{ my: 2 }}>
            {!selectedZone || !selectedClient ? (
              <Typography>
                Por favor, seleccione la zona y la colonia o lugar de referencia
                para poder cargar los posibles cortes.
              </Typography>
            ) : null}

            {powerOutages && powerOutages.length > 0 ? (
              <Grid container>
                <Typography fontSize={20} mb={2}>
                  Cortes programados:
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  Los siguientes cortes corresponden al circuito{" "}
                  {powerOutages[0].circuito} correspondiente a la zona{" "}
                  {selectedZone}, al que pertenece el lugar de referencia "
                  {selectedClient}":
                </Typography>

                {powerOutages.map((powerOutage, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={3}
                    key={index}
                    mt={1}
                    my={2}
                  >
                    <Typography fontWeight={"bold"}>
                      {powerOutage.fecha
                        ? formatDate(new Date(powerOutage.fecha))
                        : ""}
                    </Typography>
                    <Typography>{powerOutage.jornada}</Typography>
                  </Grid>
                ))}

                <Grid container sx={{ mt: 2 }}>
                  <Typography mb={1} fontWeight={"bold"}>
                    Otras zonas probablemente afectadas en este circuito:
                  </Typography>
                  {powerOutages[0].listaClientes}
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
