import React from 'react';
import { Layout, Menu, Alert } from 'antd';
import { Link, Redirect } from 'umi';
import styles from './index.less';

const { Header, Content, Footer } = Layout;
const menuData = [
  { route: '/lagou', name: '拉勾教育' },
  { route: '/juejin', name: '掘金小册' },
  { route: 'https://m.imooc.com/act/onlivelist', name: '慕课直播' },
  { route: '/about', name: '关于' },
];

interface Props {
  location: { pathname: string };
  children: React.ReactNode;
}

function onCloseTip() {
  localStorage.setItem('tipReaded', 'yes');
}

function TipContent() {
  const tipReaded = localStorage.getItem('tipReaded');
  if (tipReaded === 'yes') return null;

  return (
    <Alert
      message="购买课程可以联系我领奖励金红包"
      description={
        <>
          <div>微信公众号: 1024字节实验室</div>
          <div>个人号: Overview_as</div>
        </>
      }
      showIcon={false}
      type="info"
      banner
      closable
      closeText="我知道了"
      onClose={onCloseTip}
    />
  );
}

function BasicLayout(props: Props) {
  const {
    location: { pathname },
    children,
  } = props;

  if (pathname === '/') return <Redirect to={'/lagou'} />;

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.logo}>1024字节实验室</div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          style={{ lineHeight: '64px' }}
        >
          {menuData.map(menu => (
            <Menu.Item key={menu.route}>
              {menu.route.indexOf('http') === 0 ? (
                <a href={menu.route} target="_blank">
                  {menu.name}
                </a>
              ) : (
                <Link to={menu.route}>{menu.name}</Link>
              )}
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content className={styles.content}>
        <TipContent />
        <div className={styles.contentWrap}>{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>公众号: 1024字节实验室</Footer>
    </Layout>
  );
}

export default BasicLayout;
