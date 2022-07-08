import { AiOutlineHome, AiOutlineShoppingCart } from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi';
import { RiCustomerService2Fill } from 'react-icons/ri';

export const pages = [
    {
        title: 'Home',
        url: '/',
        icon: AiOutlineHome,
        color: 'indigo',
        showNav: true
    },
    {
        title: 'Products',
        url: '/products',
        icon: AiOutlineShoppingCart,
        color: 'grape',
        showNav: true
    },
    {
        title: 'Map',
        url: '/map',
        icon: FiMapPin,
        color: 'red',
        showNav: true
    },
    {
        title: 'Customer Support',
        url: '/customer_support',
        icon: RiCustomerService2Fill,
        color: 'blue',
        showNav: true
    },
    {
        title: 'Login',
        url: '/login',
        showNav: false
    }
];