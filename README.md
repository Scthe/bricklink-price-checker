## Bricklink price checker for firefox

This browser extension allows to easier check the price of a LEGO piece from the bricklink store listing.

> This extension only works on firefox (see FAQ below).

An alternative to buying the whole LEGO sets is to use [bricklink](https://www.bricklink.com/v2/main.page). It's an unofficial LEGO bricks catalogue, listing all variations and colors. So when You need just a few last pieces to finish the next model, it's easiest to create a bricklink wishlist and find the store online. Each piece has a [price history](https://www.bricklink.com/v2/catalog/catalogitem.page?P=3003&name=Brick%202%20x%202&category=%5BBrick%5D#T=P&C=5) split between new and used parts. When completing the order, You may want to mix and match different stores to get the most advantageous prices. There are many shops around the world from where You can buy the bricks, so it actually not trivial to find the cheapest combination (do not forget about delivery costs!).

The biggest problem with the store inventory listing page is that it only has a price for this particular shop. Having a price of $1 is just not enough. e.g. other shops may sell exact same brick for $0.50. Checking this manually gets quite tedious. Bricklink allows to specify maximum price for each item in the wishlist, but I feel like this is just a half measure. This browser extension adds a new `Check Price` button for each inventory entry that will show the cheapest available price globally. This way it's much easier to make an informed decision. And since LEGO is very expensive, the money saving potential is quite big.


![ext-preview]
*The __first row__ shows the normal bricklink shop listing layout. We are presented with a price, but we do not know if it is high or low. In __second row__, there is a new `Check Price` button added by this extension. After user clicks it, the data shown in __row 3__ will be added.*


## How does it work?

The cool part of browser extensions is that You can take an existing site developed by someone else and add Your own custom features. The not so nice part is that You don't have the full access to the data while doing so. Unless the data store is added to `window` or in public redux store, You will have to hack Your way around.

The biggest problem that I had to solve was to determine which LEGO part the user has clicked. In the HTML You can find the name and the color, but not stuff like a piece ID or even exact type. The solution I've chosen is to intercept the `store/searchitems` AJAX request and use the response to get the rest of required data. This.. *works*, but that's the only good thing about this solution. And by works I mean only firefox (no such API on chrome). At some point even I could not find a nice way for error handling, so that speaks volume how hacky this thing is.


#### Timeline of actions done by this extension

1. **USER** enters the page of a store inventory listing
1. **BROWSER** sends the `store/searchitems` AJAX to search for the pieces matching search criteria
1. **background.js** intercepts this request and stores the response in cache
1. **BROWSER** displays the LEGO pieces listing to the **USER**
1. **contentScript.js** realizes that the page has been fully loaded (which is actually quite tricky) and adds the `Check Price` button for every LEGO piece row.
1. **USER** clicks the `Check Price` button
1. **contentScript.js** asks **background.js** for more details about the clicked LEGO piece e.g. `itemID`, `itemNo`, `itemType`, `colorID` etc.
1. **background.js** uses the intercepted response data to provide more details about clicked item
1. **contentScript.js** sends request for the prices of the selected item (`itemID`) in selected color (`colorID`)
1. **contentScript.js** injects the results onto page



## FAQ


**Q: Does this really save money?**

As mentioned before, some LEGO parts can be very expensive. The primary motivation are following situations:

* large models with lots of parts - saving $0.10 per part can accumulate
* minifigs - all minifigures are quite expensive, so saving just a 5% on each one adds up
* rare parts that have irregular prices

This extension still requires You to do quite a lot of work, but I hope it will allow You to make a better informed decisions.


**Q: Why the `Check Price` button? Why not load all prices after page is loaded?**

This would generate a lot of traffic for the bricklink servers. We are hacking additional functionality to their page, but no reason to be rude.


**Q: Which currency does this extension use?**

Works for me in my native currency, so I guess the one selected in your bricklink profile. Cookies ftw.


**Q: Why does it only work on firefox?**

Chrome lacks tools to intercept the AJAX response. AFAIK it is possible through chrome extensions dev tools API, but I did not bother investigating it. See [addRequestDoneListener.js](src/background/addRequestDoneListener.js) for firefox implementation.


**Q: Where can I get this extension?**

This extension is distributed as a source code. I have not uploaded it publicly to any of the browser add-on stores or anything like that. The page that You are reading is the only author-endorsed way to get this extension.

I am aware that this limits the potential user base. I am fine with it. Having the extension publicly available would mean that I am willing to provide some form of tech support for it. Well, I am not. For all intents and purposes this is just a simple app created for my own amusement. It may sound harsh, but keep in mind stories like [left-pad](https://www.davidhaney.io/npm-left-pad-have-we-forgotten-how-to-program/) and [event-stream](https://github.com/dominictarr/event-stream/issues/116).


**Q: Why not React/Preact/Typescript?**

If You've read the "How does it work" paragraph, You will see that this question misses the point of why this *simple* extension is actually quite interesting from tech standpoint. Feel free to refactor the code if You want. Personally I'd rather be building [LEGO Hogwart MOC](https://rebrickable.com/mocs/MOC-25280/MOMAtteo79/h%D6%85gwarts-castle-architecture/#photos) or [21326 Winnie the Pooh set](https://ideas.lego.com/blogs/a4ae09b6-0d4c-4307-9da8-3ee9f3d368d6/post/d1d9a4d9-3c8e-4ad4-a168-18560cd72db2) (for my nieces of course).


## Installation

My [previous browser extension](https://github.com/Scthe/spotify-lyrics-web-extension) was quite hard to install, so this time I've created separate instruction file: [INSTALL.md](INSTALL.md).



[ext-preview]:gh-images/readme-preview.png
