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

const event = {
  "@context": "https://gs1.github.io/EPCIS/epcis-context.jsonld",
  "type": "ObjectEvent",
  "action": "OBSERVE",
  "bizStep": "shipping",
  "disposition": "in_transit",
  "epcList": [],
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
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        this.txIndex++;

        event.eventID = "ni:///sha-256;" + Math.floor(Math.random() * 1000000).toString(16) +"?ver=CBV2.0"
        event.epcList= ["urn:epc:id:sgtin:" + Math.floor(Math.random() * 1000000).toString()];
        event.eventTime = randomDate2000().toISOString();

        let args = {
            contractId: 'epcis',
            contractVersion: 'v1',
            contractFunction: 'CaptureEventHash',
            contractArguments: [event.eventID],
            timeout: 30
        };

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
