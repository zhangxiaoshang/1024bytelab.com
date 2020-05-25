import React, { FC } from 'react';
import { LagouBookProps } from 'umi';
import styles from './BookItemLagouContent.less';

interface BookItemLagouContentProps {
  book: LagouBookProps;
}

const BookItemLagouContent: FC<BookItemLagouContentProps> = ({ book }) => {
  if (!book) return null;

  const bookImage = require(`@/assets/images/lagou/books/${book._id}.png`);

  return (
    <a href={book.distributionDetail.url} target="_blank">
      <div className={styles.normal}>
        <div
          className={styles.content}
          style={{
            backgroundImage: 'url(' + bookImage + ')',
          }}
        >
          <div className={styles.body}>
            <h2>{book.courseName}</h2>
            <p className={styles.brief}>{book.brief}</p>
            <p className={styles.teacher}>
              {book.teachers.map((teacher, index) => (
                <span key={index}>
                  <span>{teacher.teacherName}</span>
                  <span>{teacher.position}</span>
                </span>
              ))}
            </p>
            <p className={styles.sellSummary}>
              {book.isNewDes && (
                <span className={styles.isNewDes}>{book.isNewDes}</span>
              )}
              <span className={styles.discounts}>¥{book.discounts}</span>

              {book.price && <s>¥{book.price}</s>}

              <span className={styles.sales}>{book.sales}人购买</span>
            </p>
          </div>
          <div className={styles.footer}>
            <span className={styles.brokerage}>
              奖励金{book.distributionBaseInfoVo.brokerage}
            </span>
            {/* <span className={styles.buyText}>海报</span> */}
            <a
              className={styles.buyText}
              href={book.distributionDetail.url}
              target="__blank"
            >
              官网购买
            </a>
          </div>
        </div>
      </div>
    </a>
  );
};

export default BookItemLagouContent;
