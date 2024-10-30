import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setNavDetail } from "../../features/navDetail/navDetailSlice";
import {
  HomeOutlined,
  ApiOutlined,
  UsbOutlined,
  GlobalOutlined,
  RobotOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Scrollable from "../Scrollable";
const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "0",
    path: "/home",
    label: "Home",
    icon: <HomeOutlined />,
  },
  {
    key: "1",
    path: "/serial-live",
    label: "Real Time Data",
    icon: <HomeOutlined />,
  },
  {
    key: "2",
    path: "/serial-config",
    label: "Config Setting",
    icon: <ApiOutlined />,
    // children: [
    //   {
    //     key: "2",
    //     path: "/serial-data",
    //     label: "Serial Data",
    //     icon: <UsbOutlined />,
    //   },
    //   {
    //     key: "3",
    //     path: "/http-data",
    //     label: "HTTP Data",
    //     icon: <GlobalOutlined />,
    //   },
    // ],
  },
];

const flatMenuItems = [];

function createMenuItems(items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].children) {
      flatMenuItems.push(items[i]);
      createMenuItems(items[i].children);
    } else {
      flatMenuItems.push(items[i]);
    }
  }
}

createMenuItems(menuItems);

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { key, header, path } = useSelector((state) => state.navDetail);

  if (path !== location.pathname) {
    navigate(path);
  }

  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const onMenuItemClick = (eventObj) => {
    const { key } = eventObj;
    const path = flatMenuItems[key].path;
    const header = flatMenuItems[key].label;
    dispatch(setNavDetail({ key, header, path }));
    //navigate(path);
  };

  const {
    token: { colorPrimaryText },
  } = theme.useToken();
  const primaryStyle = {
    background: "#001529",
    color: colorPrimaryText,
  };
  return (
    <Layout
      style={{
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        zeroWidthTriggerStyle={{ top: "0px" }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[key]}
          mode="inline"
          items={menuItems}
          onClick={onMenuItemClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            textAlign: "center",
            height: "80px",
            ...primaryStyle,
            margin: 0,
            padding: 0,
          }}
        >
          <h1>{header}</h1>
        </Header>
        <Content
          style={{
            margin: "0",
          }}
        >
          <div
            style={{
              padding: "25px",
              minWidth: "100%",
              minHeight: "100%",
            }}
          >
            <Scrollable height="200px">{children}</Scrollable>
          </div>
        </Content>
        <Footer
          style={{
            height: "50px",
            textAlign: "center",
            ...primaryStyle,
          }}
        >
          Data Logger ©{new Date().getFullYear()} Created by{" "}
          <a
            href="https://abhisheksharma1310.github.io"
            target="_blank"
            rel="noreferrer"
          >
            Abhishek Sharma
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
