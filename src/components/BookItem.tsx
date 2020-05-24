import React, { FC } from 'react';
import { BookProps } from 'umi';
import styles from './BookItem.less';

interface BookItemProps {
  data: BookProps;
}

const BookItem: FC<BookItemProps> = ({ data }) => {
  if (!data) return null;

  const bookImage = require(`@/assets/images/lagou/books/${data._id}.png`);

  return (
    <div className={styles.normal}>
      <div
        className={styles.content}
        style={{
          backgroundImage: 'url(' + bookImage + ')',
        }}
      >
        <div className={styles.body}>
          <h2>{data.courseName}</h2>
          <p className={styles.brief}>{data.brief}</p>
          <p className={styles.teacher}>
            {data.teachers.map(teacher => (
              <>
                <span>{teacher.teacherName}</span>
                <span>{teacher.position}</span>
              </>
            ))}
          </p>
          <p className={styles.sellSummary}>
            {data.isNewDes && (
              <span className={styles.isNewDes}>{data.isNewDes}</span>
            )}
            <span className={styles.discounts}>¥{data.discounts}</span>

            {data.price && <s>¥{data.price}</s>}

            <span className={styles.sales}>{data.sales}人购买</span>
          </p>
        </div>
        <div className={styles.footer}>
          <span className={styles.brokerage}>
            返现{data.distributionBaseInfoVo.brokerage}
          </span>
          {/* <span className={styles.buyText}>海报</span> */}
          <a
            className={styles.buyText}
            href={data.distributionDetail.url}
            target="__blank"
          >
            购买
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
