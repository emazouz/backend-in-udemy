export interface ICreateCardForUser {
  userId: string;
}

export interface IGetActiveCardForUser {
  userId: string;
}

export interface IAddItemToCard {
  userId: string;
  productId: any;
  quantity: string;
}

export interface IUpdateItemToCard {
  userId: string;
  productId: any;
  quantity: string;
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
