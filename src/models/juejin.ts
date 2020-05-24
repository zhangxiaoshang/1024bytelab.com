import books from '@/mock/juejin-book-list.json';

export interface JuejinUserDataProps {
  username: string;
}
export interface JuejinBookProps {
  _id: number;
  title: string;
  userData: JuejinUserDataProps;
  lastSectionCount: number;
  buyCount: number;
  price: number;
  brokerage: string;
}
export interface JuejinModelState {
  books: JuejinBookProps[];
}
export interface JuejinModelType {
  namespace: 'juejin';
  state: JuejinModelState;
}

const JuejinModel: JuejinModelType = {
  namespace: 'juejin',

  state: {
    books: books,
  },
};

export default JuejinModel;
