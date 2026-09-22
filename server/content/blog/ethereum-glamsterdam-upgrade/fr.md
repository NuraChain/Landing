Ethereum publie désormais ses mises à jour de protocole à un rythme d'environ six mois, et Glamsterdam est la prochaine sur la liste. Elle est entrée en phase finale de développement en juin 2026 et son activation est attendue au second semestre. Si vous écrivez du Solidity ou faites tourner un nœud, autant savoir ce qu'elle contient avant qu'elle n'arrive.

## Les deux changements qui comptent

Les points marquants sont les listes d'accès au niveau du bloc et la séparation proposeur-constructeur inscrite dans le protocole.

- **Les listes d'accès au niveau du bloc** annoncent à l'avance quels comptes et quels emplacements de stockage un bloc va toucher. Un nœud qui connaît la liste d'avance peut lire cet état en parallèle et exécuter simultanément les transactions qui ne se chevauchent pas, au lieu de les enchaîner strictement.
- **La séparation proposeur-constructeur inscrite** grave dans le protocole lui-même la répartition entre le validateur qui propose un bloc et le constructeur qui l'assemble, plutôt que de la laisser à des relais hors chaîne sur lesquels tout le monde compte et que personne n'est tenu d'exploiter.

Ni l'un ni l'autre ne change le bytecode vers lequel vos contrats compilent. Les deux changent ce qu'un bloc peut contenir.

## Au fond, c'est une histoire de limite de gaz

L'exécution séquentielle explique pourquoi la limite de gaz du réseau principal reste prudente : chaque nœud rejoue chaque transaction dans l'ordre. Dès qu'un bloc déclare ses accès à l'état à l'avance, ce rejeu cesse d'être le goulot d'étranglement et le plafond peut monter. Les chiffres discutés vont d'environ 60 millions de gaz par bloc aujourd'hui à quelque chose de proche de 200 millions.

Plus de gaz par bloc, c'est plus de place pour les mêmes contrats, pas pour d'autres. C'est un changement de capacité, pas de langage.

## Ce que vous avez réellement à faire

Très peu de choses, si vous utilisez l'outillage habituel.

- Solidity, Hardhat et Foundry visent l'EVM, et ces propositions ne modifient pas la sémantique des opcodes contre lesquels vous écrivez.
- Les bibliothèques clientes comme ethers.js et viem construisent déjà des transactions EIP-1559 par défaut, et c'est la partie du marché des frais que vos utilisateurs ressentent.
- Si vous exploitez votre propre nœud ou un indexeur, lisez sérieusement les notes de version. Ce qui change, c'est la structure du bloc, et la structure du bloc est exactement ce que l'infrastructure analyse.

## Ce que cela signifie sur les autres chaînes EVM

Les réseaux EVM n'héritent pas automatiquement des mises à jour amont. Chaque chaîne décide des EIP qu'elle adopte et du moment. Ce dont elles héritent, c'est de l'outillage, et c'est ce qui fait d'un nouveau réseau une ligne de configuration plutôt qu'une réécriture.

Nura Chain tarife déjà ses transactions avec des frais de base EIP-1559, comme Ethereum depuis London, si bien qu'une bibliothèque écrite ces dernières années fonctionne sans modification. La mécanique est décrite dans [comment Nura Chain exécute le bytecode EVM](/blog/nura-chain-evm-compatibility), et le point d'accès dans [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc).

Les calendriers de mise à jour bougent. Consultez [ethereum.org](https://ethereum.org) plutôt que cette page avant de bâtir un plan sur une date.
