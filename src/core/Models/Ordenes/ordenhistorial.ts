export interface OrdenHistorial {
    id: number;
    tecnico: {
        id: number;
        nombre: string;
    },
    fecha_trabajo: string;
    inicio_trabajo: string;  // Este es el campo que devuelve la API
    fin_trabajo: string;     // Este es el campo que devuelve la API
    horas_trabajadas: number;
}

    