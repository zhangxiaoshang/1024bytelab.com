import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Redirect } from 'umi';
import styles from './index.less';

const { Header, Content, Footer } = Layout;
const menuData = [
  { route: '/lagou', name: '拉勾教育' },
  { route: '/juejin', name: '掘金小册' },
];

interface Props {
  location: { pathname: string };
  children: React.ReactNode;
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
              <Link to={menu.route}>{menu.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content className={styles.content}>
        <div className={styles.contentWrap}>{children}</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>公众号: 1024字节实验室</Footer>
    </Layout>
  );
}

export default BasicLayout;
