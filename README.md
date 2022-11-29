# Dev Wallet
This library provides an embedded Ethereum wallet that makes local development with a non-persistent environment extremely easy, compared to using an external wallet, such as MetaMask. It uses the default first account used by Hardhat (and Foundry / pretty much all dev nodes), but this can be easily overriden. Using this library instead of MetaMask or another browser wallet eliminates the following painpoints:

- Having to worry about funding your own dev wallet when restarting a node
- Needing to switch networks to Localhost on your main wallet
- Possibly forgetting to switch networks and accidentally running a transaction on Mainnet
- Having to deal with an alternative routing to the local node (ie. if using dev container development, the local node might not be at "localhost")

Using the Dev Wallet within your project is extremely easy. All you have to do is import the library (at the earliest possible point), and it will override `window.ethereum` with Dev Wallet. You should make sure to only do this in local dev environments, or staging environments where you don't want to have the user use their own wallet.

```javascript
import '@carlosdp/dev-wallet';

initializeDevWallet(provider);
```

or

```html
<html>
  <head>
    <script type="module">
      import { initializeDevWallet } from 'https://unpkg.com/@carlosdp/dev-wallet@^1.0.0';

      initializeDevWallet(provider);
    </script>
  </head>
</html>
```

## License
This project is dual-licensed under MIT and Apache 2.0.