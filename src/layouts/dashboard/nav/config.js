// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'หน้าหลัก',
    path: '/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'รายการที่ได้รับแล้ว',
    path: '/receive',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
