function commmaIntoArray(string){
    let array = string.split(",")
    let trimmedArray = array.map(e=>e.trim())
    return trimmedArray
  }

  module.exports=commmaIntoArray