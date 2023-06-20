const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const {
    shouldBehaveLikeERC20,
    shouldBehaveLikeERC20Transfer,
    shouldBehaveLikeERC20Approve,
} = require('./erc20.behavior');

const DvTokenFactory = artifacts.require('DvTokenFactory');
const DvToken = artifacts.require('DvToken');

contract('ERC20', function (accounts) {
    const [initialHolder, recipient, anotherAccount] = accounts;

    const name = 'My Token';
    const symbol = 'MTKN';

    const initialSupply = new BN(100000);

    factory = null;

    before(async function () {
        factory = await DvTokenFactory.new();
        await factory.setRecipient(accounts[2], { from: accounts[0] });
        await factory.setFee(1000, 1000, { from: accounts[0] });
    });

    beforeEach(async function () {
        const t = await factory.issue(name, symbol, 10, initialSupply, { from: accounts[0], value: 100000 });
        this.token = await DvToken.at(t.receipt.rawLogs[0].address);
        await this.token.setRoyalty(10, { from: accounts[0] });
        await this.token.setRoyaltyReceiver(accounts[2], { from: accounts[0] });
    });

    it('has a name', async function () {
        expect(await this.token.name()).to.equal(name);
    });

    it('has a symbol', async function () {
        expect(await this.token.symbol()).to.equal(symbol);
    });

    it('has 10 decimals', async function () {
        expect(await this.token.decimals()).to.be.bignumber.equal('10');
    });

    shouldBehaveLikeERC20('ERC20', initialSupply, initialHolder, recipient, anotherAccount);

    describe('decrease allowance', function () {
        describe('when the spender is not the zero address', function () {
            const spender = recipient;

            function shouldDecreaseApproval(amount) {
                describe('when there was no approved amount before', function () {
                    it('reverts', async function () {
                        await expectRevert(
                            this.token.decreaseAllowance(spender, amount, { from: initialHolder }),
                            'ERC20: decreased allowance below zero',
                        );
                    });
                });

                describe('when the spender had an approved amount', function () {
                    const approvedAmount = amount;

                    beforeEach(async function () {
                        await this.token.approve(spender, approvedAmount, { from: initialHolder });
                    });

                    it('emits an approval event', async function () {
                        expectEvent(
                            await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder }),
                            'Approval',
                            { owner: initialHolder, spender: spender, value: new BN(0) },
                        );
                    });

                    it('decreases the spender allowance subtracting the requested amount', async function () {
                        await this.token.decreaseAllowance(spender, approvedAmount.subn(1), { from: initialHolder });

                        expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('1');
                    });

                    it('sets the allowance to zero when all allowance is removed', async function () {
                        await this.token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });
                        expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
                    });

                    it('reverts when more than the full allowance is removed', async function () {
                        await expectRevert(
                            this.token.decreaseAllowance(spender, approvedAmount.addn(1), { from: initialHolder }),
                            'ERC20: decreased allowance below zero',
                        );
                    });
                });
            }

            describe('when the sender has enough balance', function () {
                const amount = initialSupply;

                shouldDecreaseApproval(amount);
            });

            describe('when the sender does not have enough balance', function () {
                const amount = initialSupply.addn(1);

                shouldDecreaseApproval(amount);
            });
        });

        describe('when the spender is the zero address', function () {
            const amount = initialSupply;
            const spender = ZERO_ADDRESS;

            it('reverts', async function () {
                await expectRevert(
                    this.token.decreaseAllowance(spender, amount, { from: initialHolder }),
                    'ERC20: decreased allowance below zero',
                );
            });
        });
    });

    describe('increase allowance', function () {
        const amount = initialSupply;

        describe('when the spender is not the zero address', function () {
            const spender = recipient;

            describe('when the sender has enough balance', function () {
                it('emits an approval event', async function () {
                    expectEvent(await this.token.increaseAllowance(spender, amount, { from: initialHolder }), 'Approval', {
                        owner: initialHolder,
                        spender: spender,
                        value: amount,
                    });
                });

                describe('when there was no approved amount before', function () {
                    it('approves the requested amount', async function () {
                        await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                        expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
                    });
                });

                describe('when the spender had an approved amount', function () {
                    beforeEach(async function () {
                        await this.token.approve(spender, new BN(1), { from: initialHolder });
                    });

                    it('increases the spender allowance adding the requested amount', async function () {
                        await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                        expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
                    });
                });
            });

            describe('when the sender does not have enough balance', function () {
                const amount = initialSupply.addn(1);

                it('emits an approval event', async function () {
                    expectEvent(await this.token.increaseAllowance(spender, amount, { from: initialHolder }), 'Approval', {
                        owner: initialHolder,
                        spender: spender,
                        value: amount,
                    });
                });

                describe('when there was no approved amount before', function () {
                    it('approves the requested amount', async function () {
                        await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                        expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
                    });
                });

                describe('when the spender had an approved amount', function () {
                    beforeEach(async function () {
                        await this.token.approve(spender, new BN(1), { from: initialHolder });
                    });

                    it('increases the spender allowance adding the requested amount', async function () {
                        await this.token.increaseAllowance(spender, amount, { from: initialHolder });

                        expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
                    });
                });
            });
        });

        describe('when the spender is the zero address', function () {
            const spender = ZERO_ADDRESS;

            it('reverts', async function () {
                await expectRevert(
                    this.token.increaseAllowance(spender, amount, { from: initialHolder }),
                    'ERC20: approve to the zero address',
                );
            });
        });
    });


});
