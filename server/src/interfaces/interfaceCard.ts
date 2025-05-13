export interface ICreateCardForUser {
  userId: string;
}

export interface IGetActiveCardForUser {
  userId: string;
  populateProduct?: boolean;
}

export interface IAddItemToCard {
  userId: string;
  productId: any;
  quantity: number;
}

export interface IUpdateItemToCard {
  userId: string;
  productId: any;
  quantity: number;
}

export interface IDeleteItemToCard {
  userId: string;
  productId: string;
}

export interface IClearCard {
  userId: string;
}

export interface ICheckOut {
  userId: string;
  address: string;
}
