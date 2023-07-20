import { useState, useEffect } from 'react';
import { AiFillThunderbolt } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import AOS from "aos"
import "aos/dist/aos.css"

function FrontPage({name, setName}) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        AOS.init({
          duration: 700,
          easing: "ease-in-out",
          once: true,
        });
      }, []);

    useEffect(() => {
        if(isLoading){
            localStorage.setItem("currentPlayer", JSON.stringify(name))
        }
    },[isLoading])

    function handleSubmit(e){
        e.preventDefault()
        setIsLoading(true)
        const loader = setTimeout(() => {
            setIsLoading(false)
            navigate('/tenzies')
        }, 2500)

        return () => clearTimeout(loader)
    }
    return (
        <div className='frontpage' data-aos="fade-left">
            <div className="min-h-screen flex flex-col justify-center gap-[2rem] container" data-aos="fade-up" data-aos-delay="500">
                <div className="title" >
                    <div className="flex absolute top-[1rem] gap-[0.6rem] lg:static">
                        <AiFillThunderbolt className='text-teal-600 text-[2rem] inline'/>
                        <span className='text-gray-300 tracking-widest lg:text-[1.3rem]'>RobinDev</span>
                    </div>
                    <h1 className="text-teal-600 text-[2.5rem] lg:text-[3rem] font-bold text-center lg:text-left mt-[2.5rem] lg:mt-[0rem] p-shadow">TENZIES-REACT</h1>
                    <p className='text-center lg:text-left p-shadow'>Roll until all the dice are the same. Click each die to freeze it ats its current value between rolls</p>
                </div>

                <form className="flex flex-col lg:flex-row gap-[0.5rem]" onSubmit={handleSubmit} >
                    <input
                        type="text"
                        placeholder="Enter your name here."
                        required
                        className="px-[1rem] py-[0.5rem] rounded-[5px] outline-none font-semibold"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength="10"
                    />
                    <button className="px-[1rem] py-[0.5rem] rounded-[5px] bg-teal-600 text-gray-950 font-semibold active:scale-[0.9]">Start Game</button>
                </form>
                {isLoading && <p className='text-teal-600 font-semibold text-center lg:text-left'>Initializing Please Wait...</p>}
            </div>
        </div>
     );
}

export default FrontPage;
