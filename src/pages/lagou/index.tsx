import React, { FC } from 'react';
import bookList from '@/components/BookList';
import BookItemLagouContent from '@/components/BookItemLagouContent';
import styles from './index.less';
import { connect, LagouModelState, ConnectProps } from 'umi';

interface PageProps extends ConnectProps {
  lagou: LagouModelState;
}

const Lagou: FC<PageProps> = ({ lagou }) => {
  const LagouBookList = bookList(lagou.books, BookItemLagouContent);

  return (
    <div className={styles.normal}>
      <LagouBookList></LagouBookList>
    </div>
  );
};

export default connect(({ lagou }: { lagou: LagouModelState }) => ({ lagou }))(
  Lagou,
);
