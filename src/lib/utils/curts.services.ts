/* eslint-disable @typescript-eslint/no-unnecessary-condition */
export function agruparPorHoras(datos: {name: string; openTime: number; closeTime: number}[]): {
  openTime: number;
  closeTime: number;
  names: string[];
}[] {
  const grupos: Record<string, {openTime: number; closeTime: number; names: string[]}> = {};

  datos.forEach((obj) => {
    const {name, openTime, closeTime} = obj;
    const clave = `${openTime}-${closeTime}`;

    if (grupos[clave] != null) {
      grupos[clave].names.push(name);
    } else {
      grupos[clave] = {openTime, closeTime, names: [name]};
    }
  });

  return Object.values(grupos);
}
