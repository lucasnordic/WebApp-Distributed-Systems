
const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 40, // When 40% of requests fail, trip the circuit
  resetTimeout: 2000, // After 2 seconds, try again.
};

function addSettings(breaker) {
  // When a fallback function is triggered, it's considered a failure, and the fallback function will continue to be executed until the breaker is closed.

  // when the breaker is open, this message is sent back to clientui
   breaker.fallback((result) =>{
     return {
       err: "Breaker is open. Out of service",
       personal_number: result.userId
     }
   });

  // Once the circuit has opened, a timeout is set based on options.resetTimeout. When the resetTimeout expires, opossum will enter the halfOpen state.
  // Once in the halfOpen state, the next time the circuit is fired, the circuit's action will be executed again.
  // If successful, the circuit will close and emit the close event. If the action fails or times out, it immediately re-enters the open state.

  breaker.on("open", () => {
    console.log("CircuitBreaker opened");
  });

  breaker.on("halfOpen", () => {
    console.log("CircuitBreaker halfOpened");
  });

  breaker.on("close", () => {
    console.log("CircuitBreaker closed");
  });
}

module.exports = { options, addSettings };
