import React, { FC } from 'react';
import { JuejinBookProps } from 'umi';
import { Modal, Button } from 'antd';
import styles from './BookItemJuejinContent.less';

interface BookItemLagouContentProps {
  book: JuejinBookProps;
}

class BookItemLagouContent extends React.Component {
  state = {
    visible: false,
  };

  showModal = id => {
    const publicPath =
      process.env.NODE_ENV === 'development'
        ? '/posts/'
        : 'https://zhangxiaoshang.github.io/1024bytelab.com/posts/';
    const image = `${publicPath}${id}.png`;

    this.setState({
      postImage: image,
      visible: true,
    });
  };

  handleOk = e => {
    console.log(2, e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const book = this.props.book;

    if (!book) return null;
    const bookImage = require(`@/assets/images/juejin/books/${book._id}.png`);
    const postImage = require(`@/assets/images/juejin/posts/${book.id}.png`);

    return (
      <div className={styles.normal}>
        <div
          className={styles.content}
          style={{
            backgroundImage: 'url(' + bookImage + ')',
          }}
        >
          <div className={styles.body}>
            <h2>{book.title}</h2>
            <p className={styles.brief}>{book.userData.username}</p>

            <p className={styles.sellSummary}>
              <span>{book.lastSectionCount}小节</span>
              <span className={styles.sales}>{book.buyCount}人已购买</span>
              <span className={styles.price}>¥{book.price}</span>
            </p>
          </div>
          <div className={styles.footer}>
            <span className={styles.brokerage}>奖励金¥{book.brokerage}</span>

            <button
              className={styles.buyButton}
              onClick={this.showModal.bind(this)}
            >
              扫码购买
            </button>

            {/* <a
              className={styles.buyText}
              href={book.distributionDetail.url}
              target="__blank"
            >
              购买
            </a> */}
          </div>
        </div>

        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          footer={null}
          width="300px"
          bodyStyle={{
            padding: '0',
          }}
        >
          <div className={styles.imageWrap}>
            <img
              style={{ width: '100%' }}
              src={postImage}
              alt="正在加载, 如果加载失败, 可以添加公众号：1024字节实验室 获取"
            />
            {/* <img src="" alt="" /> */}
          </div>

          {/* <img
            style={{ width: '100%' }}
            src="http://127.0.0.1:8080/posts/5d8ae0c2f265da5bb065c6f4.png"
            alt=""
          /> */}
        </Modal>
      </div>
    );
  }
}

export default BookItemLagouContent;
