import { useContext, useState } from "react"
import { Link, NavLink, useNavigate} from "react-router-dom"
import {FaBars} from "react-icons/fa"
import {IoMdClose} from "react-icons/io"
import {FiMoon, FiSun} from "react-icons/fi"
import { AuthContext } from './../../Context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-[10px] px-3.5 py-2 font-medium transition-colors ${
    isActive ? "bg-soft text-acc" : "text-mute hover:bg-soft hover:text-acc"
  }`;
const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-[10px] px-3.5 py-2.5 text-base font-medium transition-colors ${
    isActive ? "bg-soft text-acc" : "text-mute hover:bg-soft hover:text-acc"
  }`;
const primaryBtnClass =
  "cursor-pointer rounded-xl bg-acc px-4 py-2 text-center font-semibold text-white transition hover:brightness-110";
const softBtnClass =
  "cursor-pointer rounded-xl bg-soft px-4 py-2 text-center font-semibold text-acc transition hover:brightness-95";
const themeBtnClass =
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-mute transition-colors hover:bg-soft hover:text-acc";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"))
  const{userLogin,setUserLogin}=useContext(AuthContext)
  const navigate=useNavigate()
  function LogOut(){
    localStorage.removeItem("userToken")
    setUserLogin(null)
    navigate("/login")
  }
  function toggleTheme(){
    const next = !isDark
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setIsDark(next)
  }
  return (
    <>
<nav className="sticky top-0 z-50 border-b border-line bg-card font-['Outfit']">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="shrink-0 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-acc">
          <span className="inline-block h-6 w-6 rounded-full border-4 border-acc" />
          Circle
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-1.5">
        {userLogin ?<>
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
        <button onClick={()=>LogOut()} className={`${softBtnClass} ms-2`}>LogOut</button>
        </>:
        <>
        <NavLink to="/register" className={navLinkClass}>Register</NavLink>
        <Link to="/login" className={`${primaryBtnClass} ms-2`}>Login</Link>
        </>
      }
        <button onClick={toggleTheme} aria-label="Toggle theme" className={`${themeBtnClass} ms-1`}>
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>

      <div className="md:hidden flex items-center gap-1">
        <button onClick={toggleTheme} aria-label="Toggle theme" className={themeBtnClass}>
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-[10px] p-2 text-mute hover:bg-soft hover:text-acc focus:outline-none"
          aria-expanded={isOpen}
        >
          {!isOpen ? <FaBars /> : <IoMdClose />}
        </button>
      </div>
    </div>

    <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
      <div className="space-y-1 border-t border-line bg-card px-2 pb-3 pt-2">
        {userLogin ? <>
        <NavLink to="/" end onClick={() => setIsOpen(false)} className={mobileLinkClass}>Home</NavLink>
        <NavLink to="/profile" onClick={() => setIsOpen(false)} className={mobileLinkClass}>Profile</NavLink>
        <button onClick={() => { setIsOpen(false); LogOut() }} className={`${softBtnClass} mt-2 block w-full`}>LogOut</button>
        </> : <>
        <NavLink to="/register" onClick={() => setIsOpen(false)} className={mobileLinkClass}>Register</NavLink>
        <Link to="/login" onClick={() => setIsOpen(false)} className={`${primaryBtnClass} mt-2 block`}>Login</Link>
        </>}
      </div>
    </div>
  </div>
</nav>
    </>
  )
}
