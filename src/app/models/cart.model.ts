export interface Cart {
  cartId: number;       // Identifiant unique du panier
  status: 'EN_ATTENTE' | 'PAYE';       // Statut du panier
  amount: number;       // Montant total du panier
  createdAt: string;    // Date de création du panier
  updatedAt: string;    // Date de la dernière mise à jour
  transactionUuid: string; // Identifiant unique de la transaction
  dateTransaction: string; // Date de la transaction
  userId: number;       // Identifiant de l'utilisateur associé au panier
}
