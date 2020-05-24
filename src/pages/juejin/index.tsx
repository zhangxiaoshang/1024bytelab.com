import React, { FC } from 'react';
import bookList from '@/components/BookList';
import BookItemJuejinContent from '@/components/BookItemJuejinContent';
import styles from './index.less';
import { connect, JuejinModelState, ConnectProps } from 'umi';

interface PageProps extends ConnectProps {
  juejin: JuejinModelState;
}

const Juejin: FC<PageProps> = ({ juejin }) => {
  const JuejinBookList = bookList(juejin.books, BookItemJuejinContent);
  return (
    <div className={styles.normal}>
      <JuejinBookList></JuejinBookList>
    </div>
  );
};

export default connect(({ juejin }: { juejin: JuejinModelState }) => ({
  juejin,
}))(Juejin);
