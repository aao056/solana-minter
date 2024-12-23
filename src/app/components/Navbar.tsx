'use client'
import dynamic from "next/dynamic"
import { useWallet } from "@solana/wallet-adapter-react"

const WalletMultiButtonDynamic = dynamic(
    async () =>
        (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
)

const Navbar = () => {
    const wallet = useWallet()

    return (
        <div className="flex justify-between space-x-3 p-5 absolute w-screen">
            <div className="text-color-blue">Solana Token Mint</div>
            <div>
                <WalletMultiButtonDynamic>
                    {wallet.publicKey ? `${wallet.publicKey.toBase58().substring(0, 7)}...` : "Connect button"}
                </WalletMultiButtonDynamic>
            </div>
        </div>
    )
}

export default Navbar