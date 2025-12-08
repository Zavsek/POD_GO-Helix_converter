import React from 'react'

interface HeaderProps{
    title:string
}


const Header: React.FC<HeaderProps> = ({title}) => {
  return (
    <header className="w-full bg-slate-700/80 backdrop-blur-md py-4 text-center text-3xl font-semibold rounded-b-xl font-primary shadow-2xl">
        {title}
      </header>
  )
}
export default Header;