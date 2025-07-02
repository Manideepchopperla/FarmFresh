import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../utils/userSlice';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Footer from './Footer';
import { toast } from 'sonner';

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPass] = useState('');
  const [Name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const user = useSelector(store => store.user)

  useEffect(() => {
    if (user.user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_BASE_URL + "/auth/login", {
        emailId,
        password
      }, {
        withCredentials: true
      });
      dispatch(setUser(res.data));
      toast.success('Login successful! Welcome back!', {
        ariaLabel: 'Login success',
      });
      return navigate('/');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong";
      setError(errorMsg);
      toast.error('Login failed. Please check your credentials.', {
        ariaLabel: 'Login error',
      });
    }
  }

  const handleSignUp = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_BASE_URL + "/auth/register", {
        name: Name,
        role,
        emailId,
        password
      }, {
        withCredentials: true
      });
      dispatch(setUser(res.data));
      toast.success('Sign up successful! You can now log in.', {
        ariaLabel: 'Sign up success',
      });
      navigate('/');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.response?.data || error.message || "Something went wrong";
      setError(errorMsg);
      toast.error('Sign up failed. Please try again.', {
        ariaLabel: 'Sign up error',
      });
    }
  }

  return (
    <div className='bg-white'>
      <Navbar />
      <div className="flex items-center bg-white justify-center my-10">
        <div className="card card-border bg-white w-96">
          <div className="card-body">
            <h2 className="card-title text-black justify-center">{isLoginForm ? "Login" : "Sign Up"}</h2>

            {!isLoginForm && (
              <>
                <label className="text-black fieldset-legend">Name </label>
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full  bg-white text-gray-800 placeholder-gray-400 outline-none"
                  />
                </label>

                <label className="text-black fieldset-legend">Role </label>
                <select
                  defaultValue=""
                  onChange={e => setRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-2xl bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="" disabled className='text-gray-800'>
                    Pick the Role
                  </option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}

            <label className="text-black fieldset-legend">Email ID</label>
            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                type="email"
                value={emailId}
                placeholder="mail@site.com"
                onChange={(e) => setEmailId(e.target.value)}
                required
                className="w-full bg-white text-gray-800 placeholder-gray-400 outline-none"
              />
            </label>

            <label className="text-black fieldset-legend">Password</label>
            <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                minLength="8"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be at least 8 characters, include a number, a lowercase and an uppercase letter"
                className="w-full bg-white text-gray-800 placeholder-gray-400 outline-none"
              />
            </label>

            {error && (
              <p className="text-red-300">
                {typeof error === 'string' ? error : error.message || JSON.stringify(error)}
              </p>
            )}

            <div className="card-actions justify-center">
              <button className="btn btn-primary bg-green-900 my-5 mx-4 mb-0" onClick={isLoginForm ? handleLogin : handleSignUp}>
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>

            <p className="m-auto font-semibold cursor-pointer py-2 text-green-900" onClick={() => setIsLoginForm((value) => !value)}>
              {isLoginForm ? "New User? Signup Here" : "Existing User? Login Here"}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login;
