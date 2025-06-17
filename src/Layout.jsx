import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from './config/routes';
import { useFavorites } from '@/services';

const Layout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { favorites } = useFavorites();

  const mainNavItems = [routes.browse, routes.map, routes.favorites];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className={`flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-40 transition-all duration-200 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center space-x-2">
                <ApperIcon name="Home" className="w-8 h-8 text-primary" />
                <span className="text-xl font-display font-semibold text-primary">EstateView</span>
              </NavLink>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by location, address, or MLS number..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.id === 'favorites' && favorites.length > 0 && (
                    <span className="bg-secondary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <nav className="container mx-auto px-4 py-4">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.id === 'favorites' && favorites.length > 0 && (
                    <span className="bg-secondary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center ml-auto">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-background">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-gray-200">
        <nav className="flex">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-primary'
                }`
              }
            >
              <div className="relative">
                <ApperIcon name={item.icon} className="w-6 h-6 mb-1" />
                {item.id === 'favorites' && favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;