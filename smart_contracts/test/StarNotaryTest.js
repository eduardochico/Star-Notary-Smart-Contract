const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })
    
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            
            await this.contract.createStar('awesome star!', "story", "dec_10.25", "mag_23.25", "ra_12.23", 1, {from: accounts[0]})
            console.log(await this.contract.tokenIdToStarInfo(1));
            let starObj = await this.contract.tokenIdToStarInfo(1); 
            assert.equal(starObj[0], 'awesome star!')
            assert.equal(starObj[1], 'story')
            assert.equal(starObj[2], 'dec_10.25')
            assert.equal(starObj[3], 'mag_23.25')
            assert.equal(starObj[4], 'ra_12.23')
        })
    })

    describe('buying and selling stars', () => { 
        let user1 = accounts[1]
        let user2 = accounts[2]
        let randomMaliciousUser = accounts[3]
        
        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar('awesome star!', "story", "dec_10.25", "mag_23.25", "ra_12.23", starId, {from: user1})    
        })

        it('user1 can put up their star for sale', async function () { 
            assert.equal(await this.contract.ownerOf(starId), user1)
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
            assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })

    describe('star is unique', () => { 
        it('returns an error if try to create 2 stars with the same arguments', async function () { 
            
            await this.contract.createStar('awesome star!', "story", "dec_10.25", "mag_23.25", "ra_12.23", 1, {from: accounts[0]})
            try {
                await this.contract.createStar('awesome star2!', "story", "dec_10.25", "mag_23.25", "ra_12.23", 2, {from: accounts[1]})
            } catch(error) {
                console.log("Expected error thrown");
                return;
            }
            assert.fail("Expected error not thrown");
        })
    })



    describe('check if star exists', () => { 
        it('check if star exists after creation', async function () { 
            
            await this.contract.createStar('awesome star 2!', "story", "dec_10.15", "mag_23.25", "ra_12.23", 3, {from: accounts[0]})
            assert.equal(await this.contract.checkIfStarExist("dec_10.15", "mag_23.25", "ra_12.23"), true);
        })
    })



    describe('can grant approval to transfer', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () { 
            await this.contract.mint(accounts[0], tokenId, {from: accounts[0]})
            tx = await this.contract.approve(accounts[1], tokenId, {from: accounts[0]})
        })

        it('set user2 as an approved address', async function () { 
            assert.equal(await this.contract.getApproved(tokenId), accounts[1])
        })

        it('user2 can now transfer', async function () { 
            await this.contract.transferFrom(accounts[0], accounts[1], tokenId, {from: accounts[1]})

            assert.equal(await this.contract.ownerOf(tokenId), accounts[1])
        })

        it('emits the correct event', async function () { 
            assert.equal(tx.logs[0].event, 'Approval')
        })
    })

    describe('can set an operator', () => { 
        let tokenId = 1
        let tx 

        beforeEach(async function () { 
            await this.contract.mint(accounts[0], tokenId, {from: accounts[0]})

            tx = await this.contract.setApprovalForAll(accounts[2], true, {from: accounts[0]})
        })

        it('can set an operator', async function () { 
            assert.equal(await this.contract.isApprovedForAll(accounts[0], accounts[2]), true)
        })
    })

    
})