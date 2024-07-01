import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const TempDataContext = createContext();

export const useTempData = () => useContext(TempDataContext);

export const TempDataProvider = ({ children }) => {
  const [tempData, setTempData] = useState({
    jobFilter: {
      keyword: '',
      type: '',
      minSalary: '',
      maxSalary: '',
    },
    links: {
      shareJobUrl: '',
    },
    selectedItem: {
      jobDetails: null,
      editJobDetails: null,
      editCompanyProfile: null,
      applyJob: null,
      publishModalConfigType: '',
      editChannel: '',
    },
  });

  const clearAllFilter = () => {
    setTempData({
      ...tempData,
      jobFilter: {
        keyword: '',
        type: '',
        minSalary: '',
        maxSalary: '',
      },
    });
  };

  const setValueTempData = (key, passData) => {
    if (tempData.hasOwnProperty(key)) {
      setTempData({
        ...tempData,
        [key]: passData,
      });
    } else {
      toast.error(`The key '${key}' does not exist in the state object.`);
    }
  };

  return (
    <TempDataContext.Provider
      value={{ tempData, setValueTempData, clearAllFilter }}
    >
      {children}
    </TempDataContext.Provider>
  );
};
