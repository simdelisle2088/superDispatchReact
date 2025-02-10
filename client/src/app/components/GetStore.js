export const getStore = () => {
  const store = localStorage.getItem('store');
  if (!store) {
    throw new Error('Store not found in localStorage');
  }
  return store;
};
