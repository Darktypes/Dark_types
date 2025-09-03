
# Arman Hasan — White Theme Website (Web3Forms Ready)

A clean, official white-theme website with pages for Home, About, Contact (Web3Forms), Terms, Privacy, and a Thank You page.

## How to use

1. **Open `contact.html` and replace** `YOUR_ACCESS_KEY_HERE` with your real Web3Forms Access Key.
   - Get your key here: https://web3forms.com/ (Create Access Key)
2. **Set the redirect URL** (optional): in `contact.html`, change the `redirect` value to your live `thanks.html` URL (absolute URL recommended on production).
3. **Edit content** as you like in `index.html`, `about.html`, `terms.html`, `privacy.html`.
4. **Deploy** on GitHub Pages or any static host by uploading all files.

## Notes
- The form uses **hCaptcha** via Web3Forms for spam protection. The required script is already included at the bottom of `contact.html`.
- Your public email is displayed in the footer: `arman.hasan09424@gmail.com`. Change it in `script.js`/HTML if needed.
- All styles are in `styles.css`. Colors are defined with CSS variables at the top.
