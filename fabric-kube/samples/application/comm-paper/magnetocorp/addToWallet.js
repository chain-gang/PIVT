/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const user1 = 'User1@atlantis.com' ;
const mMSP = 'AtlantisMSP';

// A wallet stores a collection of identities
const wallet = new FileSystemWallet('../identity/user/isabella/wallet');

async function main() {

    // Main try/catch block
    try {

        // Identity to credentials to be stored in the wallet
        const credPath = '/mnt/crypto-config/peerOrganizations/atlantis.com/users/User1@atlantis.com';
        const cert = fs.readFileSync(path.join(credPath, `/msp/signcerts/${user1}-cert.pem`)).toString();
        console.log(cert);
        const key = fs.readFileSync(path.join(credPath, '/msp/keystore/97e685d320378ba6c66fad7af28ae0422689cbbc8a0388af8fbc9c91faa3e8e5_sk')).toString();
        console.log(key);

        // Load credentials into wallet
        const identityLabel = user1;
        const identity = X509WalletMixin.createIdentity(mMSP, cert, key);

        await wallet.import(identityLabel, identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main().then(() => {
    console.log('done');
}).catch((e) => {
    console.log(e);
    console.log(e.stack);
    process.exit(-1);
});
