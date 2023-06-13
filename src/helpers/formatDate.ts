export const  formatDate = (date:Date) => {
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
      "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    const day = date.getDate();
    const month = meses[date.getMonth()];
    const year = date.getFullYear();
  
    const formatedDate = `${day} de ${month} del ${year}`;
    return formatedDate;
  }
  