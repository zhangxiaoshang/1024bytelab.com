import React, { FC, Component } from 'react';
import styles from './BookList.less';

export default (books, ContentComponent) => {
  class BookList extends Component {
    render() {
      return (
        <div className={styles.normal}>
          {books.map(book => {
            return (
              <ContentComponent book={book} key={book._id}></ContentComponent>
            );
          })}
        </div>
      );
    }
  }

  return BookList;
};
