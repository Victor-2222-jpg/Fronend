import apiClient from "../../Interceptors/http-interceptor";
import type Usuario from "../../Models/Filtros/usuario.interface";


export default class FiltrosService {

    static async obtenerUsuarios(): Promise<Usuario[]> {   
        try {
            const response = await apiClient.get('/users');
            return response.data; 
        } catch (error) {
            console.error('Error al obtener órdenes del técnico:', error);
            throw error;
        }
    }


}