import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { AiFillThunderbolt } from 'react-icons/ai';
import { FaTrophy } from 'react-icons/fa';
import AOS from "aos"
import "aos/dist/aos.css"
import { useNavigate } from 'react-router-dom';

function Tenzies({name, dices, setRollAgain, Held, checkWin, isWin, rollCount, setRollCount, seconds, setSeconds}) {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isHighScore, setIsHighScore] = useState(false);

    useEffect(() => {
        AOS.init({
          duration: 700,
          easing: "ease-in-out",
          once: true,
        });

        if(!name){
            navigate('/')
        }
      }, [name, navigate]);

    useEffect(() => {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);
      }
      else if (!isActive && seconds !== 0) {
        clearInterval(interval);
      }
      if(isWin){
        clearInterval(interval);
        setIsActive(false)
      }

      return () => {
        clearInterval(interval);
      };
    }, [isActive, seconds, isWin]);

    // CalculateAccuracy
    const calculation = (Math.min(100,(dices.length / rollCount) * (60 / seconds) * 100));
    const accuracy = Math.round(calculation * 100) / 100
    const highscore = JSON.parse(localStorage.getItem('Tenzies'))

    useEffect(() => {
        if(isWin){
            if(!highscore){
                localStorage.setItem('Tenzies', JSON.stringify({
                    name: name && name[0].toUpperCase() + name.slice(1),
                    rollCount: rollCount,
                    seconds: seconds,
                    accuracy: accuracy
                }))
            }
            else if(highscore && highscore.accuracy < accuracy) {
                localStorage.setItem('Tenzies', JSON.stringify({
                    name: name && name[0].toUpperCase() + name.slice(1),
                    rollCount: rollCount,
                    seconds: seconds,
                    accuracy: accuracy
                }))
                setIsHighScore(true)
                setTimeout(() => {
                    setIsHighScore(false)
                }, 3000)
            }
            else if(highscore && highscore.accuracy === accuracy){
                const playerRate = rollCount + seconds
                const storedRate = highscore.rollCount + highscore.seconds

                if(playerRate < storedRate){
                    localStorage.setItem('Tenzies', JSON.stringify({
                        name: name && name[0].toUpperCase() + name.slice(1),
                        rollCount: rollCount,
                        seconds: seconds,
                        accuracy: accuracy
                    }))
                }
                setIsHighScore(true)
                setTimeout(() => {
                    setIsHighScore(false)
                }, 3000)
             }
        }
    }, [isWin])

    useEffect(() => {
        window.addEventListener('click', () => {
            setIsOpen(false)
        })

        return () => {
            window.removeEventListener('click', () => {
                    setIsOpen(false)
            })
        }
    }, [])
    return (
        <div className='container' data-aos="fade-zoom-in">
            <nav className='py-[1.4rem] flex justify-between relative'>
                <div className='flex gap-[0.5rem] items-center'>
                    <AiFillThunderbolt className='text-teal-600 text-[2rem] inline'/>
                    <h3 className="text-gray-300 tracking-widest lg:text-[1.3rem]">Player {name && name[0].toUpperCase() + name.slice(1)}</h3>
                </div>
                <div className='flex gap-[0.5rem] items-center'>
                    <h3 className="text-gray-300 tracking-widest lg:text-[1.3rem]">Rolls: {rollCount}</h3>
                    <FaTrophy
                        className='text-yellow-500 text-[1.3rem] cursor-pointer'
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsOpen(prevState => !prevState)
                        }}
                    />
                </div>
                {isOpen && <div className="absolute bg-white shadow-2xl p-[1.5rem] rounded-[10px] right-[0rem] top-[4rem] z-[100]">
                    <h4 className='font-semibold text-teal-600 mb-2'>Leaderboards</h4>
                    {highscore ?
                        <div>
                            <p className='text-gray-950 font-medium'>Player: {highscore.name}</p>
                            <p className='text-gray-950 font-medium'>Rolls: {highscore.rollCount}</p>
                            <p className='text-gray-950 font-medium'>Time: {highscore.seconds}</p>
                            <p className='text-gray-950 font-medium'>Accuracy: {highscore.accuracy}%</p>
                        </div>
                        :
                        <p className='text-gray-950 font-medium'>No Games Played</p>
                    }
                </div>}
            </nav>
            <main className='grid grid-cols-3 grid-rows-4 lg:grid-cols-5 lg:grid-rows-2 gap-[1rem] px-[1rem] py-[3rem] lg:p-[3rem] items-center'>
                {dices && dices.map(die => (
                    <button
                        key={nanoid()}
                        className={`die ${die.isHeld ? "bg-teal-600" : ""}`}
                        onClick={() => {
                            Held(die.id)
                            checkWin()
                            setIsActive(true)
                        }}
                        disabled={isWin}
                    >
                        <img src={die.img} alt="" className='pointer-events-none'/>
                    </button>
                ))}
            </main>
            <div className="flex justify-center">
                <button className='bg-teal-600 py-[0.8rem] px-[3rem] text-gray-950 font-bold rounded-[5px] active:scale-[0.95]' onClick={() => {
                    setRollCount(prevCount => prevCount + 1)
                    setRollAgain(true)
                    setIsActive(true)
                }}>{isWin ? `Won with ${accuracy}% accuracy! Play Again?` : "Roll the Dice"}</button>
            </div>
            <h3 className="text-gray-300 tracking-widest lg:text-[1.3rem] absolute -bottom-[6rem] pb-[1rem] right-[50%] translate-x-[50%] lg:bottom-1 lg:right-[6rem] lg:pb-0">Time: {seconds}s</h3>
            <div className={`absolute ${isHighScore ? "top-[50%]":"top-[-500%]"} left-[50%] translate-x-[-50%] translate-y-[-50%] h-screen flex justify-center items-center bg-[#00000081] w-screen transition duration-300`}>
                <h1 className='text-yellow-600 text-center text-shadow font-bold text-[3rem] leading-[3rem]'>YOU BEAT THE HIGHSCORE</h1>
            </div>
        </div>

     );
}

export default Tenzies;
