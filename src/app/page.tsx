"use client";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction,
} from "@solana/spl-token";
import Link from "next/link";

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [txSig, setTxSig] = useState<string | null>(null)
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function getUserBalance() {
      if (!publicKey) {
        console.log("no pub key");
        return;
      }
      try {
        const balanceLamports = await connection.getBalance(publicKey);
        const balanceSol = balanceLamports / LAMPORTS_PER_SOL;
        setBalance(balanceSol);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
    getUserBalance();
  }, [connection, publicKey]);

  const link = () => {
    return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
  }

  const createMint = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!connection || !publicKey) {
      console.error('Connect your wallet!')
      return
    }

    const mint = new Keypair()
    const decimals = 3
    const lamports = await getMinimumBalanceForRentExemptMint(connection)

    const ix = SystemProgram.createAccount({
      fromPubkey: publicKey,
      lamports,
      newAccountPubkey: mint.publicKey,
      programId: TOKEN_PROGRAM_ID,
      space: MINT_SIZE
    })

    const ixCreateMint = createInitializeMintInstruction(mint.publicKey, decimals, publicKey, publicKey)
    const tx = new Transaction()
    tx.add(ix)
    tx.add(ixCreateMint)

    const sigx = await sendTransaction(tx, connection, {
      signers: [mint]
    })
    console.log('Successfull, this is the sigx', sigx)
    setTxSig(sigx)
    console.log(txSig)
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="rounded p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {publicKey
            ? `SOL Balance: ${balance !== null ? `${balance} SOL ` : "Loading..."}`
            : "Connect Your Wallet"}
        </h1>
        <form onSubmit={createMint}>
          <button
            // onClick={mintToken}
            // disabled={!walletAddress || loading}
            type="submit"
            className={`w-1/2 py-2 rounded text-white bg-green-500 hover:bg-green-600 mb-6`}
          >
            {"Create Mint"}
          </button>
        </form>
        {txSig && <div className="mt-6 text-left mb-10">
          <p className="text-gray-300 mb-2">
            <strong>Token Mint Address: </strong>{txSig}
          </p>
          <p className="text-gray-300 mb-2">
            <strong>View your transaction on:</strong>
          </p>
          <p className="text-blue-500 underline">
            <Link
              href={link()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Solana Explorer Link
            </Link>
          </p>
        </div>}
        <div className="w-full max-w-sm">
          <label className="block text-gray-300 text-1xl font-bold mb-2" htmlFor="amount">
            Token Mint
          </label>
          <input
            id="amount"
            type="text"
            placeholder="Enter amount"
            // value={mintAmount}
            // onChange={(e) => setMintAmount(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </main>
  );
}
