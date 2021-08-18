import {
    AppstoreOutlined,
    HomeOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    UserOutlined,
    AreaChartOutlined,
    WindowsOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
  } from '@ant-design/icons';

const menuList = [
    {
        title:'首页', //菜单标题名称
        key: '/home', //对应的path
        icon: <HomeOutlined/>
    },
    {
        title:'商品',
        key: '/products',
        icon: 'appstore',
        children: [ //子菜单列表
          {
            title:'品类管理',
            key: '/gategory',
            icon: 'bars',
          },
          {
            title:'商品管理',
            key: '/product',
            icon: 'tool',
          }
        ]
    }
]

export default menuList