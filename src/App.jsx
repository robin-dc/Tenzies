import { useEffect, useState } from "react"
import FrontPage from "./components/FrontPage"
import Error from "./components/Error"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Tenzies from "./components/Tenzies"
import dices from "./data/dice"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

function App() {
  const [name, setName] = useState('')
  const [newDices, setNewDices] = useState([])
  const [rollAgain, setRollAgain] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if(isWin){
      setIsWin(false)
      setRollCount(0)
      setSeconds(0)
    }
    if(rollAgain) {
      setRollAgain(false)
    }
    generateDice()
  }, [rollAgain])

  function generateDice(){

    if(newDices.length === 0 || isWin){
      const newArray = []
      for(let i = 0; i < 10; i++){
        newArray.push(newDie())
      }
      setNewDices(newArray)
    }
    else{
      const newArray = newDices.map(die => {
        if(die.isHeld){
            return die
        }
        else{
          return newDie()
        }
      })
      setNewDices(newArray)
    }
  }

  function newDie(){
    return {...dices[Math.floor(Math.random() * dices.length)], id: nanoid()}
  }

  function Held(id){
    const newArray = newDices.map(die => {
      if(die.id === id){
        return {...die, isHeld: !die.isHeld}
      }
      else{
        return die
      }
    })
    setNewDices(newArray)
  }

  function checkWin(){
    const values = newDices.map(die => die.value)
    const check = values.every(die => die === values[0])

    if(check){
      setIsWin(true)
    }
  }

  return (
    <>
      {isWin && <div className="fixed top-0 left-0 bottom-0 right-0 pointer-events-none"><Confetti/></div>}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage name={name} setName={setName}/>}/>
          <Route path="/tenzies" element={<Tenzies
            name={name}
            dices={newDices}
            setRollAgain={setRollAgain}
            Held={Held}
            checkWin={checkWin}
            isWin={isWin}
            rollCount={rollCount}
            setRollCount={setRollCount}
            seconds={seconds}
            setSeconds={setSeconds}
            />}/>
            <Route path="*" element={<Error/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
