import { Address, address, Base58EncodedBytes, combineCodec, createRpc, createSolanaRpc, devnet, DevnetUrl, getBase58Encoder, Lamports, MainnetUrl, PendingRpcRequest, RpcDevnet, RpcFromTransport, RpcMainnet, RpcTestnet, SolanaRpcApiDevnet,  SolanaRpcApiFromTransport, SolanaRpcApiMainnet, SolanaRpcApiTestnet, TestnetUrl, } from "@solana/kit";
import { GenericUrl, LocalnetUrl, ModifiedClusterUrl, SolanaClientUrlOrMoniker } from "../types";
import { filters } from "jscodeshift/src/collections/JSXElement";


export async function getNFTAccountsFilter<TxCluster extends ModifiedClusterUrl>(urlOrMoniker:SolanaClientUrlOrMoniker | TxCluster
,owner:string,program:Address<string>){
 let clusterUrl: ModifiedClusterUrl;

  if (typeof urlOrMoniker === "string") {
    // case 1: moniker string
    switch (urlOrMoniker) {
      case "mainnet":
        clusterUrl = "https://api.mainnet-beta.solana.com" as MainnetUrl;
        break;
      case "devnet":
        clusterUrl = "https://api.devnet.solana.com" as DevnetUrl;
        break;
      case "testnet":
        clusterUrl = "https://api.testnet.solana.com" as TestnetUrl;
        break;
      case "localnet":
        clusterUrl = "http://127.0.0.1:8899" as LocalnetUrl;
        break;
      default:
        // If user passes some other string (already branded type or generic)
        clusterUrl = urlOrMoniker as ModifiedClusterUrl;
    }
  } else if (urlOrMoniker instanceof URL) {
    // case 2: URL object → convert to string & brand
    clusterUrl = urlOrMoniker.toString() as GenericUrl;
  } else {
    // case 3: already a ModifiedClusterUrl
    clusterUrl = urlOrMoniker;
  }

  // ✅ Now clusterUrl is always a ClusterUrl
    const rpc =  createSolanaRpc(clusterUrl);
    const response = await rpc.getTokenAccountsByOwner(address(owner),{
        programId:program, 
    }).send();

  return response

}


async function main() {
  const cluster = "devnet";

  // Example owner (public key in base58)
  const owner = "S6qY45yeSJrbGB4v6ioSCj3RfLZ8JVEPdU876vWWvCq";

  // Example SPL Token Program
  const program = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

  try {
    const accounts: Readonly<{
    account: Readonly<{
        executable: boolean;
        lamports: Lamports;
        owner: Address;
        rentEpoch: bigint;
        space: bigint;
    }> & Readonly<{
        data: Base58EncodedBytes;
    }>;
    pubkey: Address;
}>[]= (await getNFTAccountsFilter(cluster, owner, program));

    console.log("✅ Accounts fetched:", accounts);
  } catch (err) {
    console.error("❌ Error while fetching accounts:", err);
  }
}

main();
