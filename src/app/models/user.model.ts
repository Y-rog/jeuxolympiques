export interface User {
    id: number;  
    firstname?: string;
    lastname?: string;
    username: string;
    password?: string;
    secretKey?: string;
    roles: string[];  // Liste des rôles en chaîne de caractères

  }
  