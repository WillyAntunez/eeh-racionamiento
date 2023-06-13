import { junio6 } from "./junio6"

export const getClients = (zone: string | null = null) => {
    const clients = new Set();

    junio6.forEach(corte => {
        corte.listaClientes.split(',').forEach(client => {
            if(!zone || zone && corte.zona === zone ) {
                clients.add(client);
            }
        })
    });

    return Array.from(clients);
}

export const getZones = () => {
    const zones = new Set();
    junio6.forEach((corte) => {
        zones.add(corte.zona);
    })

    return Array.from(zones);
}

export const getPowerOutages = (zone = null, client = null) => {
    const powerOutages = junio6.filter(powerOutage => {
        if(zone && powerOutage.zona !== zone){
            return false;
        }
        if( client && !powerOutage.listaClientes.includes(client) ){
            return false;
        }
        return true;
    })

    return powerOutages;
}

export const getMinMaxDates = () => {
    var dates = junio6.map(function(corte) {
      return new Date(corte.fecha).getTime();
    });
  
    var maxDate = new Date(Math.max.apply(null, dates));
    var minDate = new Date(Math.min.apply(null, dates));
  
    return {
      max: maxDate,
      min: minDate
    };
  }