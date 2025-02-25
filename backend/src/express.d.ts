// src/express.d.ts o en la raíz del proyecto

declare namespace Express {
    export interface Request {
      user?: any; // Aquí 'any' es el tipo de datos que se espera para el usuario
    }
  }