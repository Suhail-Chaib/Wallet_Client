import { PublicKey } from "../../../../RSA-Module/types";

export interface PrivateKeyModel {
    d: string; 
    publicKey: PublicKey;
}
