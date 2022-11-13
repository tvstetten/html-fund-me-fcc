// in nodejs
//    use "require"

// in front-end javascript you can't use require!!!
//    use "import"
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

async function connect() {
    if (isEthereumDefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
    }
}

async function withdraw() {
    if (isConnected()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        console.log("Withdrawing...")
        try {
            const txResponse = contract.withdraw()
            await listenForTransactionMine(txResponse, provider)
            console.log("Done!")
        } catch (e) {
            console.log(e)
        }
    }
}

// fund
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    if (isConnected() && ethAmount) {
        // What do we need to fund?
        // provider / connection to the blockchain
        // signer / wallet / someone with some gas
        // Contract that we are interacting with
        //  Need to connect MetaMask with our hardhat RCP (localhost:????)
        // 13:22:10
        // ABI & address
        console.log(`Funding ${ethAmount} ETH...`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(txResponse, provider)
        } catch (e) {
            console.log(e)
        }
        console.log("Done!")
    }
}

async function getBalance() {
    if (isConnected()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            const balance = await provider.getBalance(contractAddress)

            console.log(
                `The balance is ${ethers.utils.formatEther(balance)} ETH`
            )
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    // create a new promise
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

function isEthereumDefined() {
    if (typeof window.ethereum !== "undefined") {
        return true
    } else {
        console.connectButton.innerHTML = "Please install MetaMask!"
        return false
    }
}

function isConnected() {
    return isEthereumDefined()
    // if (!isEthereumDefined()) {
    //     console.log("No Ethereum Wallet connected")
    //     return false
    // } else {
    //     if window.ethereum.{

    // }
}
