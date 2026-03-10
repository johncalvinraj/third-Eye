'use client'
import styles from  "./page.module.css";
import {useState} from "react";
import logo from './THIRD EYE.jpeg'
import Image from 'next/image'

export default function Home() {
  let [username, setUsername] = useState()
  let [password, setPassword] = useState()
  let [text, setText] = useState('Learn More')
  let [info, setInfo] = useState('')
  function check () {
    if (username === 'policeman' && password === 'nocrime') {
      window.location.replace('./home')
    }
  }
  function submit (event) {
    console.log(event.key)
    if(event.key === "Enter") {
      check()
      event.preventDefault()
    }
  }
  function changeText () {
    if (text === 'Learn More'){
      setText('Show Less')
      setInfo('As this is a prototype there is no login functionality and this is basically a dummy page. Username is policeman and password is nocrime')
    } 
    else {
      setText('Learn More')
      setInfo('')
    }
  }

  return (<>
<div className = {styles["container"]}>
  <div id = {styles['complete-wrapper']}>
    <div id = {styles['box-container']}>
      <div id = {styles['header']}>
        <h1 id = {styles['explainer']} className = {styles['text']} onClick = {changeText}>{text}</h1>
        <div id = {styles['centerer']}>
          <Image src={logo} height={150} width={150} id = {styles['img']}/>
        </div>
      </div>
      <br></br>
      <br></br>
      <div id = 'username'>
        <h1 className = {styles['text']}>User Name</h1>
        <form>
          <input onChange= {(event)=>{setUsername(event.target.value)}} onKeyDown={submit} type = 'text' placeholder = "policeman"></input>
        </form>
      </div>
      <div id = 'password'>
        <h1 className = {styles['text']}>Password</h1>
        <form>
          <input onChange= {(event)=>{setPassword(event.target.value)}} onKeyDown = {submit} type = 'password' placeholder = "nocrime"></input>
        </form>
      </div>
      <div id = {styles['button']} onClick = {check}>
        <h3 className = {styles['text']}>Sign In</h3>
      </div>
    </div>
  </div>
  </div>
  </>);
}
