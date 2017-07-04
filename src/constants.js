
const EXPECTED_NUM_OF_ENTRIES = 8;
const PEER_JS_API_KEY = "";
const EXPECTED_NUM_ZEROES = 1;

module.exports = {
  EXPECTED_NUM_ZEROES: EXPECTED_NUM_ZEROES,
  EXPECTED_NUM_OF_ENTRIES: EXPECTED_NUM_OF_ENTRIES,
  PEER_JS_API_KEY: PEER_JS_API_KEY,
  doWork: DO_WORK,
  doesWorkPass: DOES_WORK_PASS,
};

function DO_WORK(hash, nonce){

}

function DOES_WORK_PASS(result){
  return !result.substring(0, EXPECTED_NUM_ZEROES).split("").some(function(char){
    return char !== "0";
  });
}
