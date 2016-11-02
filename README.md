# Font Uploader and Test:

### About
I was browsing Reddit, and saw someone asking for this. So I figured it would not be to hard to create. There are a lot of ways to do this. I could have just saved everything to a JSON file, which might have been better, but this works. I don't plan to support it, or update it, but if you want to use please feel free. I also could have refactored some of the font_actions, but I did not. If you want to please feel free.


### What it Does:
Upload fonts, and test them out. Saves the font to the server and updates the dom with the new font to test out. Auto generates new css and reloads it without page refresh.

### See it in Action:
https://font-test.herokuapp.com/


### Use:
1. Download the repo, 
2. Run npm install, 
3. start the server: $ nodemon server.js (must have node installed) 
4. Goto http://localhost:8080/, and start typing in some text. 
5. Upload a font from your computer, and test it out. 
  1. Supported font type: .tff / .woff / .eot


