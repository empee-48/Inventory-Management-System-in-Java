import React ,{createContext, useState, useContext} from "react";

export const ApplicationContext = createContext(undefined)

export const GlobalContext = ({ children }) => {
  const [user,setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [clarityModal, setClarityModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("This is the default modal message")

  const logout = () => {
    setUser(null);
    setLoggedIn(false);
  }

  const login = (user) => {
    setUser(user);
    setLoggedIn(true);
  }

  const value = {
    user,
    loggedIn,
    logout,
    login,
    successModal,
    setSuccessModal,
    modalMessage,
    setModalMessage,
    errorModal,
    setErrorModal,
    clarityModal,
    setClarityModal
  }
  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export const useGlobalContext = () => {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
      throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};