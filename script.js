if(typeof web3 != 'undefined') { 
    web3 = new Web3(web3.currentProvider) // what Metamask injected 
} else {
    // Instantiate and set Infura as your provider
    web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/f9127b3c7dd749d298279befc12c4f41"));
}

// The default (top) wallet account from a list of test accounts 
if(web3.eth.accounts[0] != null) {
    web3.eth.defaultAccount = web3.eth.accounts[0];
} else {
    web3.eth.defaultAccount = "0x5269831Aa91d3Fe1860F537a18bFDFf3826268F6";
}

console.log(web3.eth.defaultAccount);
// The interface definition for your smart contract (the ABI) 
var StarNotary = web3.eth.contract(ABI);
// Grab the contract at specified deployed address with the interface defined by the ABI
var starNotary = StarNotary.at('0x60643a96cb011bad20adb31a2946e93220ab8cfc');

// Enable claim button being clicked
function claimButtonClicked() { 
    console.log("ejecución 1")
     web3.eth.getAccounts(function(error, accounts) { 
        if (error) { 
            console.log(error)
            return
        }
        //console.log("ejecución 2")
        var account = web3.eth.defaultAccount;

        var starName = document.getElementById("star-name-input").value;
        var starStory = document.getElementById("star-story-input").value;
        var star_dec = document.getElementById("star-dec-input").value;
        var star_mag = document.getElementById("star-mag-input").value;
        var star_cent = document.getElementById("star-cent-input").value;
        var star_token = document.getElementById("star-token-input").value;



        starNotary.createStar(starName, starStory, star_dec, star_mag, star_cent, star_token, {from: account, gasLimit:"5000000"}, function (error, result) {
            if (!error) {
                document.getElementById("result").innerHTML = "Transaction: <a href='https://rinkeby.etherscan.io/tx/"+result+"' target='_blank'>"+result+"</a>";
                document.getElementById("star-tx-input").value = star_token = document.getElementById("star-token-input").value;
            } else { 
                console.log(error);
                console.log("errorrrr");
            }
        });
       
    });
    
}


function lookupStar() { 
    web3.eth.getAccounts(function(error, accounts) { 
        if (error) { 
            console.log(error)
            return
        }
        var account = web3.eth.defaultAccount;

        var starTx = document.getElementById("star-tx-input").value;
        

        starNotary.tokenIdToStarInfo(starTx, function (error, result) {
            if (!error) {
                //console.log(result);
                document.getElementById("star-name").innerText = result[0];
                document.getElementById("star-story").innerText = result[1];
                document.getElementById("star-dec").innerText = result[2];
                document.getElementById("star-mag").innerText = result[3];
                document.getElementById("star-cent").innerText = result[4];
                
            } else { 
                console.log(error);
            }
        });
       
    })
}
