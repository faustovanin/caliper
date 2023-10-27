/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { randomDate2000 } = require('./utils.js');
const fs = require('fs');

const event = {
    "@context": "https://gs1.github.io/EPCIS/epcis-context.jsonld",
    "eventID": "ni:///sha-256;df7bb3c352fef055578554f09f5e2aa41782150ced7bd0b8af24dd3ccb30ba69?ver=CBV2.0",
    "type": "ObjectEvent",
    "action": "OBSERVE",
    "bizStep": "shipping",
    "disposition": "in_transit",
    "epcList": ["urn:epc:id:sgtin:0614141.107346.2017","urn:epc:id:sgtin:0614141.107346.2018"],
    "eventTimeZoneOffset": "-06:00",
    "readPoint": {"id": "urn:epc:id:sgln:0614141.07346.1234"},
    "bizTransactionList": [  {"type": "po", "bizTransaction": "http://transaction.acme.com/po/12345678" }  ]
}
/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
        this.productFile = 'productids.txt';

        fs.writeFileSync(this.productFile, '');
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        this.txIndex++;

        event.eventID = "ni:///sha-256;" + Math.floor(Math.random() * 1000000).toString(16) +"?ver=CBV2.0"
        event.epcList= ["urn:epc:id:sgtin:" + Math.floor(Math.random() * 1000000).toString()];
        let customDate = randomDate2000()
        event.eventTime = customDate.toISOString().replace('Z', '000-06:00');

        let args = {
            contractId: 'traceability',
            contractVersion: 'v1',
            contractFunction: 'onEvent',
            contractArguments: [JSON.stringify(event)],
            timeout: 30
        };

        fs.appendFileSync(this.productFile, event.eventID+'\n');

        const res = await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateCarWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
