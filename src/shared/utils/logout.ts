export const forceLogout = () => {
  // Clear all localStorage data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('userRole');
  localStorage.removeItem('vendorId');
  localStorage.removeItem('userId');
  
  // Clear all sessionStorage data
  sessionStorage.clear();
  
  // Clear any other cached data
  if (typeof window !== 'undefined') {
    // Clear any cached API responses
    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }
  
  // Force redirect to login page
  window.location.href = '/auth/user/login';
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('userRole');
  localStorage.removeItem('vendorId');
  localStorage.removeItem('userId');
  sessionStorage.clear();
};
