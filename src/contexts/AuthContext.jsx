import { createContext, useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as jwt from 'jsonwebtoken'
import { getUser } from './../api/user'
import { login } from './../api/auth'


const defaultAuthContext = {
  isAuthenticated: false,
  currentUser: null,
  register: null,
  login: null,
  logout: null,
  updatedAt: null
}

const AuthContext = createContext(defaultAuthContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const checkTockenIsValid = async () => {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        console.log('沒有token')
        setIsAuthenticated(false)
        setCurrentUser(null)
        return
      }

      // "message": "Unauthorized"
      const tempUser = jwt.decode(authToken)
      console.log('tempUser', tempUser)
      const result = await getUser(tempUser.id)
      console.log('user', result)

      if (!result) {
        console.log('沒有User')
        setIsAuthenticated(false)
        setCurrentUser(null)
        return
      }

      // 設定使用者
      console.log('有User')
      setIsAuthenticated(true)
      setCurrentUser(result.data)
    }
    checkTockenIsValid()
  }, [pathname])


  return (<AuthContext.Provider
    value={{
      isAuthenticated: isAuthenticated,
      currentUser: currentUser,
      updatedAt: updatedAt,
      update: () => {
        setUpdatedAt(new Date())
      },
      // 登入
      login: async (data) => {
        const result = await login({
          account: data.account,
          password: data.password
        });

        if (!!result) {
          setCurrentUser({ ...result.data.user }); // 設定使用者資料
          setIsAuthenticated(true);
          console.log('authToken', result.data.token)
          localStorage.setItem('authToken', result.data.token) // 設定新的token到return 
        } else {
          setCurrentUser(null); // 設定使用者資料
          setIsAuthenticated(false);
          return false;
        }
        return true;

      },
      // 登出
      logout: () => {
        console.log('goto logout')
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    }}
  >
    {children}
  </AuthContext.Provider>)
}