# PlainTech Solutions – Website

Welcome to the PlainTech Solutions website project. This site is built using modular HTML with Tailwind CSS, and is designed to be clean, modern, and easy to maintain.

SiteLink: https://roberto-rodriguez-01.github.io/

## 🚀 Technologies Used

- **HTML5** – Modular structure using includes
- **Tailwind CSS** – Utility-first styling via CDN
- **JavaScript** – Interactivity and modal handling
- **Remix Icon** – For UI icons
- **Google Fonts** – Pacifico and Inter

## 🛠 Working on the Site

- All sections are broken into individual partials in `_includes/` (or `partials/`)
- Only `index.html` stitches everything together using `{% include file.html %}` 
- All custom CSS is in `css/style.css`
- All scripts are in `js/main.js`
- If you add a new page that is not going to be on the main page add that page to the "pages" folder.
- when adding a new page make sure to include the following so we keep a constatnt page layout:
```html
  <head>
    {% include head.html %}
  </head>
  <body>
    {% include header.html %}
    ...
  </body>
  ...
  <footer>
    {% include footer.html %}
  </footer>
```

## 📌 Notes for Developers

- **Don't modify** `index.html` directly except for include ordering or page-level scripts.
- Make sure to test **mobile responsiveness** for any new content.
- When adding new styles, try using Tailwind utilities first. Add to `style.css` only if necessary.
- If updating Tailwind config, do so in `js/tailwind.config.js`.
- To install Jekyll and run the sever do the following:
  - download Ruby & RubyGems
  - download Node.js and Yarn (needed for certain plugins like TailwindCSS)
  - once ruby is installed install Bundler & Jekyll
    - `gem install bundler jekyll`
  - `cd` into the site folder
  - `bundle install`
  - `bundle exec jekyll serve`

## 📦 Deployment

This site is intended to be deployed via **GitHub Pages**. Push to the `main` branch and ensure GitHub Pages is set to build from it.
