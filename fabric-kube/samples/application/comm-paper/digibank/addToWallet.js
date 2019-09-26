/*
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const user1 = 'Admin@atlantis.com' ;
const mMSP = 'AtlantisMSP';

// A wallet stores a collection of identities
const wallet = new FileSystemWallet('../identity/user/balaji/wallet');

async function main() {

    // Main try/catch block
    try {

        // Identity to credentials to be stored in the wallet
        const credPath = `/mnt/crypto-config/peerOrganizations/atlantis.com/users/${user1}`;
        console.log('credPath',credPath);
        const cert = fs.readFileSync(path.join(credPath, `/msp/signcerts/${user1}-cert.pem`)).toString();
        const key = fs.readFileSync(path.join(credPath, '/msp/keystore/08804427b711575c8c193fe5d738c509a5a65315166e79354238d8b01c04d444_sk')).toString();

        // Load credentials into wallet
        const identityLabel = 'Admin@org1.example.com';
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
