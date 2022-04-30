import Head from 'next/head'
import { useState, useEffect, useCallback} from 'react'
import Web3 from 'web3'
import Abi from '../blockchain/counterABI'
import 'bulma/css/bulma.css' 
import styles from '../styles/Counterapp.module.css'

const CounterApp = () => {
    let contractAddress = "0xc0be1274B56264B601705763044ea681141Be427"
    const [error, setError] = useState('')
    const [warning, setWarning] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [counter, setCounter] = useState('')
    const [connectButtonText, setConnectButtonText] = useState('Connect Wallet')
    const [web3, setWeb3] = useState(new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/72c9518af24346be88fb264397e2859a")))
    const [connectedAddress, setAddress] = useState(undefined)
    const [counterContract, setCounterContract] = useState(new web3.eth.Contract(Abi, contractAddress))

    useEffect(() => {
        start()
        getCounterHandler()
    }, [counterContract])

    const getCounterHandler =  useCallback(async() => {
        try {
            const counter = await counterContract.methods.getCounter().call()
            setCounter(counter)
        } catch (err) {
            setError(err.message)
        }
    }, [])

    const start = () => {
        if(typeof connectedAddress == "undefined"){
            setConnectButtonText("Connect Wallet")
        }else{
            setConnectButtonText('Connected as ' + connectedAddress.substring(0, 5) + ". . ." + connectedAddress.substring(connectedAddress.length-4, connectedAddress.length))
        }

        let options = {
            filter: {
                value: [],
            },
            fromBlock: 0
        };
        
        counterContract.events.Increased(options)
            .on('data', event => getCounterHandler(), setWarning("Counter updated"))
            .on('changed', changed => setError(changed))
            .on('error', err => setError(err.message))
            .on('connected', str => console.log(str))

        counterContract.events.Decreased(options)
            .on('data', event => getCounterHandler(), setWarning("Counter updated"))
            .on('changed', changed => setError(changed))
            .on('error', err => setError(err.message))
            .on('connected', str => console.log(str))
      }

    const conectWalletHandler = async () => {
        if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
            try{
                await window.ethereum.request({method: "eth_requestAccounts"})
                web3 = new Web3(window.ethereum)
                setWeb3(web3)
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])
                setCounterContract(new web3.eth.Contract(Abi, contractAddress))
                setError('')
                setConnectButtonText('Connected as ' + accounts[0].substring(0, 5) + ". . ." + accounts[0].substring(accounts[0].length-4, accounts[0].length))
            }catch(err){
                setError(err.message)
            }
        }else{
            setError("Please install Metamask")
        }
    }

    const increaseHandler = async () => {
        try {
            await counterContract.methods.increase().send({
                from: connectedAddress
            })
            //getCounterHandler()
            setSuccessMsg("Counter increased!")
            setError('')
        } catch (err) {
            setError(err.message)
        }
    }
    const decreaseHandler = async () => {
        try {
            await counterContract.methods.decrease().send({
                from: connectedAddress
            })
            //getCounterHandler()
            setSuccessMsg("Counter decreased!")
            setError('')
        } catch (err) {
            setError(err.message)
        }
    }
    return(
        <div className={styles.main}>
            <Head>
            <title>Counter App</title>
            <meta name="description" content="A blockchain sample app" />
            </Head>
            <nav className="navbar mt-4 mb-4" role="navigation" aria-label="main navigation">
                <div className="container is-fluid">
                    <div className="navbar-brand">
                        <h1>Counter App</h1>
                    </div>
                    <div className="navbar-end">
                        <button onClick={conectWalletHandler} className="button is-primary">{connectButtonText}</button>
                    </div>
                </div>
            </nav>
            <section>
                
            </section>
            <section className='mt-4'>
                <div className='container'>
                    
                    <nav className='level'>
                        <div className='level-left'>
                            <div className="level-item">
                                <div className='container'>
                                    <h2>Counter: {counter}</h2>
                                </div>
                            </div>
                        </div>
                        <div className='level-right'>
                            <div className="level-item">
                                <label className='label'>Choose action: </label>
                                <button onClick={increaseHandler} className="button is-success mx-1">Increase</button>
                                <button onClick={decreaseHandler} className="button is-warning mx-1">Decrease</button>
                            </div>
                        </div>
                        
                    </nav>
                </div>
            </section>
            <section>
                <div className='container has-text-danger'>
                    <p>{error}</p>
                </div>
            </section>
            <section>
                <div className='container has-text-warning'>
                    <p>{warning}</p>
                </div>
            </section>
            <section>
                <div className='container has-text-success'>
                    <p>{successMsg}</p>
                </div>
            </section>
        </div>
    )
}

export default CounterApp