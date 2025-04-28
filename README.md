# PlainTech Solutions – Website

Welcome to the PlainTech Solutions website project. This site is built using modular HTML with Tailwind CSS, and is designed to be clean, modern, and easy to maintain.

SiteLink: https://roberto-rodriguez-01.github.io/

## Name Ideas

## 📁 Project Structure

This project uses a modular file structure to separate concerns and make it easier to work on different sections of the site.

```
plaintech-site/
├── index.html               # Main HTML file (uses includes)
├── _includes/               # Reusable partials
│   ├── head.html
│   ├── header.html
│   ├── hero.html
│   ├── value-banner.html
│   ├── services.html
│   ├── why-us.html
│   ├── clients.html
│   ├── partner.html
│   ├── contact.html
│   ├── footer.html
│   └── modal.html
├── css/
│   └── style.css            # Custom styles
├── js/
│   ├── main.js              # Site interactivity (dark mode, modal, scroll)
│   └── tailwind.config.js   # Tailwind custom theme config
└── README.md
```

## 🚀 Technologies Used

- **HTML5** – Modular structure using includes
- **Tailwind CSS** – Utility-first styling via CDN
- **JavaScript** – Interactivity and modal handling
- **Remix Icon** – For UI icons
- **Google Fonts** – Pacifico and Inter

## 🧩 Key Features

- Modular layout with maintainable sections
- Mobile-responsive design
- Dark mode toggle with persistence
- Modal for dynamic content (e.g., “Learn More” interactions)
- Contact form (non-functional, placeholder logic)

## 🛠 Working on the Site

- All sections are broken into individual partials in `_includes/` (or `partials/`)
- Only `index.html` stitches everything together using `{% include file.html %}` 
- All custom CSS is in `css/style.css`
- All scripts are in `js/main.js`

## 📌 Notes for Developers

- **Don't modify** `index.html` directly except for include ordering or page-level scripts.
- Make sure to test **mobile responsiveness** for any new content.
- When adding new styles, try using Tailwind utilities first. Add to `style.css` only if necessary.
- If updating Tailwind config, do so in `js/tailwind.config.js`.
- To install Jekyll and run the sever? do the following:
  - download Ruby & RubyGems
  - download Node.js and Yarn (needed for certain plugins like TailwindCSS)
  - once ruby is installed install Bundler & Jekyll
    - `gem install bundler jekyll`
  - `cd` into the site folder
  - `bundle install`
  - `bundle exec jekyll serve`

## 📦 Deployment

This site is intended to be deployed via **GitHub Pages**. Push to the `main` branch and ensure GitHub Pages is set to build from it.
