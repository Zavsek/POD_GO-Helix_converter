import React from 'react'

interface HeaderProps{
    title:string
    showModelBuilder: boolean | null
    onShowModelBuilder: ()=> void | null
}


const Header: React.FC<HeaderProps> = ({title, showModelBuilder, onShowModelBuilder}) => {
  return (
    <header className="w-full bg-slate-700/80 backdrop-blur-md py-4 text-center text-3xl font-semibold rounded-b-xl font-primary shadow-2xl">
      {showModelBuilder && 
      <div className='animate-bg-shine absolute left-3 top-4 min-h-5 min-w-5  border-[1px] px-2 rounded-lg border-gray-500 bg-[linear-gradient(110deg,#4f46e5,45%,#a5b4fc,55%,#4f46e5)] cursor-pointer' onClick={onShowModelBuilder}>{"<--"}</div>
      }
        {title}
      </header>
  )
}
export default Header;