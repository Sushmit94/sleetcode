import { db } from "./client";
import { problems } from "./schema";
import { nanoid } from "nanoid";

const PROBLEMS = [
    {
        id: nanoid(),
        title: "Hello Solidity",
        slug: "hello-solidity",
        difficulty: "Easy" as const,
        description: `## Hello Solidity

Write a contract that stores a \`uint256\` and lets anyone read it.

**Requirements:**
- A public state variable \`value\` of type \`uint256\`
- A constructor that sets \`value\` to \`42\`
- A \`getValue()\` function that returns the value
`,
        starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloSolidity {
    // Your code here
}
`,
        testCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract HelloSolidityTest is Test {
    HelloSolidity public c;

    function setUp() public {
        c = new HelloSolidity();
    }

    function test_getValue() public {
        assertEq(c.getValue(), 42);
    }

    function test_valueIsPublic() public {
        assertEq(c.value(), 42);
    }
}
`,
        tags: ["Basics"],
    },
    {
        id: nanoid(),
        title: "Simple Vault",
        slug: "simple-vault",
        difficulty: "Easy" as const,
        description: `## Simple Vault

Build a vault contract where users can deposit and withdraw ETH.

**Requirements:**
- \`deposit()\` payable: credits \`msg.value\` to \`msg.sender\`
- \`withdraw(uint256 amount)\`: sends \`amount\` ETH back to \`msg.sender\`
- \`balanceOf(address)\`: returns balance for any address
- Revert if withdrawing more than balance
`,
        starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleVault {
    // Your code here
}
`,
        testCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract SimpleVaultTest is Test {
    SimpleVault vault;
    address alice = address(0xA);

    function setUp() public {
        vault = new SimpleVault();
        vm.deal(alice, 10 ether);
    }

    function test_deposit() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();
        assertEq(vault.balanceOf(alice), 1 ether);
    }

    function test_withdraw() public {
        vm.prank(alice);
        vault.deposit{value: 2 ether}();

        vm.prank(alice);
        vault.withdraw(1 ether);
        assertEq(vault.balanceOf(alice), 1 ether);
        assertEq(alice.balance, 9 ether);
    }

    function test_revertOnOverdraw() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();

        vm.prank(alice);
        vm.expectRevert();
        vault.withdraw(2 ether);
    }
}
`,
        tags: ["ETH", "Storage"],
    },
    {
        id: nanoid(),
        title: "ERC20 from Scratch",
        slug: "erc20-from-scratch",
        difficulty: "Medium" as const,
        description: `## ERC20 from Scratch

Implement the core ERC20 token standard **without** using OpenZeppelin.

**Required functions:**
- \`totalSupply()\`
- \`balanceOf(address)\`
- \`transfer(address to, uint256 amount)\`
- \`approve(address spender, uint256 amount)\`
- \`allowance(address owner, address spender)\`
- \`transferFrom(address from, address to, uint256 amount)\`

**Constructor:** mint 1,000,000 tokens to \`msg.sender\` (use 18 decimals).
`,
        starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ERC20 {
    string public name = "SolToken";
    string public symbol = "SOL";
    uint8 public decimals = 18;

    // Your code here
}
`,
        testCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract ERC20Test is Test {
    ERC20 token;
    address alice = address(0xA);
    address bob   = address(0xB);

    function setUp() public {
        token = new ERC20();
    }

    function test_totalSupply() public {
        assertEq(token.totalSupply(), 1_000_000 * 1e18);
    }

    function test_transfer() public {
        token.transfer(alice, 100e18);
        assertEq(token.balanceOf(alice), 100e18);
    }

    function test_approve_transferFrom() public {
        token.transfer(alice, 500e18);
        vm.prank(alice);
        token.approve(bob, 100e18);

        vm.prank(bob);
        token.transferFrom(alice, bob, 100e18);
        assertEq(token.balanceOf(bob), 100e18);
    }

    function test_revertInsufficientBalance() public {
        vm.expectRevert();
        token.transfer(alice, type(uint256).max);
    }
}
`,
        tags: ["ERC20", "Tokens"],
    },
    {
        id: nanoid(),
        title: "Fix the Reentrancy Bug",
        slug: "fix-reentrancy",
        difficulty: "Medium" as const,
        description: `## Fix the Reentrancy Bug

The contract below has a critical reentrancy vulnerability. Fix it using the **checks-effects-interactions** pattern (do NOT use a mutex/ReentrancyGuard).

\`\`\`solidity
function withdraw() external {
    uint256 bal = balances[msg.sender];
    require(bal > 0);
    (bool ok,) = msg.sender.call{value: bal}("");
    require(ok);
    balances[msg.sender] = 0; // bug: state updated AFTER external call
}
\`\`\`

Implement the full fixed contract below.
`,
        starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SafeVault {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "nothing to withdraw");
        // Fix the reentrancy vulnerability here
        (bool ok,) = msg.sender.call{value: bal}("");
        require(ok, "transfer failed");
        balances[msg.sender] = 0;
    }
}
`,
        testCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract Attacker {
    SafeVault vault;
    uint256 attackCount;

    constructor(SafeVault _vault) { vault = _vault; }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        attackCount = 0;
        vault.withdraw();
    }

    receive() external payable {
        if (attackCount < 3 && address(vault).balance >= 1 ether) {
            attackCount++;
            vault.withdraw();
        }
    }
}

contract ReentrancyTest is Test {
    SafeVault vault;
    address victim = address(0xV);

    function setUp() public {
        vault = new SafeVault();
        vm.deal(victim, 5 ether);
        vm.prank(victim);
        vault.deposit{value: 5 ether}();
    }

    function test_attackerCannotDrain() public {
        Attacker attacker = new Attacker(vault);
        vm.deal(address(attacker), 1 ether);
        attacker.attack{value: 0}();

        // attacker should only get their 1 ether back, not drain victim
        assertEq(vault.balances(victim), 5 ether, "victim drained");
    }

    function test_normalWithdraw() public {
        vm.prank(victim);
        vault.withdraw();
        assertEq(address(victim).balance, 5 ether);
    }
}
`,
        tags: ["Security", "Reentrancy"],
    },
    {
        id: nanoid(),
        title: "Multisig Wallet",
        slug: "multisig-wallet",
        difficulty: "Hard" as const,
        description: `## Multisig Wallet

Build a 2-of-3 multisig wallet.

**Requirements:**
- Constructor accepts 3 owner addresses
- \`submitTx(address to, uint256 value, bytes calldata data)\` — any owner can propose a tx, returns \`txId\`
- \`approveTx(uint256 txId)\` — owner approves; auto-executes when 2/3 approved
- \`executed[]\` — public mapping tracking which txIds have been executed
- Revert if non-owner calls submit or approve
- Revert on double-approve by the same owner
`,
        starterCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultisigWallet {
    address[3] public owners;

    // Your code here
}
`,
        testCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Solution.sol";

contract MultisigTest is Test {
    MultisigWallet wallet;
    address a = address(0x1);
    address b = address(0x2);
    address c = address(0x3);
    address receiver = address(0x99);

    function setUp() public {
        wallet = new MultisigWallet(a, b, c);
        vm.deal(address(wallet), 10 ether);
    }

    function test_submitAndExecute() public {
        vm.prank(a);
        uint256 txId = wallet.submitTx(receiver, 1 ether, "");

        vm.prank(b);
        wallet.approveTx(txId);

        assertEq(wallet.executed(txId), true);
        assertEq(receiver.balance, 1 ether);
    }

    function test_noDoubleApprove() public {
        vm.prank(a);
        uint256 txId = wallet.submitTx(receiver, 1 ether, "");

        vm.prank(a);
        vm.expectRevert();
        wallet.approveTx(txId);
    }

    function test_nonOwnerReverts() public {
        vm.prank(address(0xDEAD));
        vm.expectRevert();
        wallet.submitTx(receiver, 1 ether, "");
    }
}
`,
        tags: ["Governance", "Advanced"],
    },
];

async function seed() {
    console.log("Seeding problems...");
    for (const p of PROBLEMS) {
        await db.insert(problems).values(p).onConflictDoNothing();
        console.log(`  ✓ ${p.title}`);
    }
    console.log("Done.");
    process.exit(0);
}

seed().catch(console.error);