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
const fs = require('fs');

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

        const productFile = 'productids.txt';
        this.idList = []

        fs.readFile(productFile, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file: ${err}`);
            return;
          }
      
          this.idList = data.split('\n');
          console.log('File loaded into an array of lines:');
        });
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
      let productId = this.idList[this.txIndex];
      this.txIndex++;

      let args = {
          contractId: 'traceability',
          contractVersion: 'v1',
          contractFunction: 'getProduct',
          contractArguments: [productId],
          timeout: 30,
          readOnly: true
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
